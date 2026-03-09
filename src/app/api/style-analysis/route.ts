import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ROOT = process.cwd();
const ANALYSIS_DIR = path.join(ROOT, 'data', 'analysis');
const CODEX_JSON = path.join(ROOT, 'data', 'json', 'codex_translations.json');

// Pipeline steps mapped to their scripts and expected outputs
const PIPELINE_STEPS: Record<string, { script: string; args?: string; output?: string; description: string }> = {
  'extract-dialogue': {
    script: 'scripts/pipeline/extract-dialogue-by-speaker.js',
    output: 'speaker-dialogue.csv',
    description: 'Extract English dialogue by speaker',
  },
  'extract-dutch-dialogue': {
    script: 'scripts/pipeline/extract-dutch-dialogue-by-speaker.js',
    output: 'speaker-dutch-dialogue.csv',
    description: 'Extract Dutch dialogue by speaker',
  },
  'analyze-styles': {
    script: 'scripts/pipeline/analyze-speaker-styles.js',
    output: 'speaker-styles.json',
    description: 'Analyze English speaking styles (Claude API)',
  },
  'analyze-dutch-styles': {
    script: 'scripts/pipeline/analyze-dutch-styles.js',
    output: 'speaker-dutch-styles.json',
    description: 'Analyze Dutch translation styles (Claude API)',
  },
  'import-styles': {
    script: 'scripts/pipeline/import-styles-to-codex.js',
    args: '--apply',
    description: 'Import English styles into codex',
  },
  'import-dutch-styles': {
    script: 'scripts/pipeline/import-dutch-styles-to-codex.js',
    args: '--apply',
    description: 'Import Dutch styles into codex',
  },
};

interface FileStatus {
  exists: boolean;
  size?: number;
  modified?: string;
  entries?: number;
}

async function getFileStatus(filePath: string): Promise<FileStatus> {
  try {
    const stat = await fs.stat(filePath);
    const result: FileStatus = {
      exists: true,
      size: stat.size,
      modified: stat.mtime.toISOString(),
    };
    // For JSON files, count entries
    if (filePath.endsWith('.json')) {
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          result.entries = data.length;
        } else if (data.entries && Array.isArray(data.entries)) {
          result.entries = data.entries.length;
        } else {
          result.entries = Object.keys(data).length;
        }
      } catch { /* ignore parse errors */ }
    }
    // For CSV files, count lines (minus header)
    if (filePath.endsWith('.csv')) {
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        const lines = raw.trim().split('\n');
        result.entries = Math.max(0, lines.length - 1);
      } catch { /* ignore read errors */ }
    }
    return result;
  } catch {
    return { exists: false };
  }
}

// GET: Return status of all analysis files + codex enrichment state
export async function GET() {
  try {
    const [dialogue, dutchDialogue, styles, dutchStyles, codex] = await Promise.all([
      getFileStatus(path.join(ANALYSIS_DIR, 'speaker-dialogue.csv')),
      getFileStatus(path.join(ANALYSIS_DIR, 'speaker-dutch-dialogue.csv')),
      getFileStatus(path.join(ANALYSIS_DIR, 'speaker-styles.json')),
      getFileStatus(path.join(ANALYSIS_DIR, 'speaker-dutch-styles.json')),
      getFileStatus(CODEX_JSON),
    ]);

    // Count how many codex characters have style fields
    let enrichedCount = 0;
    let dutchEnrichedCount = 0;
    let totalCharacters = 0;
    try {
      const raw = await fs.readFile(CODEX_JSON, 'utf8');
      const data = JSON.parse(raw);
      const characters = data.entries.filter((e: { category: string }) => e.category === 'CHARACTER');
      totalCharacters = characters.length;
      enrichedCount = characters.filter((e: { dialogueStyle?: string }) => e.dialogueStyle).length;
      dutchEnrichedCount = characters.filter((e: { dutchDialogueStyle?: string }) => e.dutchDialogueStyle).length;
    } catch { /* ignore */ }

    // Check if ANTHROPIC_API_KEY is configured
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

    return NextResponse.json({
      hasApiKey,
      files: {
        dialogue,
        dutchDialogue,
        styles,
        dutchStyles,
      },
      codex: {
        ...codex,
        totalCharacters,
        enrichedCount,
        dutchEnrichedCount,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Run a specific pipeline step
export async function POST(request: NextRequest) {
  let body: { step: string; dryRun?: boolean; speaker?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { step, dryRun, speaker } = body;

  const stepConfig = PIPELINE_STEPS[step];
  if (!stepConfig) {
    return NextResponse.json(
      { error: `Unknown step: ${step}. Valid: ${Object.keys(PIPELINE_STEPS).join(', ')}` },
      { status: 400 }
    );
  }

  // Build command
  let cmd = `node ${stepConfig.script}`;

  // For analysis steps, support dry-run and speaker filtering
  if (dryRun && (step === 'analyze-styles' || step === 'analyze-dutch-styles')) {
    cmd += ' --dry-run';
  } else if (stepConfig.args && !dryRun) {
    cmd += ` ${stepConfig.args}`;
  }

  if (speaker && (step === 'analyze-styles' || step === 'analyze-dutch-styles')) {
    cmd += ` --speaker="${speaker}"`;
  }

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: ROOT,
      timeout: 300000, // 5 minute timeout for analysis steps
      env: { ...process.env },
    });

    return NextResponse.json({
      success: true,
      step,
      output: stdout,
      warnings: stderr || undefined,
    });
  } catch (err: unknown) {
    const execErr = err as { stdout?: string; stderr?: string; message?: string };
    return NextResponse.json({
      success: false,
      step,
      error: execErr.message || 'Script execution failed',
      output: execErr.stdout || '',
      warnings: execErr.stderr || '',
    }, { status: 500 });
  }
}

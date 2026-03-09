import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * POST /api/download-sheets
 *
 * Downloads all source Google Sheets as .xlsx into /excels and /excels/Originals.
 * Runs scripts/download-sheets.js as a subprocess (~10-30s for 11 files).
 */
export async function POST() {
  try {
    const { stdout, stderr } = await execAsync('node scripts/download-sheets.js', {
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes — generous for 11 network downloads
      env: { ...process.env },
    });

    return NextResponse.json({
      success: true,
      message: 'All sheets downloaded successfully',
      output: stdout,
      warnings: stderr || undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error downloading sheets:', error);
    return NextResponse.json(
      {
        error: 'Download failed',
        output: error.stdout || undefined,
        stderr: error.stderr || undefined,
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

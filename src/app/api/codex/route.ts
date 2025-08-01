import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Format file/folder names to readable titles
 * 
 * Converts kebab-case or snake_case filenames to Title Case format
 * and removes file extensions for display purposes.
 * 
 * @param name - Raw filename or folder name
 * @returns Formatted display name
 * 
 * @example
 * formatName("butte-mines.md") // returns "Butte Mines"
 * formatName("big_ass.md") // returns "Big Ass"
 */
function formatName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')        // Replace hyphens and underscores with spaces
    .replace(/\.md$/, '')         // Remove .md extension
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * GET /api/codex
 * 
 * Reads and returns the entire codex structure from the filesystem.
 * The codex contains character information, world lore, and reference
 * materials for the AM Translations project.
 * 
 * Directory Structure Expected:
 * codex/
 *   ├── Main Asses/       (Main character files)
 *   ├── Supporting Asses/ (Supporting character files)
 *   ├── Places/          (Location descriptions)
 *   ├── Themes/          (Thematic reference)
 *   ├── World/           (World-building documents)
 *   └── *.md             (Root-level overview files)
 * 
 * @returns JSON response with categorized codex entries
 * 
 * Response Structure:
 * {
 *   "Main Asses": [
 *     {
 *       name: "Big Ass",
 *       path: "Main Asses/big-ass.md",
 *       content: "Full markdown content...",
 *       category: "Main Asses"
 *     },
 *     ...
 *   ],
 *   "Supporting Asses": [...],
 *   ...
 * }
 */
export async function GET() {
  try {
    const codexPath = path.join(process.cwd(), 'codex');
    
    // Check if codex directory exists
    if (!fs.existsSync(codexPath)) {
      return NextResponse.json({ error: 'Codex directory not found' }, { status: 404 });
    }

    // Get all categories (subdirectories) and sort them alphabetically
    const categories = fs.readdirSync(codexPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    const codexStructure: Record<string, any[]> = {};

    // Process each category directory
    for (const category of categories) {
      const categoryPath = path.join(codexPath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))     // Only process markdown files
        .sort()                                   // Alphabetical sorting
        .map(file => {
          const filePath = path.join(categoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          return {
            name: formatName(file),               // Human-readable name
            path: `${category}/${file}`,          // Relative path for reference
            content: content,                     // Full markdown content
            category: category                    // Category for grouping
          };
        });
      
      codexStructure[category] = files;
    }

    // Also process root-level markdown files (overview documents)
    const rootFiles = fs.readdirSync(codexPath)
      .filter(file => file.endsWith('.md'))
      .sort()
      .map(file => {
        const filePath = path.join(codexPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          name: formatName(file),
          path: file,
          content: content,
          category: 'Root'                        // Special category for root files
        };
      });

    // Only add root category if there are files
    if (rootFiles.length > 0) {
      codexStructure['Root'] = rootFiles;
    }

    return NextResponse.json(codexStructure);
  } catch (error) {
    // Log error for debugging (commented out in production)
    // console.error('Error reading codex:', error);
    return NextResponse.json({ error: 'Failed to read codex data' }, { status: 500 });
  }
} 
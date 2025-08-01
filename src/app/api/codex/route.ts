import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to format file/folder names to readable titles
function formatName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\.md$/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function GET() {
  try {
    const codexPath = path.join(process.cwd(), 'codex');
    
    // Check if codex directory exists
    if (!fs.existsSync(codexPath)) {
      return NextResponse.json({ error: 'Codex directory not found' }, { status: 404 });
    }

    // Get all categories (subdirectories) and sort them
    const categories = fs.readdirSync(codexPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    const codexStructure: Record<string, any[]> = {};

    // Read each category
    for (const category of categories) {
      const categoryPath = path.join(codexPath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))
        .sort()
        .map(file => {
          const filePath = path.join(categoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          return {
            name: formatName(file),
            path: `${category}/${file}`,
            content: content,
            category: category
          };
        });
      
      codexStructure[category] = files;
    }

    // Also read root-level markdown files
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
          category: 'Root'
        };
      });

    if (rootFiles.length > 0) {
      codexStructure['Root'] = rootFiles;
    }

    return NextResponse.json(codexStructure);
  } catch (error) {
    console.error('Error reading codex:', error);
    return NextResponse.json({ error: 'Failed to read codex data' }, { status: 500 });
  }
} 
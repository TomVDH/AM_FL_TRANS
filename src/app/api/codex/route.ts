import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const codexPath = path.join(process.cwd(), 'codex');
    
    // Check if codex directory exists
    if (!fs.existsSync(codexPath)) {
      return NextResponse.json({ error: 'Codex directory not found' }, { status: 404 });
    }

    // Get all categories (subdirectories)
    const categories = fs.readdirSync(codexPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const codexStructure: Record<string, any[]> = {};

    // Read each category
    for (const category of categories) {
      const categoryPath = path.join(codexPath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const filePath = path.join(categoryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          return {
            name: file.replace('.md', ''),
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
      .map(file => {
        const filePath = path.join(codexPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          name: file.replace('.md', ''),
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
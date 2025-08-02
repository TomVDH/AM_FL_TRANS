import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonDir = path.join(process.cwd(), 'data', 'json');
    
    // Check if directory exists
    if (!fs.existsSync(jsonDir)) {
      return NextResponse.json([]);
    }
    
    // Read all JSON files
    const files = fs.readdirSync(jsonDir)
      .filter(file => file.endsWith('.json'));
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading JSON files:', error);
    return NextResponse.json([], { status: 500 });
  }
} 
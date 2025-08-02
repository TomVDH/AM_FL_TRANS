import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }
    
    const jsonPath = path.join(process.cwd(), 'data', 'json', `${file}.json`);
    
    // Check if file exists
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Read and parse JSON file
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading JSON data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
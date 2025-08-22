import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * CSV Files API Endpoint
 * 
 * Returns a list of available CSV files from the data/csv directory
 */
export async function GET() {
  try {
    const csvDir = path.join(process.cwd(), 'data', 'csv');
    
    // Check if CSV directory exists
    if (!fs.existsSync(csvDir)) {
      return NextResponse.json([]);
    }
    
    // Read all files from CSV directory
    const files = fs.readdirSync(csvDir);
    
    // Filter for CSV files only (exclude summary files)
    const csvFiles = files
      .filter(file => file.endsWith('.csv'))
      .filter(file => !file.includes('summary'))
      .sort();
    
    return NextResponse.json(csvFiles);
    
  } catch (error) {
    console.error('Error listing CSV files:', error);
    return NextResponse.json(
      { error: 'Failed to list CSV files' },
      { status: 500 }
    );
  }
}
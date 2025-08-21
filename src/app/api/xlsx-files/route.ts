import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

/**
 * XLSX Files API Endpoint
 * 
 * Returns available XLSX files and their sheet information
 * Can also search within XLSX files directly
 */

interface XLSXFileInfo {
  fileName: string;
  sheets: string[];
  fileSize?: number;
  lastModified?: string;
}

interface XLSXSearchResult {
  fileName: string;
  sheetName: string;
  matches: Array<{
    row: number;
    utterer: string;
    context: string;
    sourceEnglish: string;
    translatedDutch: string;
    key?: string;
  }>;
}

/**
 * GET /api/xlsx-files
 * 
 * Returns list of available XLSX files with sheet information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileParam = searchParams.get('file');
    
    const excelDir = path.join(process.cwd(), 'excels');
    
    // Check if excels directory exists
    if (!fs.existsSync(excelDir)) {
      return NextResponse.json({ files: [] });
    }
    
    // If specific file requested, return its sheets
    if (fileParam) {
      const filePath = path.join(excelDir, fileParam);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: `File not found: ${fileParam}` },
          { status: 404 }
        );
      }
      
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        return NextResponse.json({
          fileName: fileParam,
          sheets: workbook.SheetNames
        });
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to read Excel file: ${fileParam}` },
          { status: 500 }
        );
      }
    }
    
    // Return all available XLSX files with their sheet information
    const files = fs.readdirSync(excelDir);
    const xlsxFiles: XLSXFileInfo[] = [];
    
    for (const file of files) {
      if (file.endsWith('.xlsx')) {
        try {
          const filePath = path.join(excelDir, file);
          console.log(`Attempting to read: ${filePath}`);
          
          // Check if file exists and is readable
          if (!fs.existsSync(filePath)) {
            console.error(`File does not exist: ${filePath}`);
            continue;
          }
          
          const stats = fs.statSync(filePath);
          console.log(`File stats: size=${stats.size}, modified=${stats.mtime}`);
          
          // Try to read the workbook with error handling
          const fileBuffer = fs.readFileSync(filePath);
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          
          xlsxFiles.push({
            fileName: file,
            sheets: workbook.SheetNames,
            fileSize: stats.size,
            lastModified: stats.mtime.toISOString()
          });
          
          console.log(`Successfully read ${file} with sheets: ${workbook.SheetNames.join(', ')}`);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          // Skip files that can't be read
        }
      }
    }
    
    return NextResponse.json({
      files: xlsxFiles.sort((a, b) => a.fileName.localeCompare(b.fileName))
    });
    
  } catch (error) {
    console.error('Error listing XLSX files:', error);
    return NextResponse.json(
      { error: 'Failed to list XLSX files' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/xlsx-files
 * 
 * Search within XLSX files directly
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, searchTerm, selectedSheet, globalSearch = false } = body;
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing required parameter: fileName' },
        { status: 400 }
      );
    }
    
    const excelDir = path.join(process.cwd(), 'excels');
    const filePath = path.join(excelDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${fileName}` },
        { status: 404 }
      );
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const results: XLSXSearchResult[] = [];
    
    // Determine which sheets to search
    const sheetsToSearch = globalSearch 
      ? workbook.SheetNames 
      : selectedSheet 
        ? [selectedSheet] 
        : workbook.SheetNames;
    
    sheetsToSearch.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: ''
      });
      
      const matches: XLSXSearchResult['matches'] = [];
      
      // Process rows (skip header row)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.length === 0) continue;
        
        const entry = {
          row: i + 1,
          utterer: row[0] ? row[0].toString().trim() : '',
          context: row[1] ? row[1].toString().trim() : '',
          sourceEnglish: row[2] ? row[2].toString().trim() : '',
          translatedDutch: row[9] ? row[9].toString().trim() : '', // Column J
          key: row[10] ? row[10].toString().trim() : '' // Column K if exists
        };
        
        // Only include rows with source text
        if (!entry.sourceEnglish) continue;
        
        // Search logic
        let isMatch = false;
        
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          
          if (
            entry.sourceEnglish.toLowerCase().includes(searchLower) ||
            entry.translatedDutch.toLowerCase().includes(searchLower) ||
            entry.utterer.toLowerCase().includes(searchLower) ||
            entry.context.toLowerCase().includes(searchLower)
          ) {
            isMatch = true;
          }
        } else {
          // If no search term, return all entries (for browsing)
          isMatch = true;
        }
        
        if (isMatch) {
          matches.push(entry);
        }
      }
      
      if (matches.length > 0) {
        results.push({
          fileName,
          sheetName,
          matches
        });
      }
    });
    
    return NextResponse.json({
      fileName,
      searchTerm,
      selectedSheet,
      globalSearch,
      totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      results,
      searchedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error searching XLSX file:', error);
    return NextResponse.json(
      { error: 'Failed to search XLSX file' },
      { status: 500 }
    );
  }
}
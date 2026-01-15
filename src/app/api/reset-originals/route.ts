import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/**
 * POST /api/reset-originals
 *
 * Nuclear reset: Copies all files from /excels/Originals/ to /excels/
 * WARNING: This will overwrite all Excel files with the originals.
 */
export async function POST(request: NextRequest) {
  try {
    const excelsDir = path.join(process.cwd(), 'excels');
    const originalsDir = path.join(excelsDir, 'Originals');

    // Check if Originals directory exists
    if (!fs.existsSync(originalsDir)) {
      return NextResponse.json(
        { error: 'Originals folder not found at /excels/Originals/' },
        { status: 404 }
      );
    }

    // Get all files from Originals folder
    const originalFiles = fs.readdirSync(originalsDir).filter(file =>
      file.endsWith('.xlsx') || file.endsWith('.xls')
    );

    if (originalFiles.length === 0) {
      return NextResponse.json(
        { error: 'No Excel files found in Originals folder' },
        { status: 404 }
      );
    }

    // Copy each file from Originals to excels root
    const copiedFiles: string[] = [];
    const errors: string[] = [];

    for (const file of originalFiles) {
      try {
        const sourcePath = path.join(originalsDir, file);
        const destPath = path.join(excelsDir, file);

        // Copy file (overwrites existing)
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles.push(file);
      } catch (error) {
        errors.push(`Failed to copy ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Return success response with details
    return NextResponse.json({
      success: true,
      message: `Reset complete: ${copiedFiles.length} file(s) restored`,
      copiedFiles,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error resetting originals:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

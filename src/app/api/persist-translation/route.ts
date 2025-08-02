import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { fileName, rowNumber, newTranslation } = await request.json();

    if (!fileName || !rowNumber || newTranslation === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, rowNumber, newTranslation' },
        { status: 400 }
      );
    }

    // Construct the file path
    const jsonFilePath = path.join(process.cwd(), 'data', 'json', `${fileName}.json`);

    // Check if file exists
    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json(
        { error: `File ${fileName}.json not found` },
        { status: 404 }
      );
    }

    // Read the current JSON file
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // Find and update the entry with matching rowNumber
    let entryFound = false;
    
    if (jsonData.sheets) {
      // Handle multi-sheet structure (like READ_ME_LocalizationManual.json)
      for (const sheet of jsonData.sheets) {
        if (sheet.entries) {
          for (const entry of sheet.entries) {
            if (entry.rowNumber === rowNumber) {
              entry.translatedDutch = newTranslation;
              entryFound = true;
              break;
            }
          }
        }
        if (entryFound) break;
      }
    } else if (jsonData.entries) {
      // Handle single-sheet structure
      for (const entry of jsonData.entries) {
        if (entry.rowNumber === rowNumber) {
          entry.translatedDutch = newTranslation;
          entryFound = true;
          break;
        }
      }
    }

    if (!entryFound) {
      return NextResponse.json(
        { error: `Entry with row number ${rowNumber} not found` },
        { status: 404 }
      );
    }

    // Write the updated JSON back to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({
      success: true,
      message: `Translation updated successfully for row ${rowNumber}`,
      updatedTranslation: newTranslation
    });

  } catch (error) {
    console.error('Error persisting translation:', error);
    return NextResponse.json(
      { error: 'Failed to persist translation' },
      { status: 500 }
    );
  }
} 
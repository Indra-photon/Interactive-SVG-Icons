import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Security: only allow .json files
    if (!filename.endsWith('.json')) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Read registry file from public/r/
    const filePath = path.join(process.cwd(), 'public/r', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const registryData = JSON.parse(content);
    
    // For now, all icons are free - no auth check needed
    // TODO: Add auth check when premium icons are added
    
    return NextResponse.json(registryData);
    
  } catch (error) {
    console.error('Registry API error:', error);
    return NextResponse.json(
      { error: 'Icon not found' },
      { status: 404 }
    );
  }
}
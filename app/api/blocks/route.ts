import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/r/blocks.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error loading blocks:', error);
    return NextResponse.json(
      { error: 'Failed to load blocks' },
      { status: 500 }
    );
  }
}

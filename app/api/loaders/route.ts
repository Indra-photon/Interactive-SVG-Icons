import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/r/loaders.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error loading loaders:', error);
    return NextResponse.json(
      { error: 'Failed to load loaders' }, 
      { status: 500 }
    );
  }
}
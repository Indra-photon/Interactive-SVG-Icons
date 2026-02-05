import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { IconRegistry } from '@/types/icon';

export async function GET(request: NextRequest) {
  try {
    // Read master registry
    const registryPath = path.join(process.cwd(), 'public/r/icons.json');
    const content = await fs.readFile(registryPath, 'utf-8');
    const registry: IconRegistry = JSON.parse(content);
    
    // Get query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let filteredIcons = registry.icons;
    
    // Filter by category
    if (category) {
      filteredIcons = filteredIcons.filter(icon => 
        icon.category === category
      );
    }
    
    // Search in name and tags
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIcons = filteredIcons.filter(icon => 
        icon.name.toLowerCase().includes(searchLower) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return NextResponse.json({
      icons: filteredIcons,
      total: filteredIcons.length,
      version: registry.version
    });
    
  } catch (error) {
    console.error('Icons API error:', error);
    return NextResponse.json(
      { error: 'Failed to load icons' },
      { status: 500 }
    );
  }
}
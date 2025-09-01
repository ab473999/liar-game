import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Check if database URL is configured
    if (!process.env.POSTGRES_URL) {
      console.error('POSTGRES_URL not configured');
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const includeEasterEgg = searchParams.get('easterEgg') === 'true' || 
                            searchParams.get('easterEgg') === 'onnuri';
    
    let where = {};
    if (!includeEasterEgg) {
      where.easterEgg = false;
    }
    
    // Only fetch minimal data needed for display
    const themes = await prisma.theme.findMany({
      where,
      select: {
        id: true,
        type: true,
        nameKo: true,
        nameEn: true,
        nameIt: true,
        easterEgg: true
      },
      orderBy: { id: 'asc' }
    });
    
    // Transform to match the existing data structure
    const transformedThemes = themes.map(theme => ({
      id: theme.id,
      type: theme.type,
      typeKr: theme.nameKo,
      typeEn: theme.nameEn,
      typeIt: theme.nameIt,
      easterEgg: theme.easterEgg
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedThemes
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

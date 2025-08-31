import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeEasterEgg = searchParams.get('easterEgg') === 'true' || 
                            searchParams.get('easterEgg') === 'onnuri';
    
    let where = {};
    if (!includeEasterEgg) {
      where.easterEgg = false;
    }
    
    const themes = await prisma.theme.findMany({
      where,
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
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

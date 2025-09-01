import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeType = searchParams.get('theme');
    const language = searchParams.get('lang') || 'en';
    
    if (!themeType) {
      return NextResponse.json(
        { success: false, error: 'Theme parameter is required' },
        { status: 400 }
      );
    }
    
    // Find the theme
    const theme = await prisma.theme.findUnique({
      where: { type: themeType }
    });
    
    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }
    
    // Get all words for this theme - optimized query
    const words = await prisma.word.findMany({
      where: { themeId: theme.id },
      select: {
        wordKo: true,
        wordEn: true,
        wordIt: true
      }
    });
    
    // Format words based on language preference - always use English
    let formattedWords;
    if (language === 'en') {
      formattedWords = words.map(w => w.wordEn || w.wordKo);
    } else if (language === 'it') {
      formattedWords = words.map(w => w.wordIt || w.wordKo);
    } else {
      formattedWords = words.map(w => w.wordEn || w.wordKo); // Default to English
    }
    
    return NextResponse.json({
      success: true,
      data: {
        theme: themeType,
        words: formattedWords,
        kr: words.map(w => w.wordKo), // Keep compatibility with existing code
        en: words.map(w => w.wordEn).filter(Boolean),
        it: words.map(w => w.wordIt).filter(Boolean)
      }
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}

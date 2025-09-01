const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database for word counts by theme...\n');

    // Get all themes with their word counts
    const themesWithCounts = await prisma.theme.findMany({
      include: {
        _count: {
          select: {
            words: true
          }
        }
      },
      orderBy: {
        type: 'asc'
      }
    });

    if (themesWithCounts.length === 0) {
      console.log('❌ No themes found in the database');
      return;
    }

    console.log('📊 Word counts by theme:');
    console.log('─'.repeat(60));

    let totalWords = 0;
    let totalThemes = themesWithCounts.length;

    themesWithCounts.forEach(theme => {
      const wordCount = theme._count.words;
      totalWords += wordCount;
      
      const status = wordCount > 0 ? '✅' : '⚠️';
      console.log(`${status} ${theme.type.padEnd(20)} | ${wordCount.toString().padStart(3)} words`);
      
      // Show theme names if available
      if (theme.nameEn) {
        console.log(`   └─ ${theme.nameEn}`);
      }
    });

    console.log('─'.repeat(60));
    console.log(`📈 Summary:`);
    console.log(`   Total themes: ${totalThemes}`);
    console.log(`   Total words: ${totalWords}`);
    console.log(`   Average words per theme: ${totalThemes > 0 ? (totalWords / totalThemes).toFixed(1) : 0}`);

    // Show themes with no words
    const emptyThemes = themesWithCounts.filter(theme => theme._count.words === 0);
    if (emptyThemes.length > 0) {
      console.log(`\n⚠️  Themes with no words:`);
      emptyThemes.forEach(theme => {
        console.log(`   - ${theme.type} (${theme.nameEn || 'No English name'})`);
      });
    }

    // Show themes with most words
    const topThemes = themesWithCounts
      .filter(theme => theme._count.words > 0)
      .sort((a, b) => b._count.words - a._count.words)
      .slice(0, 3);

    if (topThemes.length > 0) {
      console.log(`\n🏆 Top themes by word count:`);
      topThemes.forEach((theme, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        console.log(`   ${medal} ${theme.type} (${theme.nameEn || 'No English name'}): ${theme._count.words} words`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabase();

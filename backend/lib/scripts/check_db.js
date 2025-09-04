const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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
    
    // Build the report content
    let reportContent = '';
    reportContent += '╔══════════════════════════════════════════════════════════╗\n';
    reportContent += '║           LIAR GAME DATABASE REPORT                       ║\n';
    reportContent += '║           Theme Word Count Analysis                       ║\n';
    reportContent += '╠══════════════════════════════════════════════════════════╣\n';
    reportContent += '║  Generated: ' + new Date().toLocaleString().padEnd(45) + '║\n';
    reportContent += '╚══════════════════════════════════════════════════════════╝\n\n';
    
    reportContent += '┌────────────────────────┬─────────────────────────┬──────────┐\n';
    reportContent += '│ Theme Type             │ Theme Name              │ Words    │\n';
    reportContent += '├────────────────────────┼─────────────────────────┼──────────┤\n';

    themesWithCounts.forEach(theme => {
      const wordCount = theme._count.words;
      totalWords += wordCount;
      
      const status = wordCount > 0 ? '✅' : '⚠️';
      console.log(`${status} ${theme.type.padEnd(20)} | ${wordCount.toString().padStart(3)} words`);
      
      // Show theme names if available
      if (theme.nameEn) {
        console.log(`   └─ ${theme.nameEn}`);
      }
      
      // Add to report
      const themeType = theme.type.padEnd(22);
      const themeName = (theme.nameEn || 'N/A').padEnd(23);
      const wordCountStr = wordCount.toString().padStart(8);
      reportContent += `│ ${themeType} │ ${themeName} │ ${wordCountStr} │\n`;
    });
    
    reportContent += '└────────────────────────┴─────────────────────────┴──────────┘\n\n';

    console.log('─'.repeat(60));
    console.log(`📈 Summary:`);
    console.log(`   Total themes: ${totalThemes}`);
    console.log(`   Total words: ${totalWords}`);
    console.log(`   Average words per theme: ${totalThemes > 0 ? (totalWords / totalThemes).toFixed(1) : 0}`);
    
    // Add summary to report
    reportContent += '═══════════════════════════════════════════════════════════\n';
    reportContent += '                        SUMMARY                            \n';
    reportContent += '═══════════════════════════════════════════════════════════\n';
    reportContent += `Total Themes:           ${totalThemes}\n`;
    reportContent += `Total Words:            ${totalWords}\n`;
    reportContent += `Average Words/Theme:    ${totalThemes > 0 ? (totalWords / totalThemes).toFixed(1) : 0}\n`;
    reportContent += '\n';

    // Show themes with no words
    const emptyThemes = themesWithCounts.filter(theme => theme._count.words === 0);
    if (emptyThemes.length > 0) {
      console.log(`\n⚠️  Themes with no words:`);
      reportContent += '───────────────────────────────────────────────────────────\n';
      reportContent += '                   THEMES WITH NO WORDS                    \n';
      reportContent += '───────────────────────────────────────────────────────────\n';
      emptyThemes.forEach(theme => {
        console.log(`   - ${theme.type} (${theme.nameEn || 'No English name'})`);
        reportContent += `• ${theme.type} (${theme.nameEn || 'No English name'})\n`;
      });
      reportContent += '\n';
    }

    // Show themes with most words
    const topThemes = themesWithCounts
      .filter(theme => theme._count.words > 0)
      .sort((a, b) => b._count.words - a._count.words)
      .slice(0, 3);

    if (topThemes.length > 0) {
      console.log(`\n🏆 Top themes by word count:`);
      reportContent += '───────────────────────────────────────────────────────────\n';
      reportContent += '                  TOP THEMES BY WORD COUNT                 \n';
      reportContent += '───────────────────────────────────────────────────────────\n';
      topThemes.forEach((theme, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        const position = index === 0 ? '1st' : index === 1 ? '2nd' : '3rd';
        console.log(`   ${medal} ${theme.type} (${theme.nameEn || 'No English name'}): ${theme._count.words} words`);
        reportContent += `${position}: ${theme.type} (${theme.nameEn || 'No English name'}): ${theme._count.words} words\n`;
      });
    }
    
    // Save report to file
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const fileName = `theme_word_count_${timestamp}.txt`;
    const filePath = path.join(reportsDir, fileName);
    
    fs.writeFileSync(filePath, reportContent, 'utf8');
    console.log(`\n💾 Report saved to: ${filePath}`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabase();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import local data files
const foodData = require('../data/food.json');
const placeData = require('../data/place.json');
const occupationData = require('../data/occupation.json');
const bibleCharacterData = require('../data/biblecharacter.json');
const onnuriTeamData = require('../data/onnurichanyangteammember.json');

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.word.deleteMany();
  await prisma.theme.deleteMany();
  console.log('✨ Cleared existing data');

  // Create themes
  const themes = [
    { type: 'food', nameKo: '음식', nameEn: 'Food', nameIt: 'Cibo', easterEgg: false },
    { type: 'place', nameKo: '장소', nameEn: 'Places', nameIt: 'Luoghi', easterEgg: false },
    { type: 'occupation', nameKo: '직업', nameEn: 'Occupations', nameIt: 'Professioni', easterEgg: false },
    { type: 'animal', nameKo: '동물', nameEn: 'Animals', nameIt: 'Animali', easterEgg: false },
    { type: 'activity', nameKo: '활동', nameEn: 'Activities', nameIt: 'Attività', easterEgg: false },
    { type: 'dailyObject', nameKo: '일상용품', nameEn: 'Daily Objects', nameIt: 'Oggetti Quotidiani', easterEgg: false },
    { type: 'biblecharacter', nameKo: '성경인물', nameEn: 'Bible Characters', nameIt: 'Personaggi Biblici', easterEgg: false },
    { type: 'onnurichanyangteammember', nameKo: '온누리 찬양팀', nameEn: 'Onnuri Worship Team', nameIt: 'Team di Lode Onnuri', easterEgg: true },
  ];

  for (const theme of themes) {
    await prisma.theme.create({
      data: theme
    });
  }
  console.log(`✅ Created ${themes.length} themes`);

  // Helper function to insert words for a theme
  async function insertWords(themeType, wordsKo, wordsEn = [], wordsIt = []) {
    const theme = await prisma.theme.findUnique({ where: { type: themeType } });
    if (!theme) {
      console.log(`❌ Theme ${themeType} not found`);
      return;
    }

    const wordData = wordsKo.map((wordKo, index) => ({
      themeId: theme.id,
      wordKo: wordKo,
      wordEn: wordsEn[index] || null,
      wordIt: wordsIt[index] || null
    }));

    await prisma.word.createMany({ data: wordData });
    console.log(`✅ Added ${wordData.length} words for theme: ${themeType}`);
  }

  // Insert food words
  await insertWords('food', foodData.kr, 
    ['Jajangmyeon', 'Pizza', 'Samgyetang', 'Jjimdak', 'Gourmet Burger', 'Bagel', 'Coriander', 'Sushi', 'Bubble Tea', 'Tteokbokki', 
     'Fried Rice', 'Curry Rice', 'Milk', 'Chicken', 'McDonald\'s', 'Taco', 'Cake', 'Buffalo Wings', 'Kimchi', 'Jalapeño',
     'Kimbap', 'Sundae Soup', 'Bingsu', 'Ice Cream', 'Sandwich'],
    ['Jajangmyeon', 'Pizza', 'Samgyetang', 'Pollo al Ginseng', 'Hamburger Gourmet', 'Bagel', 'Coriandolo', 'Sushi', 'Bubble Tea', 'Tteokbokki',
     'Riso Fritto', 'Riso al Curry', 'Latte', 'Pollo', 'McDonald\'s', 'Taco', 'Torta', 'Ali di Buffalo', 'Kimchi', 'Jalapeño',
     'Kimbap', 'Zuppa Sundae', 'Bingsu', 'Gelato', 'Sandwich']
  );

  // Insert place words
  await insertWords('place', placeData.kr,
    ['Bathroom', 'Park', 'Church', 'School', 'Kindergarten', 'Clothing Store', 'Department Store', 'Theater', 'Court', 'Soccer Field',
     'Concert Hall', 'Gym', 'Airport', 'Subway Station', 'Rest Area', 'Villa', 'Hotel', 'Company', 'Desert Island', 'Harbor',
     'Hometown', 'Driver\'s License Test Center', 'Post Office', 'Cafe', 'Bathhouse'],
    ['Bagno', 'Parco', 'Chiesa', 'Scuola', 'Asilo', 'Negozio di Vestiti', 'Grande Magazzino', 'Teatro', 'Tribunale', 'Campo di Calcio',
     'Sala Concerti', 'Palestra', 'Aeroporto', 'Stazione Metro', 'Area di Sosta', 'Villa', 'Hotel', 'Azienda', 'Isola Deserta', 'Porto',
     'Città Natale', 'Centro Esami Patente', 'Ufficio Postale', 'Caffè', 'Terme']
  );

  // Insert occupation words
  await insertWords('occupation', occupationData.kr,
    ['Developer', 'Graphic Designer', 'CEO', 'Taxi Driver', 'Accountant', 'Leather Craftsman', 'Singer', 'Unemployed', 'Judge', 'Politician',
     'President', 'King', 'Waiter', 'Cleaner', 'Housekeeper', 'Professor', 'Teacher', 'Pastor', 'Movie Actor', 'Pastor\'s Wife',
     'Housewife', 'Security Guard', 'Snack Bar Owner', 'Consultant', 'Lawyer'],
    ['Sviluppatore', 'Grafico', 'CEO', 'Tassista', 'Contabile', 'Artigiano del Cuoio', 'Cantante', 'Disoccupato', 'Giudice', 'Politico',
     'Presidente', 'Re', 'Cameriere', 'Addetto Pulizie', 'Governante', 'Professore', 'Insegnante', 'Pastore', 'Attore', 'Moglie del Pastore',
     'Casalinga', 'Guardia di Sicurezza', 'Proprietario di Snack Bar', 'Consulente', 'Avvocato']
  );

  // Insert bible character words
  await insertWords('biblecharacter', bibleCharacterData.kr,
    ['Peter', 'Adam', 'Enoch', 'Jesus', 'Methuselah', 'Ezekiel', 'Apostle Paul', 'David', 'Eve', 'Satan',
     'Uriah', 'Moses', 'Isaiah', 'John', 'Ruth', 'Caleb', 'Joshua', 'Habakkuk', 'Angel Gabriel', 'Jonah',
     'Esther', 'King Nebuchadnezzar', 'Joseph', 'Judas Iscariot', 'Noah'],
    ['Pietro', 'Adamo', 'Enoch', 'Gesù', 'Matusalemme', 'Ezechiele', 'Apostolo Paolo', 'Davide', 'Eva', 'Satana',
     'Uria', 'Mosè', 'Isaia', 'Giovanni', 'Rut', 'Caleb', 'Giosuè', 'Abacuc', 'Angelo Gabriele', 'Giona',
     'Ester', 'Re Nabucodonosor', 'Giuseppe', 'Giuda Iscariota', 'Noè']
  );

  // Insert Onnuri team members (Korean only)
  await insertWords('onnurichanyangteammember', onnuriTeamData.kr);

  // Insert some animal words (new theme)
  await insertWords('animal', 
    ['강아지', '고양이', '사자', '호랑이', '코끼리', '기린', '원숭이', '토끼', '거북이', '독수리', 
     '펭귄', '돌고래', '상어', '곰', '여우', '늑대', '말', '소', '돼지', '닭'],
    ['Dog', 'Cat', 'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Monkey', 'Rabbit', 'Turtle', 'Eagle',
     'Penguin', 'Dolphin', 'Shark', 'Bear', 'Fox', 'Wolf', 'Horse', 'Cow', 'Pig', 'Chicken'],
    ['Cane', 'Gatto', 'Leone', 'Tigre', 'Elefante', 'Giraffa', 'Scimmia', 'Coniglio', 'Tartaruga', 'Aquila',
     'Pinguino', 'Delfino', 'Squalo', 'Orso', 'Volpe', 'Lupo', 'Cavallo', 'Mucca', 'Maiale', 'Pollo']
  );

  // Insert some activity words (new theme)
  await insertWords('activity',
    ['수영', '달리기', '자전거 타기', '등산', '요리', '독서', '영화 보기', '게임', '쇼핑', '여행',
     '춤추기', '노래하기', '그림 그리기', '요가', '명상', '산책', '낚시', '캠핑', '운동', '공부'],
    ['Swimming', 'Running', 'Cycling', 'Hiking', 'Cooking', 'Reading', 'Watching Movies', 'Gaming', 'Shopping', 'Traveling',
     'Dancing', 'Singing', 'Drawing', 'Yoga', 'Meditation', 'Walking', 'Fishing', 'Camping', 'Exercise', 'Studying'],
    ['Nuoto', 'Corsa', 'Ciclismo', 'Escursionismo', 'Cucinare', 'Lettura', 'Guardare Film', 'Giocare', 'Shopping', 'Viaggiare',
     'Ballare', 'Cantare', 'Disegnare', 'Yoga', 'Meditazione', 'Camminare', 'Pesca', 'Campeggio', 'Esercizio', 'Studiare']
  );

  // Insert some daily object words (new theme)
  await insertWords('dailyObject',
    ['칫솔', '치약', '수건', '비누', '샴푸', '빗', '거울', '시계', '안경', '우산',
     '열쇠', '지갑', '가방', '신발', '옷걸이', '베개', '이불', '컵', '접시', '숟가락'],
    ['Toothbrush', 'Toothpaste', 'Towel', 'Soap', 'Shampoo', 'Comb', 'Mirror', 'Clock', 'Glasses', 'Umbrella',
     'Keys', 'Wallet', 'Bag', 'Shoes', 'Hanger', 'Pillow', 'Blanket', 'Cup', 'Plate', 'Spoon'],
    ['Spazzolino', 'Dentifricio', 'Asciugamano', 'Sapone', 'Shampoo', 'Pettine', 'Specchio', 'Orologio', 'Occhiali', 'Ombrello',
     'Chiavi', 'Portafoglio', 'Borsa', 'Scarpe', 'Appendiabiti', 'Cuscino', 'Coperta', 'Tazza', 'Piatto', 'Cucchiaio']
  );

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

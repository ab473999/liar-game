const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define words for each theme that needs them
const wordsData = {
  'anatomy': [
    'Appendix', 'Tonsils', 'Spleen', 'Gallbladder', 'Pancreas',
    'Earlobe', 'Belly Button', 'Nostril', 'Armpit', 'Kneecap',
    'Uvula', 'Tailbone', 'Wisdom Tooth', 'Funny Bone', 'Adam\'s Apple',
    'Pinky Toe', 'Eyebrow', 'Cuticle', 'Eyelash', 'Dimple',
    'Goosebumps', 'Knuckle', 'Nipple', 'Pubic Hair', 'Belly Fat',
    'Double Chin', 'Love Handles', 'Mole', 'Freckle', 'Wrinkle'
  ],
  'animals': [
    'Platypus', 'Axolotl', 'Pangolin', 'Quokka', 'Narwhal',
    'Sloth', 'Capybara', 'Alpaca', 'Blobfish', 'Aye-aye',
    'Naked Mole Rat', 'Star-nosed Mole', 'Mantis Shrimp', 'Tardigrade', 'Proboscis Monkey',
    'Shoebill', 'Glassfrog', 'Leafy Seadragon', 'Okapi', 'Fossa',
    'Gharial', 'Echidna', 'Wombat', 'Tapir', 'Anteater',
    'Manatee', 'Aardvark', 'Binturong', 'Kiwi', 'Dung Beetle'
  ],
  'car-brands': [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW',
    'Mercedes-Benz', 'Audi', 'Volkswagen', 'Nissan', 'Hyundai',
    'Tesla', 'Porsche', 'Ferrari', 'Lamborghini', 'Mazda',
    'Subaru', 'Lexus', 'Volvo', 'Jeep', 'Cadillac',
    'Bentley', 'Rolls-Royce', 'Maserati', 'BYD', 'Land Rover'
  ],
  'clothes': [
    'Crocs', 'Onesie', 'Poncho', 'Cargo Pants', 'Crop Top',
    'Fishnet', 'Overalls', 'Romper', 'Bodysuit', 'Fanny Pack',
    'Tube Top', 'Daisy Dukes', 'Parachute Pants', 'Jorts', 'Croptop Hoodie',
    'Toe Socks', 'Thong', 'Mankini', 'Lederhosen', 'Kilt',
    'Speedo', 'Unitard', 'Zoot Suit', 'Jumpsuit', 'Dungarees',
    'Bucket Hat', 'Balaclava', 'Leg Warmers', 'Fingerless Gloves', 'Scrunchie',
    'Velour Tracksuit', 'Mesh Shirt', 'Assless Chaps', 'Platform Shoes', 'Uggs'
  ],
  'countries': [
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
    'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
    'Russia', 'China', 'Japan', 'India', 'Australia',
    'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Morocco',
    'Turkey', 'Greece', 'Poland', 'Sweden', 'Norway',
    'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
    'Denmark', 'Finland', 'Iceland', 'Ireland', 'Ukraine',
    'South Korea', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines',
    'Singapore', 'Malaysia', 'Pakistan', 'Bangladesh', 'Iran',
    'Saudi Arabia', 'Israel', 'UAE', 'Chile', 'Peru',
    'Colombia', 'Venezuela', 'Cuba', 'New Zealand', 'Romania'
  ],
  'disney': [
    'Mickey Mouse', 'Donald Duck', 'Goofy', 'Minnie Mouse', 'Pluto',
    'Cinderella', 'Snow White', 'Sleeping Beauty', 'Belle', 'Ariel',
    'Jasmine', 'Mulan', 'Pocahontas', 'Elsa', 'Anna',
    'Simba', 'Mufasa', 'Timon', 'Pumbaa', 'Aladdin',
    'Peter Pan', 'Tinker Bell', 'Bambi', 'Dumbo', 'Pinocchio'
  ],
  'europe': [
    'Paris', 'London', 'Rome', 'Berlin', 'Madrid',
    'Amsterdam', 'Vienna', 'Prague', 'Budapest', 'Athens',
    'Eiffel Tower', 'Big Ben', 'Colosseum', 'Brandenburg Gate', 'Sagrada Familia',
    'Napoleon', 'Queen Elizabeth', 'Charlemagne', 'Mozart', 'Da Vinci',
    'Vatican', 'Louvre', 'Acropolis', 'Stonehenge', 'Notre Dame',
    'Vikings', 'Knights Templar', 'Galileo', 'Marie Curie', 'Shakespeare',
    'Alps', 'Mediterranean', 'Rhine', 'Danube', 'Thames'
  ],
  'fashion-brands': [
    'Gucci', 'Louis Vuitton', 'Chanel', 'Prada', 'Hermes',
    'Versace', 'Dior', 'Off-White', 'Armani', 'Balenciaga',
    'Supreme', 'Saint Laurent', 'Valentino', 'Fendi', 'Celine',
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo',
    'Ralph Lauren', 'Calvin Klein', 'Tommy Hilfiger', 'Coach', 'Prayinggg',
    'Stussy', 'Palace', 'Fear of God', 'Kith', 'A Bathing Ape',
    'Levi\'s', 'Carhartt'
  ],
  'fields-of-study': [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology',
    'Sociology', 'Anthropology', 'Philosophy', 'History', 'Geography',
    'Economics', 'Political Science', 'Computer Science', 'Engineering', 'Medicine',
    'Law', 'Architecture', 'Art', 'Music', 'Literature',
    'Astronomy', 'Geology', 'Linguistics', 'Education', 'Business'
  ],
  'food': [
    'Pizza', 'Burger', 'Pasta', 'Sushi', 'Tacos',
    'Sandwich', 'Salad', 'Soup', 'Steak', 'Chicken',
    'Rice', 'Bread', 'Cheese', 'Eggs', 'Bacon',
    'Apple', 'Banana', 'Orange', 'Strawberry', 'Chocolate',
    'Ice Cream', 'Cookie', 'Cake', 'Donut', 'Coffee'
  ],
  'harry-potter': [
    'Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Dumbledore', 'Voldemort',
    'Snape', 'Hagrid', 'Sirius Black', 'Draco Malfoy', 'McGonagall',
    'Hogwarts', 'Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff',
    'Wand', 'Quidditch', 'Patronus', 'Horcrux', 'Muggle',
    'Phoenix', 'Dragon', 'Basilisk', 'Dementor', 'House Elf'
  ],
  'history': [
    'World War II', 'Roman Empire', 'Renaissance', 'Industrial Revolution', 'Cold War',
    'Ancient Egypt', 'Greek Empire', 'Middle Ages', 'American Revolution', 'French Revolution',
    'Napoleon', 'Julius Caesar', 'Cleopatra', 'Alexander the Great', 'Churchill',
    'Hitler', 'Stalin', 'Lincoln', 'Washington', 'Columbus',
    'Pyramid', 'Great Wall', 'Colosseum', 'Berlin Wall', 'Pearl Harbor'
  ],
  'jobs': [
    'Doctor', 'Teacher', 'Engineer', 'Lawyer', 'Nurse',
    'Programmer', 'Chef', 'Pilot', 'Police Officer', 'Firefighter',
    'Accountant', 'Architect', 'Dentist', 'Pharmacist', 'Scientist',
    'YouTuber', 'Influencer', 'Game Designer', 'DJ', 'Tattoo Artist',
    'Bartender', 'Fashion Designer', 'Animator', 'Podcaster', 'Streamer',
    'Graphic Designer', 'UX Designer', 'Film Director', 'Therapist', 'Barista'
  ],
  'music': [
    'Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone',
    'Trumpet', 'Flute', 'Bass', 'Cello', 'Clarinet',
    'Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop',
    'Country', 'Blues', 'Electronic', 'Reggae', 'Metal',
    'Beatles', 'Elvis', 'Mozart', 'Beethoven', 'Bach'
  ],
  'netflix': [
    'Stranger Things', 'The Crown', 'Bridgerton', 'Squid Game', 'Wednesday',
    'Orange Is the New Black', 'House of Cards', 'Narcos', 'The Witcher', 'Dark',
    'Money Heist', 'Ozark', 'Black Mirror', 'The Queens Gambit', 'Tiger King',
    'Lucifer', 'You', 'Emily in Paris', 'The Umbrella Academy', 'Cobra Kai',
    'Peaky Blinders', 'Better Call Saul', 'Breaking Bad', 'Friends', 'The Office'
  ],
  'psychology': [
    'Memory', 'Emotion', 'Personality', 'Intelligence', 'Consciousness',
    'Perception', 'Learning', 'Motivation', 'Behavior', 'Cognition',
    'Anxiety', 'Depression', 'Stress', 'Trauma', 'Therapy',
    'Freud', 'Jung', 'Pavlov', 'Piaget', 'Skinner',
    'Unconscious', 'Ego', 'Superego', 'Conditioning', 'Phobia'
  ],
  'sex': [
    'Intimacy', 'Romance', 'Attraction', 'Desire', 'Love',
    'Kiss', 'Hug', 'Foreplay', 'Passion', 'Chemistry',
    'Orgasm', 'Shibari', 'Marriage', 'Body oil', 'Couple',
    'Flirting', 'Seduction', 'Threesome', 'Consent', 'Pleasure',
    'Cuckold', 'Fantasies', 'Roleplay', 'Lingerie', 'Gag',
    'BDSM', 'Wet sheets', 'Non-binary', 'Queer', 'Polyamory',
    'Kinky', 'Handcuffs', 'Sensual', 'Hickey', 'Teasing'
  ],
  'sports': [
    'Soccer', 'Basketball', 'Baseball', 'Football', 'Tennis',
    'Curling', 'Cheese Rolling', 'Wife Carrying', 'Bog Snorkeling', 'Chess Boxing',
    'Quidditch', 'Parkour', 'Ultimate Frisbee', 'Zorbing', 'Kabaddi',
    'Olympics', 'World Cup', 'Super Bowl', 'Shin Kicking', 'Toe Wrestling',
    'Beer Pong', 'Cornhole', 'Pickleball', 'Foam Fighting', 'Extreme Ironing'
  ],
  'subcultures': [
    'Punk', 'Goth', 'Hipster', 'Emo', 'Hippie',
    'Metal', 'Grunge', 'Skater', 'Surfer', 'Biker',
    'Geek', 'Nerd', 'Otaku', 'Cosplay', 'Gamer',
    'Hip Hop', 'Raver', 'Indie', 'Steampunk', 'Cyberpunk',
    'Vegan', 'Minimalist', 'Bohemian', 'Preppy', 'Weeb',
    'Hikikomori', 'Incel', 'E-girl', 'Softboy', 'Furry'
  ],
  'technology': [
    'Computer', 'Smartphone', 'Internet', 'Floppy Disk', 'Y2K Bug',
    'Algorithm', 'Database', 'Cloud', 'Fax Machine', 'Dial-up',
    'iPhone', 'Android', 'Windows Vista', 'Blue Screen', '404 Error',
    'Google Glass', 'Metaverse', 'NFT', 'Dogecoin', 'Internet Explorer',
    'AI', 'Machine Learning', 'Blockchain', 'Virtual Reality', 'Captcha'
  ]
};

async function populateWords() {
  try {
    console.log('🎯 Starting to populate words for themes...\n');
    
    let totalAdded = 0;
    let themesPopulated = 0;
    
    for (const [themeType, words] of Object.entries(wordsData)) {
      console.log(`\n📝 Processing theme: ${themeType}`);
      
      // Find the theme
      const theme = await prisma.theme.findUnique({
        where: { type: themeType }
      });
      
      if (!theme) {
        console.log(`   ❌ Theme '${themeType}' not found in database`);
        continue;
      }
      
      // Check if theme already has words
      const existingWordCount = await prisma.word.count({
        where: { themeId: theme.id }
      });
      
      if (existingWordCount > 0) {
        console.log(`   ⚠️  Theme already has ${existingWordCount} words, skipping...`);
        continue;
      }
      
      // Add words for this theme
      let addedForTheme = 0;
      for (const word of words) {
        try {
          await prisma.word.create({
            data: {
              wordEn: word,
              themeId: theme.id
            }
          });
          addedForTheme++;
        } catch (error) {
          console.log(`   ⚠️  Failed to add word '${word}': ${error.message}`);
        }
      }
      
      console.log(`   ✅ Added ${addedForTheme} words to '${themeType}'`);
      totalAdded += addedForTheme;
      themesPopulated++;
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('📊 SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Themes populated: ${themesPopulated}`);
    console.log(`✅ Total words added: ${totalAdded}`);
    console.log(`✅ Average words per theme: ${themesPopulated > 0 ? (totalAdded / themesPopulated).toFixed(1) : 0}`);
    
    // Run check to see final state
    console.log('\n📈 Final database state:');
    console.log('─'.repeat(60));
    
    const finalThemes = await prisma.theme.findMany({
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
    
    let totalWords = 0;
    finalThemes.forEach(theme => {
      const count = theme._count.words;
      totalWords += count;
      const status = count > 0 ? '✅' : '⚠️';
      console.log(`${status} ${theme.type.padEnd(20)} | ${count.toString().padStart(3)} words`);
    });
    
    console.log('─'.repeat(60));
    console.log(`📊 Total words in database: ${totalWords}`);
    console.log(`📊 Themes with words: ${finalThemes.filter(t => t._count.words > 0).length}/${finalThemes.length}`);
    
  } catch (error) {
    console.error('❌ Error populating words:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population
populateWords();

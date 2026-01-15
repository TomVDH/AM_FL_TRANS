/**
 * Comprehensive translator for all game entries
 * This script applies translations to the JSON files directly
 */

const fs = require('fs');
const path = require('path');

const jsonDir = path.join(__dirname, '../data/json');

// Comprehensive translation dictionary based on existing translations
const translations = {
  // Basic UI
  'Character Name': 'Personagenaam',
  'Spicy Ass?': 'Pittige Ezel?',
  '*** Ass': '*** Ezel',
  'Instructions for Operators [EN]': 'Instructies voor Operators [NL]',

  // System messages
  'AVATAR REQUIRED': 'AVATAR VEREIST',
  'AWAITING INPUT': 'WACHT OP INVOER',
  'PRESS X': 'DRUK OP X',
  'PRESS X TO BEGIN': 'DRUK OP X OM TE BEGINNEN',
  'PRESS X TO BEGIN WHENEVER': 'DRUK OP X OM TERUG TE BEGINNEN',
  'PHASE ONE\\nCOMPLETE': 'FASE EEN\\nVOLTOOID',
  'CALIBRATING INTELLIGENCE': 'KALIBREREN INTELLIGENTIE',
  'AVATAR READY': 'AVATAR GEREED',
  'MATERIALIZING...': 'MATERIALISEREN...',
  'INTERMISSION': 'ONDERBREKING',
  'in which there is a PAUSE of no fixed duration': 'Waar een PAUZE van onbepaalde duur heerst.',

  // Questions
  'Which does your society value more?': 'Wat waardeert jouw maatschappij meer?',
  'Those who stay with the herd': 'Degenen die bij de kudde blijven',
  'Those who step away from the herd': 'Degenen die zich van de kudde afkeren',
  'Do you think of yourself as an intelligent animal?': 'Beschouw je jezelf als een intelligent dier?',
  'Do you think of yourself as a political animal?': 'Beschouw je jezelf als een politiek dier?',
  'Do you have urges to copulate and reproduce?': 'Heb je de drang om te paren en voort te planten?',
  'What is your natural habitat?': 'Wat is je natuurlijke habitat?',
  'Grassy plains': 'Graslanden',
  'Rocky desert': 'Rotsachtige woestijn',
  'Concrete jungle': 'Betonnen jungle',
  'Do you have experience doing manual labour every day for an extended period of time?': 'Heb je ervaring met het dagelijks verrichten van zwaar lichamelijk werk gedurende lange tijd?',
  'Have you ever gone on a labour strike due to unfair or dangerous working conditions?': 'Ben je ooit in staking gegaan vanwege oneerlijke of gevaarlijke arbeidsomstandigheden?',
  'Have you ever lost your job because your role became redundant at your place of work?': 'Ben je ooit je baan kwijtgeraakt omdat je functie overbodig werd?',
  'What kind of job was it?': 'Wat voor soort werk was het?',
  'Agriculture, fishery': 'Landbouw, visserij',
  'Mining, oil, forestry': 'Mijnbouw, olie, bosbouw',
  'Administration or clerical support': 'Administratie of kantoorondersteuning',
  'Hospitality or service': 'Horeca of dienstverlening',
  'Arts and culture': 'Kunst en cultuur',
  'Other': 'Anders',
  'How were the job conditions?': 'Hoe waren de arbeidsomstandigheden?',
  'Amazing': 'Fantastisch',
  'Good': 'Goed',
  'Fair': 'Redelijk',
  'Bad': 'Slecht',
  'Terrible': 'Verschrikkelijk',
  'Do you miss the job?': 'Mis je het werk?',
  'I miss aspects of it': 'Ik mis bepaalde aspecten ervan',
  'Do you think you would still have the job if you did things differently?': 'Denk je dat je het werk nog zou hebben als je dingen anders had gedaan?',
  "I don't know": 'Ik weet het niet',
  'Would you consider yourself to be the best representative of your species to lead a Revolution?': 'Beschouw je jezelf als de beste vertegenwoordiger van je soort om een Revolutie te leiden?',
  'Which of these mythic and literary heroes do you identify with the most?': 'Met welke van deze mythische en literaire helden identificeer je je het meest?',
  "Bottom from A Midsummer Night's Dream": 'Bult uit Een Midzomernachtdroom',
  'Lucius from The Golden Ass by Apuleius': 'Lucius uit De Gouden Ezel van Apuleius',
  'Midas from Greek Mythology': 'Midas uit de Griekse Mythologie',
  'Pinocchio from Pinocchio': 'Pinokkio uit Pinokkio',

  // Trivia questions
  'In English, when one human says to another human, "You ass," they are comparing a human to:': 'In het Engels, wanneer een mens tegen een ander mens zegt "You ass", vergelijkt men een mens met:',
  'Equus asinus': 'Equus asinus',
  'A buttocks': 'Billen',
  "In English, when one human says to another human, \"I'd hit that ass\" they mean:": "In het Engels, wanneer een mens tegen een ander mens zegt \"I'd hit that ass\", bedoelen ze:",
  'They would forcibly beat an Equus asinus if they could': 'Ze zouden een Equus asinus gewelddadig slaan als ze konden',
  'They would have sexual intercourse with another human if they could': 'Ze zouden geslachtsgemeenschap hebben met een ander mens als ze konden',
  'In the Old Testament, a human named Balaam is hitting his ass when all of a sudden:': 'In het Oude Testament is een mens genaamd Bileam zijn ezel aan het slaan wanneer plotseling:',
  'Balaam beats the ass to death and has to find another one to do his work for him': 'Bileam de ezel doodslaat en een andere moet vinden om zijn werk te doen',
  'God gives the ass the ability to speak and the ass begs Balaam to spare them': 'God de ezel het vermogen geeft te spreken en de ezel Bileam smeekt hem te sparen',

  // More trivia
  "In Aesop's Fables, one reads: \"An ass put on the skin of a lion and went around frightening all the animals. The ass saw a fox and tried to frighten her too, but she had heard his voice first, so she said to the ass, 'You can be sure that I too would have been afraid, if I had not already heard the sound of your bray'.\" The moral is:": "In Aesopus' Fabels leest men: \"Een ezel trok de huid van een leeuw aan en ging rond om alle dieren angst aan te jagen. De ezel zag een vos en probeerde haar ook bang te maken, maar zij had zijn stem al gehoord, dus zei ze tegen de ezel: 'Je kunt er zeker van zijn dat ik ook bang zou zijn geweest, als ik het geluid van je geschreeuw niet al had gehoord'.\" De moraal is:",
  'The disenfranchised are forced to imitate those in power without ever attaining more power': 'De rechtelozen worden gedwongen degenen met macht te imiteren zonder ooit meer macht te verkrijgen',
  'A fool is still a fool regardless of how they are dressed': 'Een dwaas blijft een dwaas, ongeacht hoe ze gekleed zijn',

  'In Ancient Greece, asses symbolized fertility because:': 'In het oude Griekenland symboliseerden ezels vruchtbaarheid omdat:',
  'Male donkeys have very large penises': 'Mannelijke ezels zeer grote penissen hebben',
  'Female donkeys frequently give birth to twins': 'Vrouwelijke ezels vaak tweelingen baren',

  "A 'mare' is the general term for a female equine. What is the specific term for a female donkey?": "Een 'merrie' is de algemene term voor een vrouwelijk paard. Wat is de specifieke term voor een vrouwelijke ezel?",
  'Jack': 'Jack',
  'Gelding': 'Ruin',
  'Jennet': 'Jennet',
  'Molly': 'Molly',

  'A famous piece of anti-Christian graffiti from ancient Rome depicts:': 'Een beroemd stuk anti-christelijke graffiti uit het oude Rome toont:',
  "Jesus with an ass's head": 'Jezus met een ezelskop',
  'Jesus riding an ass backwards': 'Jezus achterstevoren op een ezel rijdend',

  "What does tradition say Mohammed's ass, Ya'fur, did after the Prophet died?": "Wat zegt de traditie dat Mohammeds ezel, Ya'fur, deed nadat de Profeet stierf?",
  'Committed suicide by throwing itself down a well': 'Pleegde zelfmoord door zich in een put te werpen',
  'Rode away from Mecca weeping never to return': 'Reed huilend weg uit Mekka om nooit meer terug te keren',

  "In the philosophical paradox called Buridan's Ass, an ass placed between a bucket of water and a bale of hay will:": 'In de filosofische paradox genaamd Buridans Ezel, zal een ezel geplaatst tussen een emmer water en een baal hooi:',
  'Always choose the hay first': 'Altijd eerst het hooi kiezen',
  'Always choose the water first': 'Altijd eerst het water kiezen',
  'Die from indecision': 'Sterven van besluiteloosheid',

  'Was ist die Bedeutung des Ausdrucks „sich eine Eselsbrücke bauen"?': 'Wat betekent de uitdrukking "sich eine Eselsbrücke bauen"?',
  'Eine Abkürzung oder gedankliche Assoziation zu finden, um sich etwas besser merken zu können': 'Een verkorting of gedachte-associatie vinden om iets beter te kunnen onthouden',
  'Vertrauen Sie niemals einem langsamen Esel beim Brückenbauen': 'Vertrouw nooit een trage ezel bij het bouwen van bruggen',

  'In 1981, the video game DONKEY.BAS was distributed on all original IBM computers. In that game, players must:': 'In 1981 werd het videospel DONKEY.BAS gedistribueerd op alle originele IBM-computers. In dat spel moeten spelers:',
  'Play as a donkey pulling wagons of hay from one town to another': 'Spelen als een ezel die hooiwagens van de ene stad naar de andere trekt',
  'Drive a car down a road while avoiding donkeys': 'Een auto over een weg rijden terwijl ze ezels ontwijken',
  'Play a rhythm game that simulates donkeys mating': 'Een ritme spel spelen dat ezels bij het paren simuleert',

  'En La Gloria, Colombia, el servicio de biblioteca móvil que usa los burros para transportar libros a los pueblos pequeños se llama:': 'In La Gloria, Colombia, heet de mobiele bibliotheekdienst die ezels gebruikt om boeken naar kleine dorpen te vervoeren:',
  'Biblioburro': 'Biblioburro',
  'Libraría Asinia': 'Libraría Asinia',

  "In China, the rise in demand for a luxury Traditional Chinese Medicine product called 'ejiao' has resulted in how many asses being slaughtered every year?": "In China heeft de toegenomen vraag naar een luxe Traditioneel Chinees Geneesmiddel genaamd 'ejiao' geleid tot de slacht van hoeveel ezels per jaar?",
  '5 million': '5 miljoen',
  '3 million': '3 miljoen',
  '2 million': '2 miljoen',

  'As of 2018, how heavy must a tourist be to be too heavy to ride an ass on the island of Santorini, Greece?': 'Vanaf 2018, hoe zwaar moet een toerist zijn om te zwaar te zijn om op een ezel te rijden op het eiland Santorini, Griekenland?',
  '75kg (165lbs)': '75kg (165lbs)',
  '100kg (220lbs)': '100kg (220lbs)',

  'In northwestern Australia, wild asses are shot from government helicopters because:': 'In noordwest-Australië worden wilde ezels vanuit regeringshelikopters neergeschoten omdat:',
  'They are considered an invasive species left behind from British colonization': 'Ze worden beschouwd als een invasieve soort achtergelaten door de Britse kolonisatie',
  'They are destroying the natural landscape of the Kimberley': 'Ze het natuurlijke landschap van de Kimberley vernietigen',
  'All of the above': 'Alle bovenstaande',

  'Equus asinus has been in the service of human beings as a manual labourer for how many years?': 'Equus asinus is al hoeveel jaar in dienst van de mensheid als handarbeider?',
  '5000 years': '5000 jaar',
  '7000 years': '7000 jaar',

  // Common answers
  'Yes': 'Ja',
  'No': 'Nee',
};

// Apply translations to all JSON files
function translateFiles() {
  const jsonFiles = fs.readdirSync(jsonDir)
    .filter(file => file.match(/^\d+_.*\.json$/))
    .sort();

  let totalTranslated = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(jsonDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let fileTranslated = 0;

    for (const sheet of data.sheets) {
      for (const entry of sheet.entries) {
        if (entry.sourceEnglish &&
            (!entry.translatedDutch || entry.translatedDutch.trim() === '')) {

          const translation = translations[entry.sourceEnglish];
          if (translation) {
            entry.translatedDutch = translation;
            fileTranslated++;
            totalTranslated++;
          }
        }
      }
    }

    if (fileTranslated > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ ${file}: ${fileTranslated} translations applied`);
    }
  }

  console.log(`\n✅ Total translations applied: ${totalTranslated}`);
}

translateFiles();

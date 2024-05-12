const { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');

const template = `
    <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- bg -->
        <!-- head -->
        <!-- eyes -->
        <!-- nose -->
        <!-- mouth -->
        <!-- accessory -->
    </svg>
`

const takenNames = {};
const takenFaces = {};
let idx = 1259;

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function rarityAtribute() {
    const number = randInt(1259);
    if(number <= 700) {
        return "common";
    } else if (number <= 1000) {
        return "uncommon";
    } else if (number <= 1150) {
        return "rare";
    } else if (number <= 1250) {
        return "epic";
    } else {
        return "legendary";
    }
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName() {
    const adjectives = 'Fluffy Smelly Sleepy Playful Elegant Graceful Curious Mischievous Cuddly Agile Sleek Purrfect Independent Affectionate Vocal Mysterious Sneaky Furry Loyal Clever Majestic Regal Charming Calm Energetic Alert Adorable Bossy Dainty Fearless Finicky Grumpy Inquisitive Jovial Magnetic Noble Quick Radiant Spunky Tender'.split(' ');
    const names = 'Whiskers Luna Simba Shadow Bella Pepper Gizmo Mittens Lucy Leo Boots Max Felix Sophie Chloe Tiger Lily Oreo Dexter Jasper Nala Milo Stella Willow Socks Peanut Pumpkin Daisy Oliver Cleo Leo Ruby Sunny Ziggy Coco Cinammon Snowball Misty Galadriel Smudge Pudding Marbles Brownie Boo Spot'.split(' ');
    
    const randAdj = randElement(adjectives);
    const randName = randElement(names);
    const name =  `${randAdj}-${randName}`;


    if (takenNames[name] || !name) {
        return getRandomName();
    } else {
        takenNames[name] = name;
        return name;
    }
}

function getLayer(name, skip=0.0) {
    const svg = readFileSync(`./layers/${name}.svg`, 'utf-8');
    const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
    const layer = svg.match(re)[0];
    return Math.random() > skip ? layer : '';
}

async function svgToPng(name) {
    const src = `./out/${name}.svg`;
    const dest = `./out/${name}.png`;

    const img = await sharp(src);
    const resized = await img.resize(1024);
    await resized.toFile(dest);
}


function createImage(idx) {

    const bg = randInt(6);
    const head = randInt(2);
    const eyes = randInt(2);
    const nose = randInt(1); 
    const mouth = randInt(1);
    const accessory = randInt(4);
    const rarity = rarityAtribute();
    // 1260 combinations

    const face = [head, eyes, nose, mouth, accessory].join('');

    if (face[takenFaces]) {
        createImage();
    } else {
        const name = getRandomName()
        console.log(name)
        face[takenFaces] = face;

        const final = template
            .replace('<!-- bg -->', getLayer(`bg${bg}`))
            .replace('<!-- head -->', getLayer(`head${head}`))
            .replace('<!-- eyes -->', getLayer(`eyes${eyes}`))
            .replace('<!-- nose -->', getLayer(`nose${nose}`))
            .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))
            .replace('<!-- accessory -->', getLayer(`accessory${accessory}`))

        const meta = {
            name,
            description: `A drawing of ${name.split('-').join(' ')}`,
            image: `${idx}.png`,
            attributes: [
                { 
                    rarity: rarity,
                }
            ]
        }
        writeFileSync(`./out/${idx}.json`, JSON.stringify(meta))
        writeFileSync(`./out/${idx}.svg`, final)
        svgToPng(idx)
    }


}

// Create dir if not exists
if (!existsSync('./out')){
    mkdirSync('./out');
}

// Cleanup dir before each run
readdirSync('./out').forEach(f => rmSync(`./out/${f}`));

do {
    createImage(idx);
    idx--;
  } while (idx >= 0);

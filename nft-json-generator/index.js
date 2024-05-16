const { writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs');

const takenNames = {};
let idx = 99;

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

function createJson(idx) {
    const rarity = rarityAtribute();
    const name = getRandomName();
    const contentId = 'QmTudPsbaksg9oG3jR3uNYXtpjAkHGsGnh1tAqVAYt7nRy';
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${idx}.png`;

    const meta = {
        name,
        description: `A drawing of ${name.split('-').join(' ')}`,
        image: imageURI,
        attributes: [
            { 
                rarity: rarity,
            }
        ]
    }
    writeFileSync(`./jsons/${idx}.json`, JSON.stringify(meta))
}

// Create dir if not exists
if (!existsSync('./jsons')){
    mkdirSync('./jsons');
}

// Cleanup dir before each run
readdirSync('./jsons').forEach(f => rmSync(`./jsons/${f}`));


do {
    createJson(idx);
    idx--;
  } while (idx >= 0);

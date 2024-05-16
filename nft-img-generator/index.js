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

const takenFaces = {};
let idx = 99;

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getLayer(name, skip=0.0) {
    const svg = readFileSync(`./layers/${name}.svg`, 'utf-8');
    const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
    const layer = svg.match(re)[0];
    return Math.random() > skip ? layer : '';
}

async function svgToPng(name) {
    const src = `./imgs/${name}.svg`;
    const dest = `./imgs/${name}.png`;

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
    // 1260 combinations
 
    const face = [head, eyes, nose, mouth, accessory].join('');

    if (face[takenFaces]) {
        createImage();
    } else {
        face[takenFaces] = face;

        const final = template
        .replace('<!-- bg -->', getLayer(`bg${bg}`))
        .replace('<!-- head -->', getLayer(`head${head}`))
        .replace('<!-- eyes -->', getLayer(`eyes${eyes}`))
        .replace('<!-- nose -->', getLayer(`nose${nose}`))
        .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))
        .replace('<!-- accessory -->', getLayer(`accessory${accessory}`))

        writeFileSync(`./imgs/${idx}.svg`, final)
        svgToPng(idx)
    }


}

// Create dir if not exists
if (!existsSync('./imgs')){
    mkdirSync('./imgs');
}

// Cleanup dir before each run
readdirSync('./imgs').forEach(f => rmSync(`./imgs/${f}`));

do {
    createImage(idx);
    idx--;
  } while (idx >= 0);

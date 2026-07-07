const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './images';

fs.readdirSync(imagesDir).forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.jpg')) {
    const input = path.join(imagesDir, file);
    const output = path.join(imagesDir, file.replace(/\.(png|jpg)$/, '.webp'));
    sharp(input)
      .webp({ quality: 80 })
      .toFile(output, (err) => {
        if (err) console.error('Error converting', file, err);
        else console.log('Converted:', file, '→', file.replace(/\.(png|jpg)$/, '.webp'));
      });
  }
});
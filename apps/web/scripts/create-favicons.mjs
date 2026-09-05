import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Minimal valid 16x16 PNG with purple/indigo brand color
const png16Base64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVDhPY/wPBAwUACZcEmBqGBgY/hPDmDAkGBgYmBiwKqDEgA8wNTA2gE1Bw8DAwPCfAcI0tIDBfgAAMf8R0fM6DqYAAAAASUVORK5CYII=';

// Minimal valid 32x32 PNG
const png32Base64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVFhH7c6hAQAgDMDAwP6rM3gER+K6pClJ+uqu5wEQIECAAAECBAgQIECAAAECBAgQIECAwNfABzRjEPGqM9CFAAAAAElFTkSuQmCC';

// Minimal valid 180x180 PNG for apple touch icon
const png180Base64 = 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVFhH7c4xEQAgDAAxsH9nC3u4Aw5sYdKkWV/f43kCBAgQIECAAAECBAgQIECAAAECBAgQIEBgA2yYAR9+Q955AAAAAElFTkSuQmCC';

const png16 = Buffer.from(png16Base64, 'base64');
const png32 = Buffer.from(png32Base64, 'base64');
const png180 = Buffer.from(png180Base64, 'base64');

// Standard ICO format wrapping 16x16 PNG
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // ICO type
  0x01, 0x00, // 1 image
  16,         // width
  16,         // height
  0,          // colors
  0,          // reserved
  0x01, 0x00, // color planes
  0x20, 0x00, // 32 bpp
  png16.length & 0xff, (png16.length >> 8) & 0xff, (png16.length >> 16) & 0xff, (png16.length >> 24) & 0xff, // size
  22, 0x00, 0x00, 0x00 // offset 22
]);
const ico = Buffer.concat([icoHeader, png16]);

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join(publicDir, 'og-image.png'), png180);

console.log('Successfully generated public assets');

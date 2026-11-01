import { inflateSync } from 'node:zlib';

/** Read real Playwright PNG pixels, independently of SVG DOM stacking claims.
 * 8-bit noninterlaced RGB/RGBA only; unsupported images fail, never pass silently. */
export function readPngRaster(data: Buffer) {
  if (!data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('Not a PNG.');
  let width = 0, height = 0, channels = 0;
  const compressed: Buffer[] = [];
  for (let at = 8; at < data.length;) {
    const length = data.readUInt32BE(at), type = data.toString('ascii', at + 4, at + 8), start = at + 8;
    if (type === 'IHDR') {
      width = data.readUInt32BE(start); height = data.readUInt32BE(start + 4);
      channels = data[start + 9] === 6 ? 4 : data[start + 9] === 2 ? 3 : 0;
      if (data[start + 8] !== 8 || !channels || data[start + 12] !== 0) throw new Error('Unsupported PNG format.');
    }
    if (type === 'IDAT') compressed.push(data.subarray(start, start + length));
    at = start + length + 4;
    if (type === 'IEND') break;
  }
  if (!width || !height) throw new Error('Missing PNG dimensions.');
  const raw = inflateSync(Buffer.concat(compressed)), stride = width * channels;
  if (raw.length !== (stride + 1) * height) throw new Error('Invalid PNG scanlines.');
  const pixels = Buffer.alloc(stride * height);
  function paeth(a: number, b: number, c: number) {
    const p = a + b - c, x = Math.abs(p - a), y = Math.abs(p - b), z = Math.abs(p - c);
    return x <= y && x <= z ? a : y <= z ? b : c;
  }
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[y * stride + x - channels]! : 0;
      const up = y ? pixels[(y - 1) * stride + x]! : 0;
      const corner = y && x >= channels ? pixels[(y - 1) * stride + x - channels]! : 0;
      const prediction = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, corner) : NaN;
      if (!Number.isFinite(prediction)) throw new Error('Unsupported PNG filter.');
      pixels[y * stride + x] = (raw[y * (stride + 1) + x + 1]! + prediction) & 255;
    }
  }
  return { width, height, rgb: (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) throw new Error('Pixel outside PNG.');
    const at = (y * width + x) * channels;
    return [pixels[at]!, pixels[at + 1]!, pixels[at + 2]!] as const;
  } };
}

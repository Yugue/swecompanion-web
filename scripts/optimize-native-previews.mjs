import sharp from 'sharp'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'

const [input, output] = process.argv.slice(2)
const manifest = {}
for (const name of ['coding', 'debug', 'optimize', 'system-design', 'ml-design'].flatMap(name => [name, `${name}-full`, `${name}-mobile`])) {
  const result = await sharp(resolve(input, `${name}.png`))
    .webp({ lossless: true, effort: 6 })
    .toFile(resolve(output, `${name}.webp`))
  console.log(`${name}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`)
  manifest[name] = { width: result.width, height: result.height }
}
await writeFile(resolve(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

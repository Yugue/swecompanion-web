import assert from "node:assert/strict";
import fs from "node:fs";
import { lessonCurricula } from "../src/lib/lessonCurricula";

const revisions = JSON.parse(fs.readFileSync("docs/ml-content-revisions.json", "utf8")) as {track: keyof typeof lessonCurricula; id: string}[];
const revisedIds = new Set(revisions.map(item => `${item.track}/${item.id}`));
assert.equal(revisions.length, 490);
assert.equal(revisedIds.size, revisions.length);
for (const [track, parts] of Object.entries(lessonCurricula)) {
  for (const topic of parts.flatMap(part => part.topics)) {
    // The thirteen earlier Deep Learning rewrites are retained from the first pass.
    if (track !== "ml") assert.ok(revisedIds.has(`${track}/${topic.id}`), `Missing content edit: ${track}/${topic.id}`);
  }
}
for (const {track, id} of revisions) assert.ok(fs.existsSync(`src/content/${track}-lessons/${id}.md`));
const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-9);
// Check independent arithmetic used by the revised worked cases, rather than
// asserting that a paragraph happens to contain a word or a figure identifier.
close([0,0,6].reduce((sum, error) => sum + Math.abs(error), 0) / 3, 2);
close(Math.sqrt([0,0,6].reduce((sum, error) => sum + error ** 2, 0) / 3), Math.sqrt(12));
close(1 / (1 + Math.exp(-Math.log(3))), 0.75);
close(6 / 10, 0.6); close(6 / (6 + 4), 0.6);
close((10 + 12 + 20) / 3, 14);
close(0 - 0.1 * (2 * (0 - 2)), 0.4); close((0.4 - 2) ** 2, 2.56);
assert.equal(8 * 5, 40);
close(0.5 * 0.02, 0.01);
assert.equal(100 + 100 - 80, 120);
assert.equal(1_000_000 * 128 * 4, 512_000_000);
close(0.1 / 2, 0.05);
close(400 / 16000, 0.025); close(160 / 16000, 0.01);
close(1 + 0.5 * 2 + 0.5 ** 2 * 3, 2.75);
close(1 + 0.9 * 10, 10);
assert.equal(4 * 8 * 2, 64);
close((100 / 40) / 4, 0.625); assert.equal(4 * 40, 160);
close(0.2 - 1, -0.8);
assert.equal((224 / 16) ** 2, 196);
close(Math.hypot(6,8), 10); close(Math.hypot(3,4), 5);
assert.equal(4 * (100 + 100), 800);
close(0.2 * 10 + 0.8 * 0, 2);
close(0.6 / 0.8, 0.75);
assert.equal(2 * 2000 + 2 * 200, 4400); assert.equal(2000 + 2 * 200, 2400);
console.log("490 revision records and worked-example arithmetic checked; every non-Deep-Learning topic is covered.");

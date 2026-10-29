import fs from "node:fs";
import path from "node:path";
import { speechParts } from "../src/lib/speechStudyData";
import { speechVisuals, isSpeechVisualId } from "../src/lib/speechVisuals";

const fence = String.fromCharCode(96).repeat(3);
const figurePattern = new RegExp(fence + "speech-visual\\n([^\\n]+)\\n" + fence, "g");
let output = "# Speech / Audio ML Interview Study Guide\n\n";
output += "A standalone guide for mid-to-senior ML-domain interviews: 31 lessons across six Parts.\n\n";
output += "Study in curriculum order on a first pass. Each lesson builds from intuition to mechanism, essential math, practical consequences, tradeoffs, and failure modes.\n\n";
output += "## Contents\n\n";
for (const part of speechParts) {
  output += "- Part " + part.number + " — " + part.title + "\n";
  part.topics.forEach((topic, index) => { output += "  - " + part.number + "." + (index + 1) + " " + topic.title + "\n"; });
}
output += "\n";
for (const part of speechParts) {
  output += "# Part " + part.number + " — " + part.title + "\n\n" + part.description + "\n\n";
  for (const topic of part.topics) {
    let source = fs.readFileSync(path.join("src/content/speech-lessons", topic.id + ".md"), "utf8");
    source = source.replace(/^(#{1,3}) /gm, "$1# ");
    source = source.replace(figurePattern, (_, id: string) => {
      if (!isSpeechVisualId(id)) throw new Error("Unknown figure: " + id);
      return "![" + speechVisuals[id].caption + "](../public/speech/" + id + ".svg)\n\n" + speechVisuals[id].caption;
    });
    output += source + "\n---\n\n";
  }
  output += "## Further reading\n\n";
  for (const reference of part.references) output += "- [" + reference.title + "](" + reference.url + ")\n";
  output += "\n";
}
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/speech-audio-study-guide.md", output);
console.log("Exported the complete guide to docs/speech-audio-study-guide.md");

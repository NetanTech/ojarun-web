import fs from "fs";
import path from "path";

const src = path.join("public", "svg", "svg.tsx");
const outDir = path.join("public", "svg", "icons");
fs.mkdirSync(outDir, { recursive: true });

const content = fs.readFileSync(src, "utf8");
// Already split? bail.
if (content.includes("from './icons/")) {
  console.log("Already split, skipping.");
  process.exit(0);
}

const header = 'import React from "react";\n\n';
const starts = [];
const re = /^export function (\w+)/gm;
let m;
while ((m = re.exec(content))) {
  starts.push({ name: m[1], index: m.index });
}

if (!starts.length) {
  console.error("No exports found");
  process.exit(1);
}

const names = [];
for (let i = 0; i < starts.length; i++) {
  const { name, index } = starts[i];
  const end = i + 1 < starts.length ? starts[i + 1].index : content.length;
  const body = content.slice(index, end).trimEnd() + "\n";
  fs.writeFileSync(path.join(outDir, `${name}.tsx`), header + body);
  names.push(name);
}

const barrel =
  names.map((n) => `export { ${n} } from "./icons/${n}";`).join("\n") + "\n";
fs.writeFileSync(src, barrel);
console.log(`Split ${names.length} icons. Barrel bytes: ${barrel.length}`);

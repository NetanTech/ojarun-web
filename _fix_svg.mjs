import fs from "node:fs";

const p = "public/svg/svg.tsx";
let s = fs.readFileSync(p, "utf8");
const before = s;

// Drop the hard-coded pixel width/height on the OUTER <svg> of each decorative
// Hero SVG so the className (set where it's used) fully controls the rendered size
// and the viewBox alone governs the aspect ratio -> properly responsive.
for (const name of ["HeroLeft", "HeroRight", "HeroTop", "HeroBottom"]) {
  const start = s.indexOf(`export function ${name}(`);
  if (start === -1) {
    console.log(`!! ${name} not found`);
    continue;
  }
  const svgIdx = s.indexOf("<svg", start);
  const gtIdx = s.indexOf(">", svgIdx);
  const head = s.slice(svgIdx, gtIdx); // the <svg ...> opening tag (no >)
  const cleaned = head
    .replace(/\r?\n\s*width="\d+"/i, "")
    .replace(/\r?\n\s*height="\d+"/i, "");
  if (cleaned !== head) {
    s = s.slice(0, svgIdx) + cleaned + s.slice(gtIdx);
    console.log(`${name}: stripped width/height`);
  } else {
    console.log(`${name}: nothing to strip (already clean)`);
  }
}

fs.writeFileSync(p, s);
console.log("changed:", before !== s);

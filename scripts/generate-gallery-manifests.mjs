/**
 * Regenerate gallery manifests:
 * - Flat: image/DigitalArt, image/Certificate
 * - Nested: image/WebApp/<projectFolder> → window.WEB_APP_MANIFEST
 * Run from repo root: node scripts/generate-gallery-manifests.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const IMG = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

function scanSubdir(sub, globalName, outName) {
  const dir = path.join(root, "image", sub);
  if (!fs.existsSync(dir)) {
    console.warn("Skipping missing folder:", dir);
    fs.writeFileSync(
      path.join(root, outName),
      `window.${globalName} = [];\n`
    );
    return;
  }
  const names = fs
    .readdirSync(dir)
    .filter((f) => IMG.test(f) && fs.statSync(path.join(dir, f)).isFile())
    .sort();
  const body = `window.${globalName} = ${JSON.stringify(names, null, 2)};\n`;
  fs.writeFileSync(path.join(root, outName), body);
  console.log(outName, names.length, "files");
}

scanSubdir("DigitalArt", "DIGITAL_ART_MANIFEST", "digital-art.manifest.js");
scanSubdir("Certificate", "CERTIFICATE_MANIFEST", "certificate.manifest.js");

function scanWebAppProjects() {
  const base = path.join(root, "image", "WebApp");
  const manifest = {};
  if (!fs.existsSync(base)) {
    fs.writeFileSync(
      path.join(root, "web-app.manifest.js"),
      "window.WEB_APP_MANIFEST = {};\n"
    );
    console.warn("Skipped WebApp (missing folder):", base);
    return;
  }
  for (const name of fs.readdirSync(base)) {
    const sub = path.join(base, name);
    if (!fs.statSync(sub).isDirectory()) continue;
    manifest[name] = fs
      .readdirSync(sub)
      .filter((f) => IMG.test(f) && fs.statSync(path.join(sub, f)).isFile())
      .sort();
  }
  fs.writeFileSync(
    path.join(root, "web-app.manifest.js"),
    `window.WEB_APP_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`
  );
  console.log(
    "web-app.manifest.js",
    Object.keys(manifest).length,
    "project folders"
  );
}

scanWebAppProjects();

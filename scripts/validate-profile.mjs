import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const repoRoot = new URL("../", import.meta.url);

const requiredFiles = [
  "README.md",
  "profile/README.md",
  "BRAND.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/good_first_adapter.yml",
  ".github/ISSUE_TEMPLATE/good_first_worker.yml",
  ".github/ISSUE_TEMPLATE/architecture_request.yml",
  "profile/assets/org-banner.svg",
  "profile/assets/org-banner.png",
  "profile/assets/org-logo.svg",
  "profile/assets/org-logo.png",
  "profile/assets/repo-social-preview.svg",
  "profile/assets/repo-social-preview.png"
];

const pngDimensions = new Map([
  ["profile/assets/org-banner.png", [1500, 400]],
  ["profile/assets/org-logo.png", [500, 500]],
  ["profile/assets/repo-social-preview.png", [1280, 640]]
]);

for (const file of requiredFiles) {
  if (!existsSync(new URL(file, repoRoot))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const profileReadme = await readText("profile/README.md");
mustInclude(profileReadme, "./assets/org-banner.svg", "profile README must render the org banner");
mustInclude(profileReadme, "sdk-js", "profile README must link to the SDK repo");
mustInclude(profileReadme, "good_first_worker.yml", "profile README must link to worker contribution path");
mustInclude(profileReadme, "architecture_request.yml", "profile README must link to architecture contribution path");

const brand = await readText("BRAND.md");
for (const asset of ["org-banner", "org-logo", "repo-social-preview"]) {
  mustInclude(brand, asset, `BRAND.md must mention ${asset}`);
}

const prTemplate = await readText("PULL_REQUEST_TEMPLATE.md");
mustInclude(prTemplate, "verify:local-e2e", "PR template must point contributors at the local E2E gate");

for (const svgPath of ["profile/assets/org-banner.svg", "profile/assets/org-logo.svg", "profile/assets/repo-social-preview.svg"]) {
  const svg = await readText(svgPath);
  mustInclude(svg, "<svg", `${svgPath} must be an SVG document`);
}

for (const [pngPath, [expectedWidth, expectedHeight]] of pngDimensions.entries()) {
  const { width, height } = await readPngDimensions(pngPath);
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(`${pngPath} must be ${expectedWidth}x${expectedHeight}; got ${width}x${height}`);
  }
}

console.log("Validated AgentDispatch GitHub profile assets and community defaults.");

async function readText(path) {
  return readFile(new URL(path, repoRoot), "utf8");
}

function mustInclude(value, expected, message) {
  if (!value.includes(expected)) {
    throw new Error(message);
  }
}

async function readPngDimensions(path) {
  const bytes = await readFile(new URL(path, repoRoot));
  const signature = bytes.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${path} is not a PNG file`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

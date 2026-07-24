import { readFile, writeFile, appendFile } from "node:fs/promises";

const title = process.env.ISSUE_TITLE || "";
const author = process.env.ISSUE_AUTHOR || "unknown";
const issueNumber = Number(process.env.ISSUE_NUMBER);
const name = title.replace(/^\[ENTRY\]\s*/u, "").trim().replace(/\s+/gu, " ");
const outputPath = process.env.GITHUB_OUTPUT;

async function setOutput(values) {
  const text = Object.entries(values).map(([key, value]) => `${key}=${value}`).join("\n") + "\n";
  if (outputPath) await appendFile(outputPath, text, "utf8");
  else process.stdout.write(text);
}

if (!name || name.length > 40 || /[\u0000-\u001F\u007F]/u.test(name)) {
  await setOutput({ status: "invalid", message: "Please use a name between 1 and 40 characters." });
  process.exit(0);
}

const dataPath = new URL("../data/entries.json", import.meta.url);
const entries = JSON.parse(await readFile(dataPath, "utf8"));
const duplicate = entries.some((entry) => entry.name.localeCompare(name, undefined, { sensitivity: "base" }) === 0);

if (duplicate) {
  await setOutput({ status: "duplicate", message: "That name is already in the machine." });
  process.exit(0);
}

entries.push({
  name,
  github: author,
  issue: issueNumber,
  enteredAt: new Date().toISOString()
});

await writeFile(dataPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
await setOutput({ status: "added", name, message: "Capsule added." });

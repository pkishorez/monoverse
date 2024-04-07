import AdmZip from "adm-zip";
import fs, { createWriteStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

export const downloadGitRepo = async (url: string) => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "monoverse-"));
  const outputPath = path.join(tempDir, "github-zip.zip");
  const outputDir = path.join(tempDir, "github-extract");

  await rm(outputDir, { recursive: true, force: true });
  await rm(outputPath, { force: true });

  const { ok } = await downloadZip(url, outputPath);

  if (!ok) {
    throw new Error("Failed to download the zip file");
  }

  const zip = new AdmZip(outputPath);
  zip.extractAllTo(outputDir, true);

  return {
    projectDir: await getInnerDirPath(outputDir),
    cleanupDir: () => {
      return rm(tempDir, { recursive: true, force: true });
    },
  };
};

async function downloadZip(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    return { ok: false, error: "Failed to fetch the zip file" };
  }
  if (!response.body) {
    return { ok: false, error: "Response body is empty" };
  }

  // Directly create a Node.js Readable stream from the response.body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeReadableStream = Readable.fromWeb(response.body as any);

  await pipeline(nodeReadableStream, createWriteStream(outputPath));

  return { ok: true };
}

const getInnerDirPath = (dirPath: string) => {
  return new Promise<string>((resolve, reject) => {
    const files = fs.readdirSync(dirPath);
    const innerDir = files.find((f) => {
      console.log("f", path.join(dirPath, f));
      return fs.statSync(path.join(dirPath, f)).isDirectory();
    });
    if (!innerDir) {
      return reject("No inner directory found");
    }
    resolve(path.join(dirPath, innerDir));
  });
};

import { exec } from "child_process";
import path from "path";
import fs from "fs";

export const convertPdfToImages = (pdfPath, outputDir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `pdftoppm "${pdfPath}" "${outputDir}/page" -png`;

    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        const files = fs
          .readdirSync(outputDir)
          .map(f => `${outputDir}/${f}`);
        resolve(files);
      }
    });
  });
};

const fs = require("fs-extra");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

(async () => {
  const sourceDir = `source/`;
  const distDir = `optimized/`;

  try {
    const batchLimit = 100;
    const dirs = await fs.readdirSync(sourceDir);
    if (dirs && dirs.length > 0) {
      for (const dir of dirs) {
        if (dir.charAt(0) === ".") {
          console.warn(`Dot dir '${dir}' skipped`);
          continue;
        } else {
          console.warn(`Started with directory '${dir}'`);
        }
        const actualSourceDir = `${sourceDir}${dir}/`;
        const actualDistDir = `${distDir}${dir}/`;
        await fs.ensureDir(actualDistDir);
        await fs.emptyDir(actualDistDir);
        const files = await fs.readdirSync(actualSourceDir);
        if (files && files.length > 0) {
          let counter = 0;
          const filesLength = files.length;
          let promises = [];
          for (const file of files) {
            if (file.charAt(0) === ".") {
              console.warn(`Dot file '${file}' skipped`);
              continue;
            }
            promises.push(
              new Promise(async (resolve, reject) => {
                try {
                  const filePath = `${actualSourceDir}${file}`;
                  await imagemin([filePath], actualDistDir, {
                    plugins: [
                      imageminMozjpeg({
                        quality: "80"
                      }),
                      imageminPngquant({
                        quality: "40-60"
                      })
                    ]
                  });
                  counter = counter + 1;
                  if (
                    counter === 1 ||
                    counter % batchLimit === 0 ||
                    counter === filesLength
                  ) {
                    console.info(`-- ${counter} / ${filesLength} (dir ${dir})`);
                  }
                } catch (error) {
                  const distFilePath = `${actualDistDir}${file}`;
                  if (fs.pathExistsSync(distFilePath)) {
                    fs.removeSync(distFilePath);
                  }
                  console.info(`Bad file ${file} -> continue`);
                }
                resolve();
              })
            );
            if (promises 
              && (promises.length >= batchLimit || promises.length >= filesLength)
            ) {
              await Promise.all(promises);
              promises = [];
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`There was an error`, error);
  }
})();

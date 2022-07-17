import { mkdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import sass from 'sass';
import type { PluginOption, ResolvedConfig } from 'vite';

type ViteSassSplitPluginOptions = {
  files: string[];
};

async function folderExists(path: string) {
  try {
    const folderStat = await stat(path);

    if (!folderStat.isDirectory()) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export default function viteSassSplitPlugin({
  files,
}: ViteSassSplitPluginOptions): PluginOption {
  let config: ResolvedConfig;

  return {
    name: 'split-sass-files',
    apply: 'build',
    configResolved(_config) {
      config = _config;
    },
    async writeBundle() {
      for (const file of files) {
        const result = sass.compile(path.resolve(__dirname, './src', file));
        const outDirPath = path.resolve(
          __dirname,
          config.build.outDir,
          file.replace(`/${path.basename(file)}`, ''),
        );

        if (!(await folderExists(outDirPath))) {
          await mkdir(outDirPath, { recursive: true });
        }

        const newFilePath = path.resolve(
          outDirPath,
          path.basename(file).replace('.scss', '.css'),
        );
        await writeFile(newFilePath, result.css, {
          encoding: 'utf8',
        });
      }
    },
    closeBundle() {
      config.logger.info(`Split sass files:\n${files.join('\n')}`);
    },
  };
}

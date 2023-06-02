import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

export const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions = {
  skipLibCheck: true,
  importHelpers: true,
  noEmit: true,
  noResolve: false,
};

export function formatCompilerOptions(compilerOptions: ts.CompilerOptions) {
  return { ...DEFAULT_COMPILER_OPTIONS, ...compilerOptions, };
}

type VisitFileCallback = (url: string) => void;

export function visitFile(url: string, ignore: RegExp, callback: VisitFileCallback) {
  const queue = [url];
  while (queue.length > 0) {
    const item = queue.pop()!;
    if (!fs.existsSync(item) || ignore.test(item)) {
      continue;
    }
    const stat = fs.statSync(item);
    if (stat.isDirectory()) {
      const dirs = fs.readdirSync(item);
      for (let i = 0; i < dirs.length; i += 1) {
        const next = path.resolve(item, dirs[i]);
        if (!ignore.test(next)) {
          queue.unshift(next);
        }
      }
    } else {
      callback(item);
    }
  }
}

export function findDeclareFiles(url: string) {
  const files: string[] = [];
  visitFile(url, /node_modules|dist/, (fileUrl) => {
    if (/\.d\.ts$/.test(fileUrl)) {
      files.push(fileUrl);
    }
  });
  return files;
}

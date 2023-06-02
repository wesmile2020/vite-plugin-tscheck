import * as chalk from 'chalk';
import * as ts from 'typescript';

export function logError<T>(...rest: T[]) {
  console.log(chalk.red.bold(...rest));
}

export function logDiagnosticError(list: ts.Diagnostic[]): boolean {
  let isHasErrors = false;
  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    if (item.category === ts.DiagnosticCategory.Error) {
      isHasErrors = true;
    }
    const message = ts.flattenDiagnosticMessageText(item.messageText, '\n');
    if (item.file && typeof item.start === 'number') {
      const { line, character } = item.file.getLineAndCharacterOfPosition(item.start);
      logError(`${item.file.fileName} (${line + 1},${character + 1}): error\n TS${item.code}:${message}`);
    } else {
      logError(`Error: ${message}`);
    }
  }
  return isHasErrors;
}

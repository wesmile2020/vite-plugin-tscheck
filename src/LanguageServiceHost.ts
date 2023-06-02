import * as ts from 'typescript';

class LanguageServiceHost implements ts.LanguageServiceHost {
  private _compilerOptions: ts.CompilerOptions;
  private _versions: Map<string, number> = new Map();
  private _snapshots: Map<string, ts.IScriptSnapshot> = new Map();
  private _cwd: string;

  constructor(compilerOptions: ts.CompilerOptions, cwd: string) {
    this._compilerOptions = compilerOptions;
    this._cwd = cwd;
  }

  getCompilationSettings(): ts.CompilerOptions {
    return this._compilerOptions;
  }

  getScriptFileNames(): string[] {
    const filenames = [...this._versions.keys()];
    return filenames;
  }

  getScriptVersion(filename: string): string {
    return (this._versions.get(filename) || 0).toString();
  }

  setScriptSnapshot(filename: string, code: string): void {
    const version = (this._versions.get(filename) || 0) + 1;
    this._versions.set(filename, version);
    const snapshot = ts.ScriptSnapshot.fromString(code);
    this._snapshots.set(filename, snapshot);
  }

  getScriptSnapshot(filename: string): ts.IScriptSnapshot | undefined {
    let snapshot = this._snapshots.get(filename);
    if (!snapshot) {
      if (ts.sys.fileExists(filename)) {
        const code = ts.sys.readFile(filename)!;
        snapshot = ts.ScriptSnapshot.fromString(code);
        this._snapshots.set(filename, snapshot);
      }
    }
    return snapshot;
  }

  getCurrentDirectory(): string {
    return this._cwd;
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return ts.getDefaultLibFilePath(options);
  }

  fileExists = ts.sys.fileExists;

  readFile = ts.sys.readFile;

  readDirectory = ts.sys.readDirectory;

  directoryExists = ts.sys.directoryExists;

  getDirectories = ts.sys.getDirectories;
}

export { LanguageServiceHost };

import * as ts from 'typescript';
import * as path from 'path';
import { LanguageServiceHost } from './LanguageServiceHost';
import * as LogUtils from './LogUtils';
import * as utils from './utils'

class Engine {
  private _serviceHost: LanguageServiceHost;
  private _service: ts.LanguageService;

  constructor(cwd: string) {
    const configPath = path.resolve(cwd, 'tsconfig.json');
    const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
    if (error) {
      LogUtils.logError(`Engine: can't read tsconfig.json: ${error.messageText}`);
      throw new Error(`Engine: can't read tsconfig.json: ${error.messageText}`);
    }
    const { options, errors } = ts.convertCompilerOptionsFromJson(config.compilerOptions, cwd);
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i += 1) {
        LogUtils.logError(`Engine: can't parse config ${errors[i].messageText}`);
      }
      throw new Error(`Engine: can't parse config`);
    }
    const compilerOptions = utils.formatCompilerOptions(options);
    this._serviceHost = new LanguageServiceHost(compilerOptions, cwd);
    this._service = ts.createLanguageService(this._serviceHost, ts.createDocumentRegistry());

    const declareFiles = utils.findDeclareFiles(cwd);
    for (let i = 0; i < declareFiles.length; i += 1) {
      const code = ts.sys.readFile(declareFiles[i])!;
      this._serviceHost.setScriptSnapshot(declareFiles[i], code);
    }
  }

  check(filename: string, code: string): boolean {
    this._serviceHost.setScriptSnapshot(filename, code);
    const diagnostics = [
      ...this._service.getCompilerOptionsDiagnostics(),
      ...this._service.getSyntacticDiagnostics(filename),
      ...this._service.getSemanticDiagnostics(filename),
    ];
    return !LogUtils.logDiagnosticError(diagnostics);
  }
}

export { Engine };

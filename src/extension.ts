// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import registerCreateRequestCommand from "./commands/requestCommand";
import registerSaveRequestCommand from "./commands/saveRequestCommand";

const webviewPanels: Array<vscode.WebviewPanel> = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // const dataFilePath = vscode.Uri.joinPath(
  //   context.globalStorageUri,
  //   "requests.json"
  // ).fsPath;
  // if (!fs.existsSync(dataFilePath)) {
  //   fs.mkdirSync(dataFilePath, { recursive: true });
  // }

  registerCreateRequestCommand(context, webviewPanels);
  registerSaveRequestCommand(context, webviewPanels);
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

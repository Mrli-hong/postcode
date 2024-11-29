import * as vscode from "vscode";

export default function (
  context: vscode.ExtensionContext,
  webviewPanels: Array<vscode.WebviewPanel>
) {
  context.subscriptions.push(
    vscode.commands.registerCommand("postcode.saveRequest", () => {
      const activePanel = webviewPanels.find((item) => item.active);
      activePanel.webview.postMessage({
        type: "saveRequest",
      });
    })
  );
}

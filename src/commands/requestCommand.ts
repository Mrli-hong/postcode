import * as vscode from "vscode";
import * as fs from "fs";
import axios from "axios";
import * as https from "https";
import { RequestOptions } from "../../webview/features/requestOptions/requestOptionsSlice";
import { VscodeDataWithCbId } from "@/utils/vscode";
export default function (
  context: vscode.ExtensionContext,
  webviewPanels: Array<vscode.WebviewPanel>
) {
  /**
   * 执行回调函数
   * @param {*} panel
   * @param {*} message
   * @param {*} resp
   */
  function invokeCallback(
    panel: vscode.WebviewPanel,
    message: VscodeDataWithCbId,
    resp
  ) {
    console.log("回调消息：", resp);
    panel.webview.postMessage({
      cmd: "vscodeCallback",
      cbid: message.cbid,
      data: resp,
    });
  }

  const webviewContent = fs
    .readFileSync(
      vscode.Uri.joinPath(context.extensionUri, "dist/index.html").fsPath,
      { encoding: "utf-8" }
    )
    .replace(
      "styleUri",
      vscode.Uri.joinPath(context.extensionUri, "/dist/main.css")
        .with({ scheme: "vscode-resource" })
        .toString()
    )
    .replace(
      "scriptUri",
      vscode.Uri.joinPath(context.extensionUri, "/dist/webview.js")
        .with({ scheme: "vscode-resource" })
        .toString()
    );
  const messageHandler = {
    request({ panel }, message: VscodeDataWithCbId) {
      const {
        data: { method, url, headers, body, auth, options },
      } = message;
      // Options Section
      const requestOptions = options as RequestOptions;

      let requestStartedAt, responseDuration;

      console.log(message, url, "messageHandler");
      if (!url) {
        invokeCallback(panel, message, {
          error: { message: "Request URL is empty" },
        });
        vscode.window.showInformationMessage("Request URL is empty");
        return;
      }

      const headersObj = {};

      if (auth.type === "bearer") {
        headersObj["Authorization"] = `Bearer ${auth.bearer.token}`;
      }

      headers.forEach(({ key, value, disabled }) => {
        if (!disabled) {
          headersObj[key] = value;
        }
      });

      let data = "";
      if (body.mode === "formdata") {
        const dataObj = new URLSearchParams();
        body.formdata.forEach(({ key, value, disabled }) => {
          if (!disabled) {
            dataObj.append(key, value);
          }
        });
        data = dataObj.toString();
        headersObj["Content-Type"] = "multipart/form-data";
      } else if (body.mode === "urlencoded") {
        const dataObj = new URLSearchParams();
        body.urlencoded.forEach(({ key, value, disabled }) => {
          if (!disabled) {
            dataObj.append(key, value);
          }
        });
        data = dataObj.toString();
        headersObj["Content-Type"] = "application/x-www-form-urlencoded";
      } else if (body.mode === "raw") {
        data = body.raw;
        headersObj["Content-Type"] = {
          json: "application/json",
          html: "text/html",
          xml: "text/xml",
          text: "text/plain",
        }[body.options.raw.language];
      } else if (body.mode === "file") {
        data = body.fileData;
        headersObj["Content-Type"] = "application/octet-stream";
      } else if (body.mode === "graphql") {
        data = JSON.stringify({
          query: body.graphql.query,
          variables: body.graphql.variables,
        });
        headersObj["Content-Type"] = "application/json";
      }

      // Option 1. StrictSSL
      https.globalAgent.options.rejectUnauthorized =
        requestOptions.strictSSL === "yes";

      axios.interceptors.request.use((config) => {
        requestStartedAt = new Date().getTime();
        return config;
      });

      axios.interceptors.response.use((config) => {
        responseDuration = new Date().getTime() - requestStartedAt;
        return config;
      });

      axios({
        method,
        url,
        baseURL: "",
        data: data,
        headers: headersObj,
        auth: auth.type === "basic" ? auth.basic : undefined,
        transformResponse: [(data) => data],
        responseType: "text",
        validateStatus: () => true,
      })
        .then((resp) =>
          invokeCallback(panel, message, {
            data: resp.data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers,
            duration: responseDuration,
          })
        )
        .catch((err) => {
          invokeCallback(panel, message, {
            error: err,
          });

          vscode.window.showInformationMessage("Error: Could not send request");
        });
    },
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("postcode.createRequest", () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Welcome to Postcode!2ss");

      const panel = vscode.window.createWebviewPanel(
        "postcode",
        "Postcode",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, "dist"),
          ],
        }
      );
      webviewPanels.push(panel);

      panel.webview.html = webviewContent;
      panel.iconPath = vscode.Uri.joinPath(
        context.extensionUri,
        "icons/icon.png"
      );
      const global = { panel };

      panel.webview.onDidReceiveMessage((data: VscodeDataWithCbId) => {
        if (messageHandler[data.cmd]) {
          messageHandler[data.cmd](global, data);
        } else {
          vscode.window.showErrorMessage(`未找到名为 ${data.cmd} 回调方法!`);
        }
      });
      panel.onDidDispose(() => {
        webviewPanels.splice(
          webviewPanels.findIndex((item) => item === panel),
          1
        );
      });
    })
  );
}

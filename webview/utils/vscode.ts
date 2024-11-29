let vscode;
if (typeof acquireVsCodeApi !== "undefined") {
  vscode = acquireVsCodeApi();
}
type Callback = (data: any) => void;
type VscodeData = { cmd: string; data?: any };
type VscodeDataWithCbId = VscodeData & { cbid: string };

const callbacks: Record<string, Callback> = {}; // 假设你在某个地方管理回调函数

const callVscode = (data: string | VscodeData, cb?) => {
  if (typeof data === "string") {
    data = { cmd: data };
  }
  if (cb) {
    // 时间戳加上5位随机数
    const cbid = Date.now() + "" + Math.round(Math.random() * 100000);
    callbacks[cbid] = cb;
    (data as VscodeDataWithCbId).cbid = cbid;
  }
  vscode.postMessage(data);
};

export { callVscode, callbacks, VscodeData, VscodeDataWithCbId };

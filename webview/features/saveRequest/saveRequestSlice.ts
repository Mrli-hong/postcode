import { RequestAuthState as RequestAuth } from "../../features/requestAuth/requestAuthSlice";
import { RequestBodyState as RequestBody } from "../../features/requestBody/requestBodySlice";
import { Header } from "../../features/requestHeader/requestHeaderSlice";
import { RequestOptions } from "../../features/requestOptions/requestOptionsSlice";

export interface Folder {
  folderId: string; // 文件夹的唯一标识符
  folderName: string; // 文件夹的名称
  parentFolderId?: string; // 父文件夹的 ID，根文件夹为 null
  children?: Array<Folder | RequestDetailInfo> | null; // 使用子文件夹对象，而不仅仅是 ID
}

export interface RequestDetailInfo {
  method: string;
  auth: RequestAuth;
  body: RequestBody;
  headers: Header[];
  url: string;
  options: RequestOptions;
}

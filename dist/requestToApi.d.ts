import { IRequestToApi } from "./types";
interface IResponse {
    data: any;
    isOK: boolean;
    request: XMLHttpRequest;
    status: number;
}
declare const requestToApi: (args: IRequestToApi) => Promise<IResponse>;
export default requestToApi;
//# sourceMappingURL=requestToApi.d.ts.map
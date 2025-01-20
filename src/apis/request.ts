import HttpClient from "../utils/http";

export const baseUrl = "/api";
class MainApi extends HttpClient {
  public constructor() {
    const contentType = "application/json";
    const options = {
      contentType,
      noErrMsgCodes: []
    };
    super(baseUrl, options);
  }
}
export default new MainApi();

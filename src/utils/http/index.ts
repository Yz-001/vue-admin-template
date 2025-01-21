import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from "axios";
import type { Wapper, HttpOptions } from "./types";
import { ElMessage } from "element-plus";
import qs from "qs";
import { getToken } from "@/utils/storage";
import { useHttpCancel } from "@/stores/modules/httpCancel";
import router from "@/router/index";

const error = (msg: string) => {
  ElMessage.error(msg);
};

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  private httpOption: HttpOptions;

  public constructor(baseURL: string, httpOption: HttpOptions) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Authorization: getToken() || "",
        "Content-Type": httpOption.contentType
      }
    });
    this.httpOption = httpOption;
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }
  private _initializeRequestInterceptor = () => {
    // 可在此处进行前置操作

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const httpCancel = useHttpCancel();
        httpCancel.requestClearRepeatQueue(config);

        config.headers.Authorization = getToken() || "";

        config.transformRequest = [
          function (data) {
            return qs.stringify(data);
          }
        ];

        // 记录新请求
        config.cancelToken = new axios.CancelToken(cancel => {
          httpCancel.pushHttpPromiseCancel(config, cancel);
        });

        return config;
      },
      (err: Error) => {
        return Promise.reject(err);
      }
    );
  };
  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this._handleResponse, this._handleError);
  };
  public async Get<T = any>(url: string, params?: any): Promise<Wapper<T>> {
    return await this.instance.get<AxiosResponse<Wapper<T>>, any>(url, { params });
  }

  public async Post<T = any>(url: string, data?: any): Promise<Wapper<T>> {
    return await this.instance.post<AxiosResponse<Wapper<T>>, any>(url, data);
  }
  public async Put<T = any>(url: string, data?: any): Promise<Wapper<T>> {
    return await this.instance.put<AxiosResponse<Wapper<T>>, any>(url, data);
  }
  public async Patch<T = any>(url: string, data?: any): Promise<Wapper<T>> {
    return await this.instance.patch<AxiosResponse<Wapper<T>>, any>(url, data);
  }
  public async Delete<T = any>(url: string, data?: any): Promise<Wapper<T>> {
    return await this.instance.delete<AxiosResponse<Wapper<T>>, any>(url, data);
  }
  public async Request<T = any>(option: AxiosRequestConfig): Promise<Wapper<T>> {
    return await this.instance.request<T>(option);
  }
  private _handleResponse = (res: AxiosResponse) => {
    if (res.request.responseType == "blob") {
      // blob 文件流直接返回
      return res;
    }

    if (res.headers?.["content-type"] == "text/html") return res.data;
    res.data.requestAccess = res.data.code === accessCode;
    // 在记录请求队列 删除 请求完毕的数据
    const httpCancel = useHttpCancel();
    httpCancel.responseClearQueue(res.config);

    if (!res.data.requestAccess) {
      // 获取错误信息
      if (!this.httpOption.noErrMsgCodes?.includes(res.data?.code)) {
        const msg = errorCode[res?.data?.code] || res.data?.msg || errorCode["default"];
        if (msg) {
          error(msg);
        }
      }

      if (res.data?.code == 401) {
        router.push("/login");
      }
      return Promise.reject(res.data);
    }

    return res.data;
  };

  private _handleError = (error: any) => {
    if (axios.isCancel(error)) {
      // 为了终结取消后 promise 走到.catch(res=>{})  错误
      return new Promise(() => {});
    }
    return Promise.reject(error.response.data);
  };
}

export const errorCode: { [key: string]: string } = {
  "401": "认证失败，无法访问系统资源",
  "403": "当前操作没有权限",
  "404": "访问资源不存在",
  "500": "服务端异常",
  "501": "无法识别请求方法",
  "502": "网关错误",
  "503": "服务器目前无法使用",
  "504": "网关超时",
  default: "系统未知错误，请反馈给管理员"
};

export const accessCode = 200;

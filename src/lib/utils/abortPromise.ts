export type IAbortFunction = () => void;

export interface IAbort {
  abort: IAbortFunction;
}

export interface IAbortPromise<T> extends Promise<T>, IAbort {}

export class AbortPromise<T> implements IAbortPromise<T> {
  abort: IAbortFunction;
  readonly [Symbol.toStringTag]: string;

  protected promise: Promise<T>;

  constructor(promise: Promise<T>, abort: IAbortFunction) {
    this.abort = abort;
    this.promise = promise;
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => PromiseLike<TResult> | TResult)
      | undefined
      | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
}
//
// const delay = (ms: number = 0): AbortPromise<never> => {
//   let timerId: number;
//
//   return new AbortPromise<never>(
//     new Promise<never>(resolve => {
//       timerId = setTimeout(resolve, ms);
//     }),
//     () => clearTimeout(timerId)
//   );
// };
//
// export declare enum RequestNetworkMethod {
//   Get = "GET",
//   Post = "POST",
//   Put = "PUT",
//   Patch = "PATCH",
//   Delete = "DELETE"
// }
//
// export declare type IGetParams = Record<string, any>;
//
// export interface IUrl {
//   readonly host: string;
//   readonly path: string;
//   params?: IGetParams;
//   setParams(params: IGetParams): void;
//   getBase(): string;
//   getFullUrl(): string;
// }
//
// export interface IRequest<T> {
//   payload?: T;
//   reload?: boolean;
//   headers?: Headers;
// }
//
// const uuid = () => `${Date.now()}`; // todo:
//
// export interface IException {
//   name: string;
//   type: string;
//   title: string;
//   comment: string;
//   message: string;
//   stack?: string;
// }
//
// class Exception extends Error implements IException {
//   comment: string;
//   title: string;
//   type: string;
//
//   constructor(message?: string) {
//     super(message);
//
//     this.type = "Exception";
//     this.title = "";
//     this.comment = message || "";
//   }
// }
//
// interface IBHError {
//   uuid: string;
//   code: string;
//   system: string;
//   text?: string;
//   title?: string;
// }
//
// class ApiException extends Exception implements IException {
//   url: IUrl;
//   comment: string;
//   type: string;
//   title: string;
//   uuid: string;
//   code: string;
//   system: string;
//
//   constructor(url: IUrl, error: IBHError, message?: string) {
//     super(message);
//
//     this.type = "ApiException";
//     this.url = url;
//     this.title = error.title || "";
//     this.comment = error.text || message || "";
//     this.uuid = error.uuid;
//     this.code = error.code;
//     this.system = error.system;
//   }
// }
//
// const restRequest = <T extends {} = {}>(method: RequestNetworkMethod) => (
//   url: IUrl,
//   request: IRequest<T> = {}
// ) => {
//   const rqUUID = uuid();
//   const abortController = new AbortController();
//   const { payload, reload, headers = new Headers() } = request;
//
//   if (!headers.has("Content-Type")) {
//     headers.set("Content-Type", "application/json");
//   }
//   headers.set("rest-uuid", rqUUID);
//
//   return new AbortPromise(
//     fetch(url.getFullUrl(), {
//       method,
//       headers,
//       credentials: "include",
//       signal: abortController.signal,
//       cache: reload ? "reload" : "default",
//       body:
//         !payload || method === RequestNetworkMethod.Get
//           ? void 0
//           : JSON.stringify(payload)
//     })
//       .then(response => {
//         if (response.headers.has("error_code")) {
//           return location.reload();
//         }
//
//         try {
//           return response.json();
//         } catch (e) {
//           throw new Exception("Response in not json format");
//         }
//       })
//       .then(json => {
//         if (json.success) {
//           return json;
//         }
//         if (json.error) {
//           throw new ApiException(url, json.error);
//         }
//
//         throw new Exception("Response error");
//       }),
//     abortController.abort
//   );
// };
//
// export const get = restRequest(RequestNetworkMethod.Get);
// export const post = restRequest(RequestNetworkMethod.Post);
// export const patch = restRequest(RequestNetworkMethod.Patch);
// export const put = restRequest(RequestNetworkMethod.Put);
// export const del = restRequest(RequestNetworkMethod.Delete);
export default undefined;

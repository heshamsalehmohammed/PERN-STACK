interface IBasicResponse<T = string> {
  success: boolean;
  message: T;
}

interface IDataResponse<T = unknown> extends IBasicResponse {
  data?: T;
}

interface IObjectValue<T = unknown> {
  [key: string]: T;
}

type P<T> = Pick<T, K extends IObjectValue ? T[K] : never>;


interface ISignedPayload {
  iat: number;
  exp: number;
}

interface IBasicResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}

interface IDataResponse<T = unknown> extends IBasicResponse {
  data?: T;
  config?: T;
}

interface IObjectValues {
  [key: string]: string | number | boolean;
}




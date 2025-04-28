export interface IServiceResult<T> {
    errorDetails: string;
    errorMessage: string;
    errorType: string;
    result?: T;
  }
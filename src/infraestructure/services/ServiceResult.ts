import { IServiceResult } from "../Interfaces/IServiceResult";

export class ServiceResult<T> implements IServiceResult<T> {
  public errorDetails: string = "";
  public errorMessage: string = "";
  public errorType: string = "";
  public messages: string = "";
  public result?: T = undefined;
}
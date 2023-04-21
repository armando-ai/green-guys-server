export interface ResponseStatus<T> {
  code: number;
  message: string;
  data?: T;
}

export interface RevivalOptions {
  failOnUnknownFields?: boolean;
  failOnMissingFields?: boolean;
  assignOnly?: boolean;
}

export const defaultReviveOptions: RevivalOptions = {
  failOnUnknownFields: false,
  failOnMissingFields: false,
  assignOnly: false,
}

export interface RevivalConstructor<T> {
  new (...args: any[]): T;
}

export interface RevivalObjectSchema<T> {
  type: RevivalConstructor<T>;
  properties: { [key: string]: RevivalSchema<any> }
}

export interface RevivalArraySchema<T> {
  items: RevivalSchema<T>
}

export type RevivalSchema<T> = RevivalConstructor<T> | RevivalObjectSchema<T> | RevivalArraySchema<T>

export interface RevivalSchemaProvider<T> {
  getReviveSchema(): RevivalSchema<T>
}

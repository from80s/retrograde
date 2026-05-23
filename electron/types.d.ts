declare module 'node-gzip' {
  export function gzip(input: string | Buffer, options?: any): Promise<Buffer>;
  export function ungzip(input: string | Buffer, options?: any): Promise<Buffer>;
}

declare module 'crc-32' {
  export function buf(data: Buffer, seed?: number): number;
  export function str(data: string, seed?: number): number;
  export function bstr(data: string, seed?: number): number;
}

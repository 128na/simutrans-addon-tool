interface ResizeobjArgs {
  resizeobjPath: string;
  target: string[];
  options: ResizeobjOptions;
}
interface ResizeobjOptions {
  [key: string]: unknown;
  a?: number;
  s?: 0 | 1 | 2;
  w?: number;
  k?: boolean;
  ka?: boolean;
  x?: boolean;
  m?: number;
  e?: string;
  t?: string;
  n?: boolean;
}

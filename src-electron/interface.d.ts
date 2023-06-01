// import gm from 'gm';

interface onReadyArgs {
  [directory: string]: string[];
}

interface pixelHandlerArgs {
  rgba: RGBA;
  data: Uint8Array;
  index: number;
  x: number;
  y: number;
}

interface pixelHandler {
  (option: pixelHandlerArgs): RGBA;
}

type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

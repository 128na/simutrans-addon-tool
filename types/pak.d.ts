interface startPakOption {
  makeobjPath: string;
  size: number;
  pakPath: string;
  sourcePath: string;
}

interface startAutoPakOption {
  makeobjPath: string;
  size: number;
  pakPath: string;
  sourcePath: string;
  simutransPath: string;
}

interface listOption {
  makeobjPath: string;
  target: string;
}

interface DatAddon {
  file: string;
  dat: string;
}
interface DatConvertedAddon {
  file: string;
  dat: Dat;
}
interface PakAddon {
  pak: string;
  objs: string[];
}
interface PakConvertedAddon {
  file: string;
  objs: string[];
}

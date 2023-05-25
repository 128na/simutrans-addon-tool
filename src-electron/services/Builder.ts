import { dirname } from 'path';
import { MakeobjAsync } from 'simutrans-makeobj-wrapper';
import MakeobjResult from 'simutrans-makeobj-wrapper/dist/src/MakeobjResponse';

export default class Builder {
  public async pak(makeobjPath: string, size: number, pakPath: string, datPathes: string[], abortController?: AbortController): Promise<MakeobjResult> {
    const makeobj = new MakeobjAsync(makeobjPath, abortController);
    return makeobj.exec({ cwd: dirname(datPathes[0]) }, `PAK${size}`, pakPath, ...datPathes);
  }

  public async merge(makeobjPath: string, pakPathes: string[], mergedPakPath: string, abortController?: AbortController): Promise<MakeobjResult> {
    const makeobj = new MakeobjAsync(makeobjPath, abortController);
    return makeobj.merge(mergedPakPath, ...pakPathes);
  }
}

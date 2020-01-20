import { dependencyManager } from './depManager';

export function autorun(func: Function) {
  return new Reaction(func);
}

class Reaction {
  public tracked: Function;

  constructor(trackedFn: Function) {
    this.tracked = trackedFn;
    dependencyManager.start(null, trackedFn);
    this.tracked.call(trackedFn);
    dependencyManager.over();
  }
}

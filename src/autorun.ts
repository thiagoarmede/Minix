import { dependencyManager } from './depManager';

export function autorun(func: Function) {
  return new Reaction(func);
}

class Reaction {
  public tracked: Function;
  public id: string;
  static reactionCount = 0;

  constructor(trackedFn: Function) {
    this.id = `reaction-${++Reaction.reactionCount}`;
    this.tracked = trackedFn;
    dependencyManager.start(null, trackedFn);
    this.tracked.call(trackedFn);
    dependencyManager.over();
  }
}

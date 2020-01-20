interface DependecyManagerStore {
  [key: string]: any;
}

export const dependencyManager = {
  runningFunc: null,
  runningTarget: null,
  /**
   * Object which contains all Minix observable data.
   */
  store: <DependecyManagerStore>{},
  collect(obId: string) {
    if (this.runningFunc) {
      this.addNowEventFunc(obId);
    }
  },
  addNowEventFunc(obId: string) {
    this.store[obId] = this.store[obId] || {};
    this.store[obId].target = this.runningTarget;
    this.store[obId].watchers = this.store[obId].watchers || [];
    this.store[obId].watchers.push(this.runningFunc);
  },
  trigger(obId: string) {
    const obj = this.store[obId];

    if (obj && obj.watchers) {
      for (const func of obj.watchers) {
        func.call(obj.target || this);
      }
    }
  },
  start(nowTarget: any = null, nowEventFunc: any) {
    this.runningTarget = nowTarget;
    this.runningFunc = nowEventFunc;
  },
  over() {
    this.runningTarget = null;
    this.runningFunc = null;
  },
};

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
  addNowEventFunc(observableId: string) {
    /**
     * The observable value can have been already observed.
     */
    if (!this.store[observableId]) {
      this.store[observableId] = {};
    }

    this.store[observableId].target = this.runningTarget;
    this.store[observableId].watchers.push(this.runningFunc);
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

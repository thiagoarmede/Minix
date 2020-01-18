interface DependecyManagerStore {
  [key: string]: any;
}

export let dependenceManager = {
  nowEventFunc: null,
  nowTarget: null,
  store: <DependecyManagerStore>{},

  collect(obId: string) {
    if (this.nowEventFunc) {
      this.addNowEventFunc(obId);
    }
  },
  addNowEventFunc(obId: string) {
    this.store[obId] = this.store[obId] || {};
    this.store[obId].target = this.nowTarget;
    this.store[obId].watchers = this.store[obId].watchers || [];
    this.store[obId].watchers.push(this.nowEventFunc);
  },
  trigger(obId: string) {
    const obj = this.store[obId];
    if (obj && obj.watchers) {
      obj.watchers.forEach((func: any) => {
        func.call(obj.target || this);
      });
    }
  },
  start(nowTarget: any, nowEventFunc: any) {
    this.nowTarget = nowTarget;
    this.nowEventFunc = nowEventFunc;
  },
  over() {
    this.nowTarget = null;
    this.nowEventFunc = null;
  },
};

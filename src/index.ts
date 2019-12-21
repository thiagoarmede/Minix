function observable(target: any, name: string): any {
  let obj = target[name];

  function recursiveObj(obj: object) {
    Object.keys(obj).forEach(item => {
      Object.defineProperty(obj, item, observable(obj, item));
    });
  }

  if (typeof obj === 'object') {
    recursiveObj(obj);
  }

  let observableObj = new Observable(obj);

  return {
    enumerable: true,
    configurable: true,
    get() {
      return observableObj.get();
    },
    set(value: any) {
      if (typeof value === 'object') {
        recursiveObj(value);
      }
      observableObj.set(value);
    },
  };
}

class Observable {
  value: any;
  obId: string;
  static idCount = 0;

  constructor(value: any) {
    this.obId = 'observable-' + ++Observable.idCount;
    this.value = value;
  }
  get() {
    dependenceManager.collect(this.obId);
    return this.value;
  }
  set(value: any) {
    this.value = value;
    dependenceManager.trigger(this.obId);
  }
}

let dependenceManager = {
  nowEventFunc: null,
  nowTarget: null,
  store: {},
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
      obj.watchers.forEach(func => {
        func.call(obj.target || this);
      });
    }
  },
  start(nowTarget, nowEventFunc) {
    this.nowTarget = nowTarget;
    this.nowEventFunc = nowEventFunc;
  },
  over() {
    this.nowTarget = null;
    this.nowEventFunc = null;
  },
};

function computed(target: any, name: string) {
  let computed = new Computed(target, name);

  return {
    enumerable: true,
    configurable: true,
    get() {
      return computed.get();
    },
  };
}

class Computed {
  constructor(target: any, name: string) {
    this.value = undefined;
    this.cb = target[name].bind(target);
    this.target = target;
    this.collectDependence();
  }

  collectDependence() {
    dependenceManager.start(this.target, this.updateValue.bind(this));
    this.updateValue();
    dependenceManager.over();
  }

  updateValue() {
    this.value = this.cb();
  }

  get() {
    return this.value;
  }
}

class Store {
  @observable
  a = 1;

  @observable
  b = 1;

  @computed
  c() {
    return this.a + this.b;
  }

  constructor() {
    console.log(this.a);
    setTimeout(() => {
      console.log('改变之后' + this.a);
      this.b = 5;

      setTimeout(() => {
        console.log('改变之后' + this.a);
        this.b = 9;
      }, 2000);
    }, 2000);
  }
}

new Store();

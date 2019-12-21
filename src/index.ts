function observable(target, name, descriptor) {
  let obj = descriptor ? descriptor.initializer.call(this) : target[name];

  function recursiveObj(obj) {
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
    get: function() {
      return observableObj.get();
    },
    set: function(value) {
      if (typeof value === 'object') {
        recursiveObj(value);
      }
      observableObj.set(value);
    },
  };
}

let idCount = 0;

class Observable {
  constructor(value) {
    this.obId = 'observable-' + ++idCount;
    this.value = value;
  }
  get() {
    dependenceManager.collect(this.obId);
    return this.value;
  }
  set(value) {
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
  trigger(obId) {
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

function computed(target, name, descriptor) {
  let computed = new Computed(target, name);
  
  return {
    enumerable: true,
    configurable: true,
    get: function() {
      return computed.get();
    },
  };
}

class Computed {
  constructor(target, name) {
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

function watch(target, name, descriptor) {
  let obj = descriptor.initializer.call(this);

  Object.keys(obj).forEach(item => {
    let cb = obj[item];

    let Watch = new WatchObj(cb, target, item);
  });

  return descriptor;
}

class WatchObj {
  constructor(cb, target, key) {
    this.cb = cb;
    this.target = target;
    this.key = key;
    this.collectDependence();
  }
  collectDependence() {
    dependenceManager.start(this.target, this.cb.bind(this.target));
    0, this.target[this.key];
    dependenceManager.over();
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

  @watch
  watch = {
    b() {
      console.log(111);
      console.log(this.a);
    },
  };

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

new b();

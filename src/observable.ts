import { dependenceManager } from 'depManager';

export function observable(target: any, name: string): any {
  let obj = target[name];

  function recursiveObj(obj: object) {
    Object.keys(obj).forEach(item => {
      Object.defineProperty(obj, item, observable(obj, item));
    });
  }

  if (typeof obj === 'object') {
    recursiveObj(obj);
  }

  const observableObj = new Observable(obj);

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

import { dependencyManager } from './depManager';

export function observable(target: any, name: string): any {
  let obj = target[name];

  if (typeof obj === 'object') {
    applyObservableRecursively(obj);
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
        applyObservableRecursively(value);
      }
      observableObj.set(value);
    },
  };
}

function applyObservableRecursively(obj: object) {
  /**
   * Handling array item adding or removing.
   */
  if (Array.isArray(obj)) {
    observable(obj, 'length');
  }

  Object.keys(obj).forEach(item => {
    Object.defineProperty(obj, item, observable(obj, item));
  });
}

class Observable<T extends any> {
  value: T;
  obId: string;
  watchers: Function[];

  /**
   * Id counting to guarantee IDs uniqueness.
   */
  static idCount = 0;

  constructor(value: T) {
    this.obId = 'observable-' + ++Observable.idCount;
    this.value = value;
    this.watchers = [];
  }

  get() {
    dependencyManager.collect(this.obId);
    return this.value;
  }

  set(value: T) {
    this.value = value;
    dependencyManager.trigger(this.obId);
  }
}

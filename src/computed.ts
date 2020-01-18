import { dependencyManager } from 'depManager';

export function computed(target: any, name: string) {
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
  value: any;
  callback: any;
  target: any;

  constructor(target: any, name: string) {
    this.value = undefined;
    this.callback = target[name].bind(target); // Representa a
    this.target = target;
    console.log(this.target);
    this.collectDependence();
  }

  collectDependence() {
    dependencyManager.start(this.target, this.updateValue.bind(this));
    this.updateValue();
    dependencyManager.over();
  }

  updateValue() {
    this.value = this.callback();
  }

  get() {
    return this.value;
  }
}

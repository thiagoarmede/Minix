import { observable } from './observable';
import { computed } from '/computed';

class Store {
  @observable
  a = 1;

  @observable
  b = 1;

  @computed
  c() {
    console.log('Computed the value');
    return this.a + this.b;
  }

  constructor() {
    this.a = 3;
    this.b = 4;
  }
}

new Store();

export { observable, computed };

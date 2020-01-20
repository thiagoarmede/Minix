import { observable } from './observable';
import { computed } from './computed';
import { autorun } from './autorun';

class Store {
  @observable
  a: any;

  @observable
  b: any;

  @computed
  c() {
    return this.a + this.b;
  }

  constructor() {
    autorun(() => {
      console.log(this.a);
    });

    this.a = 2;
    this.a = 3;
  }
}

new Store();

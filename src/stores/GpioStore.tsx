import { observable, ObservableMap, computed } from 'mobx';

export default class GpioStore {
  pin = observable.map();

  constructor() {

    this.pin.observe(change => {
      console.log(change.type, change.name, change.object.get(change.name));
    })

  }


}
import { observable, autorun, ObservableMap, computed } from 'mobx';
import { StoreProps } from './';

export default class MotorsStore {
  @observable leftMotor: number;
  @observable rightMotor: number;

  constructor(store: StoreProps) {
    this.leftMotor = 0;
    this.rightMotor = 0;

    autorun(() => {
        store.gpio.pin.set("v0", this.leftMotor);
        store.gpio.pin.set("v1", this.rightMotor);
    })

  }
}
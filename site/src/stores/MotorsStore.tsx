import { observable, autorun, ObservableMap, computed } from 'mobx';
import { StoreProps } from './';

export default class MotorsStore {
  @observable leftMotor: number;
  @observable rightMotor: number;

  constructor(store: StoreProps) {
    this.leftMotor = 0;
    this.rightMotor = 0;

    autorun(() => {
      store.rpc.call("Robot.cmd", { cmd: "motor", left: Math.round(this.leftMotor), right: Math.round(this.rightMotor) }, "",
        function (err, result, tag) {
          if (err) {
            console.log(err);
          } 
        });

        console.log(this.leftMotor);
    }, {delay: 200})

  }
}
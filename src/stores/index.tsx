
import GpioStore from './GpioStore';
import GamepadStore from './GamepadStore';
import MotorsStore from './MotorsStore';
import Rpc from './Rpc';

export type StoreProps = { gamepad: GamepadStore,  gpio: GpioStore, motors?: MotorsStore, rpc?: Rpc }

const store: StoreProps = {
  gamepad: new GamepadStore(),
  gpio: new GpioStore(),
  rpc: null // new Rpc({host: window.location.hostname})
};

store.motors = new MotorsStore(store);

export default store;
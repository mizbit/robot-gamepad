
import GamepadStore from './GamepadStore';
import MotorsStore from './MotorsStore';
import Rpc from './Rpc';

export type StoreProps = { gamepad: GamepadStore, motors?: MotorsStore, rpc?: Rpc }

const store: StoreProps = {
  gamepad: new GamepadStore(),
  rpc: new Rpc({ host: window.location.hostname })
};

store.motors = new MotorsStore(store);

export default store;
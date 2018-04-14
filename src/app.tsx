import * as React from 'react';

import { GamepadInput as Gamepad, GamepadPreview } from '@bestyled/gamepad';
import { Gauge } from './components/Gauge';
import { Panel, PanelRow } from './components/Layout';
import { inject, observer } from 'mobx-react';
import { StoreProps } from './stores';

import { IMapDidChange } from 'mobx';

@inject("store") @observer
class App extends React.Component<{ store?: StoreProps }, any> {

  _observers: any;

  constructor(props) {
    super(props);

    this._observers = { 
      axis: this.props.store.gamepad.axis.observe(this.onAxisChange.bind(this));
      button: this.props.store.gamepad.button.observe(this.onButtonChange.bind(this))
    }
  }

  onAxisChange(axis: IMapDidChange<string, { x: number, y: number }>) {
     if (axis.name !== "leftStick" ) return;

    let newValue = axis.object.get(axis.name);
    let x = newValue.x;
    let y = -1 * newValue.y;

    let scale = Math.sqrt((x * x) + (y * y)) / Math.sqrt(2);
    let angle = Math.atan2(x, y) * (180 / Math.PI);

    let leftspeed, rightspeed, direction;
    if ((angle > 0) && (angle <= 90)) {
      leftspeed = 100;
      rightspeed = (90 - angle) / 90 * 100

    } else if ((angle > 90) && (angle <= 180)) {
      leftspeed = 100;
      rightspeed = (angle - 90) / 90 * 100
    } else if ((angle < -90) && (angle >= -180)) {
      rightspeed = 100
      leftspeed = ((angle * -1) - 90) / 90 * 100

    } else /* angle between -90 and 0)*/ {
      rightspeed = 100
      leftspeed = (90 - (angle * -1) / 90 * 100)
    }

    if (y > 0)
      direction = 1;
    else
      direction = -1;

    let z = rightspeed * scale * direction;
    let w = leftspeed * scale * direction;

   this.props.store.motors.leftMotor = w;
   this.props.store.motors.rightMotor = z;

  }

  onButtonChange(change: IMapDidChange<string, boolean>) {
    if (change.object.get(change.name))
      console.log("Button " + change.name);
  }

  componentWillUnmount() {
    this._observers.axis();
    this._observers.button();
  }
  
  render() {
    let gamepad = this.props.store.gamepad;
    return (
      <Panel>
        <Gamepad index={0} onConnect={gamepad.connectHandler} onDisconnect={gamepad.disconnectHandler}
          onAxis={gamepad.onAxisValue} onButton={gamepad.onButton} >
          <GamepadPreview src="http://res.cloudinary.com/headlight/image/upload/v1523206548/gamepadSprite.png" />
        </Gamepad>
        {gamepad.connected &&
          <PanelRow>
            <Gauge value={this.props.store.motors.leftMotor} />
            <Gauge value={this.props.store.motors.rightMotor} />
          </PanelRow>}
      </Panel>
    );
  }
}

export default App;
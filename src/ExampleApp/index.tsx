import * as React from 'react';

import { GamepadInput as Gamepad, GamepadPreview } from '../Components';
import { Gauge } from './ComponentsForExample/Gauge';
import { Panel, PanelRow } from './ComponentsForExample/Layout';

class App extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      connected: false,
      x: 0,
      y: 0,
      leftMotor: 0,
      rightMotor: 0
    };
  }

  /** Optional callback invoked when controller is connected;  may have to press any button to get the first connection registered */
  connectHandler(gamepad: { index: number, id: string }) {
    console.log(`Gamepad ${gamepad.id} connected!`)
    this.setState({
      connected: true
    })
  }

  /** Optional callback invoked when controller is disconnected */
  disconnectHandler(gamepad: { index: number, id: string }) {
    console.log(`Gamepad ${gamepad.id} disconnected !`)

    this.setState({
      connected: false
    })
  }

  /** Option callback invoked whenever a controller stick or variable trigger changes */
  onAxisValue(axisName: string, dimension: string, value: number, previousValue: number) {



    switch (axisName) {
      case "leftStick":

        let x = this.state.x;
        let y = this.state.y;

        if (dimension == "x")
          x = value;
        else
          y = -1 * value;

        this.setState({ x: x, y: y });

        let scale = Math.sqrt((x * x) + (y * y))
        let angle = Math.atan2(x, y) * (180 / Math.PI);

        console.log(`x=${x}, y=${y}, angle=${angle}, scale=${scale}`);

        let leftspeed, rightspeed, direction;
        if ((angle > 0) && (angle <= 90)) {
          leftspeed = 100;
          rightspeed = (90-angle) / 90*100

        } else if ((angle > 90) && (angle <= 180)) {
          leftspeed = 100;
          rightspeed = (angle - 90) / 90*100
        } else if ((angle < -90) && (angle >= -180)) {
          rightspeed = 100
          leftspeed = ((angle * -1) - 90) / 90 * 100

        } else /* angle between -90 and 0)*/  {
          rightspeed = 100
          leftspeed = (90-(angle * -1)  / 90 * 100
        }

        if (y > 0)
          direction = 1;
        else 
          direction = -1;

          let z = rightspeed * scale * direction;
          let w = leftspeed * scale * direction;

          console.log(`left ${w}, right ${z}`);

        this.setState({leftMotor: w + 100, rightMotor : z +100 });

        break;
      default:
      // no op
    }

  }

  /** Option callback invoked whenever a controller button is pressed or released */
  onButton(button: string, pressed: boolean) {
    if (pressed) console.log(button);
  }

  /** Main render method */
  render() {
    return (
      <Panel>
        <Gamepad index={0}
          onConnect={this.connectHandler.bind(this)}
          onDisconnect={this.disconnectHandler.bind(this)}
          onAxis={this.onAxisValue.bind(this)}
          onButton={this.onButton.bind(this)} >
          <GamepadPreview />
        </Gamepad>
        {this.state.connected &&
          <PanelRow>
            <Gauge value={this.state.leftMotor} />
            <Gauge value={this.state.rightMotor} />
          </PanelRow>}
      </Panel>
    );
  }
}

export default App;
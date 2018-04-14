import { observable, ObservableMap, computed } from 'mobx';

export default class GpioStore {
    axis: ObservableMap<string, { x: number, y: number }> = observable.map({}, { deep: false });
    button: ObservableMap<string, boolean> = observable.map({}, { deep: false });

    @observable connected: boolean = false;

    constructor() {

        this.connectHandler = this.connectHandler.bind(this);
        this.disconnectHandler = this.disconnectHandler.bind(this);
        this.onAxisValue = this.onAxisValue.bind(this);
        this.onButton = this.onButton.bind(this);

    }

    connectHandler(gamepad: { index: number, id: string }) {
        this.connected = true;
    }

    disconnectHandler(gamepad: { index: number, id: string }) {
        this.connected = false;
    }

    onAxisValue(axisName: string, dimension: string, value: number, previousValue: number) {
        if (!this.axis.has(axisName)) {
            let val = { x: (dimension == "x") ? value : 0, y: (dimension == "y") ? value : 0 };
            this.axis.set(axisName, val);
        } else {
            let val = this.axis.get(axisName);
            val = { x: (dimension == "x") ? value : val.x, y: (dimension == "y") ? value : val.y };
            this.axis.set(axisName, val);
        }
    }

    onButton(button: string, pressed: boolean) {
            this.button.set(button, pressed);
    }
}
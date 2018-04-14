import * as React from 'react'
import { Gauge as GaugeJS } from 'gaugeJS'

export class Gauge extends React.Component<{ value: number }> {
  private updateAnimationBound: () => void;
  private canvasDidMountBound: (canvas: HTMLCanvasElement) => void;
  private gauge;
  private reverse: boolean = false;

  constructor(props) {
    super(props);
    this.canvasDidMountBound = this.canvasDidMount.bind(this);
    this.updateAnimationBound = this.updateAnimation.bind(this);
  }

  componentDidMount() {
    window.requestAnimationFrame(this.updateAnimationBound);
  }

  componentDidUpdate() {
    window.requestAnimationFrame(this.updateAnimationBound);
  }

  canvasDidMount(canvas: HTMLCanvasElement) {

    if (!canvas) return;

    const opts = {
      angle: 0.15,
      lineWidth: 0.44,
      renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: "#333333",
        subDivisions: 5,
        subLength: 0.5,
        subWidth: 0.6,
        subColor: "#666666"
      },
      pointer: {
        length: 0.9,
        strokeWidth: 0.035
      },
      colorStart: '#6FADCF',
      colorStop: '#8FC0DA',
      strokeColor: '#E0E0E0'
    }

    this.gauge = new GaugeJS(canvas).setOptions(opts);
  }

  updateAnimation() {

    let newreverse: boolean = false;

    if (this.props.value < 0)
      newreverse = true;

    if (newreverse !== this.reverse) {

      const opts = {
        colorStart: this.props.value >= 0 ? '#6FADCF' : '#FB9692',
        colorStop: this.props.value >= 0 ? '#8FC0DA' : '#FFA6A2',
        strokeColor: '#E0E0E0'
      }

      this.gauge.setOptions(opts);
      this.reverse = newreverse;
    }

    this.gauge.set(Math.abs(this.props.value));
  }

  render() {
    return (
      <canvas ref={this.canvasDidMountBound}></canvas>
    )
  }
}

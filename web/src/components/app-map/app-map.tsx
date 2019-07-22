import { Component, Element, Prop, State, h } from '@stencil/core';
import { drawCanvas } from './canvas-util';

import data from './map.json';

interface hover {
  x: number;
  y: number;
  data: string;
  visible: boolean;
}

@Component({
  tag: 'app-map',
  styleUrl: 'app-map.css',
  shadow: false
})
export class AppMap {
  @Element() el: HTMLElement;
  @Prop() handleHover: Function;
  @State() width: number;
  @State() transform: DOMMatrix2DInit;

  hover: hover;
  debounce: number;

  constructor() {
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    this.hover = {
      x: 0,
      y: 0,
      data: '',
      visible: false
    }
  }

  componentDidLoad() {
    this.calcWidth();
    this.attachListeners();
  }

  componentDidRender() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.renderCanvas(), 50);
  }

  attachListeners() {
    window.onresize = () => {
      this.calcWidth();
    };

    const canvas = this.el.querySelector('.map-canvas') as HTMLCanvasElement;

    canvas.onmousemove = this.canvasHover;
    canvas.onmouseleave = () => {
      this.hover = {
        x: 0,
        y: 0,
        data: '',
        visible: false
      }

      this.handleHover(this.hover);
    }
  }

  changeScale = (factor: number) => {
    const height = this.width * data.length / data[0].length;
    if (factor < 1 && this.transform.a !== 1) {
      const newScale = Math.max(1, this.transform.a * factor);
      this.transform = { ...this.transform, a: newScale, d: newScale, e: 0 + -(newScale - 1) * (this.width + 0 * 2) / 2, f: -(newScale - 1) * height / 2 };
    } else if (factor > 1 && this.transform.a !== 5) {
      const newScale = Math.min(5, this.transform.a * factor);
      this.transform = { ...this.transform, a: newScale, d: newScale, e: 0 + -(newScale - 1) * (this.width + 0 * 2) / 2, f: -(newScale - 1) * height / 2 };
    }
  }

  canvasHover = (e) => {
    const canvas = this.el.querySelector('.map-canvas') as HTMLCanvasElement;
    const cell = canvas.width / data[0].length;
    const size = cell * .85;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.transform.a;
    const y = (e.clientY - rect.top) / this.transform.a;
    let hover: hover;

    data.forEach((t, i) => t.forEach((l, j) => {
      if (y > i * cell && y < i * cell + size && x > j * cell && x < j * cell + size) {
        if (l) {
          hover = {
            x: rect.left + (j * cell + size / 2) * this.transform.a,
            y: rect.top + i * cell * this.transform.a,
            data: l,
            visible: true
          }
        }
      }
    }));

    if (!hover) {
      hover = {
        x: 0,
        y: 0,
        data: '',
        visible: false
      }
    }

    if (hover.data !== this.hover.data) {
      this.hover = hover;
      this.handleHover(this.hover);
    }
  }

  renderCanvas() {
    const c = this.el.querySelector('.map-canvas') as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    const cell = c.width / data[0].length;
    ctx.setTransform(this.transform)

    drawCanvas(ctx, data, cell);
  }

  calcWidth() {
    this.width = this.el.querySelector('.app-map').clientWidth;
  }

  render() {
    return (
      <div class="app-map">
        <canvas class="map-canvas" width={this.width} height={this.width / data[0].length * data.length}/>
        <div class="map-zoom">
          <div onClick={() => this.changeScale(4/3)}>
            +
          </div>
          <div onClick={() => this.changeScale(3/4)}>
            -
          </div>
        </div>
      </div>
    )
  }
}

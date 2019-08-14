import { Component, Element, Prop, State, h } from '@stencil/core';
import { drawCanvas } from './canvas-util';

import { Hover } from '../app-home/app-home';

interface dragState {
  dragging: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

@Component({
  tag: 'app-map',
  styleUrl: 'app-map.css',
  shadow: false
})
export class AppMap {
  @Element() el: HTMLElement;
  @Prop() handleHover: Function;
  @Prop() handleScale: Function;
  @Prop() data: any;
  @Prop() search: string;
  @Prop() min: number;
  @Prop() max: number;
  @State() highContrast: boolean;
  @State() width: number;
  @State() transform: DOMMatrix2DInit;

  dragState: dragState;
  hover: Hover;
  debounce: number;

  constructor() {
    this.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    this.highContrast = false;
    this.hover = {x: 0, y: 0, data: '', visible: false};
    this.dragState = {dragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0};
  }

  componentDidLoad() {
    this.calcWidth();
    this.attachListeners();
  }

  componentDidRender() {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.renderCanvas(), 50);

    if (this.search.length === 5) {
      this.searchHover();
    } else {
      this.hover = {x: 0, y: 0, data: '', visible: false};
      this.handleHover(this.hover);
    }
  }

  attachListeners = () => {
    window.onresize = () => {
      this.calcWidth();
    };

    const canvas = this.el.querySelector('.map-canvas') as HTMLCanvasElement;

    canvas.onmousemove = this.canvasHover;
    canvas.onmouseleave = this.endHover;
  }

  changeScale = (factor: number) => {
    const height = this.width * this.data.length / this.data[0].length;
    let newScale = 0;

    if (factor < 1 && this.transform.a !== 1) {
      newScale = Math.max(1, this.transform.a * factor);
    } else if (factor > 1 && this.transform.a !== 5) {
      newScale = Math.min(5, this.transform.a * factor);
    }

    if (newScale !== 0) {
      const newXCalc = this.transform.e * newScale / this.transform.a - (newScale - 1) * this.width / 2 + (this.transform.a - 1) * this.width / 2 * newScale / this.transform.a;
      const newYCalc = this.transform.f * newScale / this.transform.a - (newScale - 1) * height / 2 + (this.transform.a - 1) * height / 2 * newScale / this.transform.a;
      const newX = Math.min(Math.max(newXCalc, this.width - this.width * newScale), 0);
      const newY = Math.min(Math.max(newYCalc, height - height * newScale), 0);
      this.transform = { ...this.transform, a: newScale, d: newScale, e: newX, f: newY };
      this.handleScale(newScale);
    }
  }

  changeTranslation = (x: number, y: number) => {
    const height = this.width * this.data.length / this.data[0].length;
    const newX = Math.min(Math.max(this.transform.e + x, this.width - this.width * this.transform.a),0);
    const newY = Math.min(Math.max(this.transform.f + y, height - height * this.transform.a), 0);
    if (this.transform.e !== newX || this.transform.f !== newY) {
      this.transform = { ...this.transform, e: newX, f: newY };
    }
  }

  canvasHover = (e: MouseEvent) => {
    const canvas = this.el.querySelector('.map-canvas') as HTMLCanvasElement;
    const cell = canvas.width / window.devicePixelRatio / this.data[0].length;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.transform.e / window.devicePixelRatio) / this.transform.a;
    const y = (e.clientY - rect.top - this.transform.f / window.devicePixelRatio) / this.transform.a;
    let hover: Hover;

    this.data.forEach((t, i) => t.forEach((l, j) => {
      if (y > i * cell && y < i * cell + cell && x > j * cell && x < j * cell + cell) {
        if (l.c) {
          hover = {
            x: rect.left + window.scrollX + this.transform.e / window.devicePixelRatio + (j * cell + cell / 2) * this.transform.a,
            y: rect.top + window.scrollY + this.transform.f / window.devicePixelRatio + i * cell * this.transform.a,
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

    if (hover.data !== this.hover.data && this.search.length !== 5) {
      this.hover = hover;
      this.handleHover(this.hover);
    }
  }

  searchHover = () => {
    const canvas = this.el.querySelector('.map-canvas') as HTMLCanvasElement;
    const cell = canvas.width / window.devicePixelRatio / this.data[0].length;
    const rect = canvas.getBoundingClientRect();
    let hover: Hover;

    this.data.forEach((t, i) => t.forEach((l, j) => {
      if (l.z) {
        for (let zip of l.z) {
          if (('00000' + zip.toString()).slice(-5) === this.search) {
            hover = {
              x: rect.left + window.scrollX + this.transform.e / window.devicePixelRatio + (j * cell + cell / 2) * this.transform.a,
              y: rect.top + window.scrollY + this.transform.f / window.devicePixelRatio + i * cell * this.transform.a,
              data: l,
              visible: true
            }
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

  endHover = () => {
    if (this.search.length !== 5) {
      this.hover = {
        x: 0,
        y: 0,
        data: '',
        visible: false
      }
      this.handleHover(this.hover);
    }
  }

  renderCanvas = () => {
    const c = this.el.querySelector('.map-canvas') as HTMLCanvasElement;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    const cell = c.width / this.data[0].length;
    ctx.setTransform(this.transform);
    drawCanvas(ctx, this.data, this.transform, this.width, cell, this.search, this.min, this.max, this.highContrast);
  }

  calcWidth = () => {
    this.width = this.el.querySelector('.app-map').clientWidth * window.devicePixelRatio;
  }

  toggleMode = () => {
    this.highContrast = !this.highContrast;
  }

  render() {
    const adjustedWidth = this.width / window.devicePixelRatio;
    return (
      <div class="app-map">
        <canvas class="map-canvas"
          style={{ width: adjustedWidth + 'px', height: adjustedWidth / this.data[0].length * this.data.length + 'px' }}
          width={this.width}
          height={this.width / this.data[0].length * this.data.length}
        />
        <div class="toggle-mode" onClick={this.toggleMode}>
          <div class={`modeColor ${this.highContrast ? 'default' : 'highContrast'}`}>

          </div>
          <div class="modeLabel">
            {this.highContrast ? 'Default' : 'High Contrast'}
          </div>
        </div>
        <div class="map-controls">
          <div class="map-move">
            <div class="move up" onClick={() => this.changeTranslation(0, this.width / 5)}><app-icon icon="caret-up" /></div>
            <div class="move down" onClick={() => this.changeTranslation(0, -this.width / 5)}><app-icon icon="caret-up" /></div>
            <div class="move left" onClick={() => this.changeTranslation(this.width / 5, 0)}><app-icon icon="caret-up" /></div>
            <div class="move right" onClick={() => this.changeTranslation(-this.width / 5, 0)}><app-icon icon="caret-up" /></div>
          </div>
          <div class="map-zoom">
            <div onClick={() => this.changeScale(4 / 3)}><app-icon icon="plus" /></div>
            <div onClick={() => this.changeScale(3 / 4)}><app-icon icon="minus" /></div>
          </div>
        </div>
      </div>
    )
  }
}

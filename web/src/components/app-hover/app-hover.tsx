import { Component, Element, Prop, h } from '@stencil/core';

import { Hover } from '../app-home/app-home';

const monthDay = {
  j: 31,
  f: 28,
  m: 31,
  a: 30,
  y: 31,
  u: 30,
  l: 31,
  g: 31,
  s: 30,
  o: 31,
  n: 30,
  d: 31
}

const monthLetter = {
  j: 'J',
  f: 'F',
  m: 'M',
  a: 'A',
  y: 'M',
  u: 'J',
  l: 'J',
  g: 'A',
  s: 'S',
  o: 'O',
  n: 'N',
  d: 'D'
}

@Component({
  tag: 'app-hover',
  styleUrl: 'app-hover.css',
  shadow: false
})
export class AppHover {
  @Element() el: HTMLElement;
  @Prop() state: Hover;

  render() {
    const w = this.state.data && this.state.data.w ? this.state.data.w : {};
    return this.state.visible ? (
      <div class="app-hover" style={{ left: Math.min(Math.max(this.state.x, 272 / 2), document.documentElement.clientWidth - 272 / 2) + 'px', top: this.state.y + 'px', '--before-offset': `calc(50% + ${this.state.x - Math.min(Math.max(this.state.x, 272 / 2), document.documentElement.clientWidth - 272 / 2)}px)` }}>
        {this.state.data.c}, {this.state.data.s} {Object.keys(w).map(m => w[m].g - w[m].b).reduce((a,b) => a+b)}
        <div class="hover-charts">
          {Object.keys(w).map(m => (
            <div class="hover-chart">
              <div class="hover-chart-bar">
                <div style={{ height: w[m].b / monthDay[m] * 100 + '%', background: '#ff5252' }}></div>
                <div style={{ height: w[m].g / monthDay[m] * 100 + '%', background: '#69f0ae' }}></div>
              </div>
              <span>{monthLetter[m]}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
}

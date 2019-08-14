import { Component, Element, Prop, h } from '@stencil/core';

import { Hover } from '../app-home/app-home';

const monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const monthLetter = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

@Component({
  tag: 'app-hover',
  styleUrl: 'app-hover.css',
  shadow: false
})
export class AppHover {
  @Element() el: HTMLElement;
  @Prop() state: Hover;
  @Prop() cell: number;
  @Prop() mapScale: number;

  render() {
    const w = this.state.data && this.state.data.w && this.state.data.w.m ? this.state.data.w.m : [];
    const offset = Math.min(Math.max(this.state.x, 272 / 2) + 5, document.documentElement.clientWidth - 272 / 2 - 5);
    return this.state.visible ? (
      <div class={`app-hover ${this.state.y - 130 < window.pageYOffset ? 'flip' : ''}`} style={{ left: offset + 'px', top: this.state.y + 'px', '--before-offset': `calc(50% + ${this.state.x - offset}px)`, '--cell-size': `${this.cell * this.mapScale + 7}px` }}>
        {this.state.data.c}, {this.state.data.s} {w.reduce((a, b, i) => i % 2 === 0 ? a + b : a - b, 0)}
        <div class="hover-charts">
          {w.map((m,i) => i%2 === 0 ? (
            <div class="hover-chart">
              <div class="hover-chart-bar">
                <div style={{ height: w[i+1] / monthDay[i/2] * 100 + '%', background: '#ff5252' }}></div>
                <div style={{ height: m / monthDay[i/2] * 100 + '%', background: '#69f0ae' }}></div>
              </div>
              <span>{monthLetter[i/2]}</span>
            </div>
          ) : null)}
        </div>
      </div>
    ) : null;
  }
}

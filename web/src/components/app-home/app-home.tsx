import { Component, State, h } from '@stencil/core';

export interface Hover {
  x: number;
  y: number;
  data: string;
  visible: boolean;
}

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false
})
export class AppHome {
  @State() hover: Hover;

  constructor() {
    this.hover = {
      x: 0,
      y: 0,
      data: '',
      visible: false
    }
  }

  updateHover = (hover: Hover) => {
    this.hover = hover;
  }

  render() {
    return (
      <div class='app-home'>
        <header>
          <h1>🌎 Where to Live</h1>
        </header>
        <div class='map-holder'>
          <app-map handleHover={this.updateHover} />
        </div>
        <app-hover state={this.hover}/>
      </div>
    );
  }
}

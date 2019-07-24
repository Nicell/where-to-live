import { Component, State, h } from '@stencil/core';

export interface Hover {
  x: number;
  y: number;
  data: any;
  visible: boolean;
}

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false
})
export class AppHome {
  @State() hover: Hover;
  @State() data: any;

  constructor() {
    this.hover = {
      x: 0,
      y: 0,
      data: '',
      visible: false
    }
    this.getData();
  }

  getData = async () => {
    this.data = await (await fetch('/assets/map.json')).json();
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
        {this.data ? (
          <div class='map-holder'>
            <app-map data={this.data} handleHover={this.updateHover} />
          </div>
        ) : null}
        <app-hover state={this.hover}/>
      </div>
    );
  }
}

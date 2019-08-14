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
  @State() search: string;
  @State() data: any;
  @State() zips: any;

  constructor() {
    this.hover = {
      x: 0,
      y: 0,
      data: {},
      visible: false
    }
    this.search = '';
    this.getData();
    this.getZips();
  }

  getData = async () => {
    this.data = await (await fetch('assets/map.json')).json();
  }

  getZips = async () => {
    this.zips = await (await fetch('assets/zip.json')).json();
  }

  updateHover = (hover: Hover) => {
    this.hover = hover;
  }

  updateSearch = (query: string) => {
    this.search = query;
  }

  getRank(location) {
    const w = location.w && location.w.m ? location.w.m : [];
    return w.reduce((a, b, i) => i % 2 === 0 ? a + b : a - b, 0);
  }

  render() {
    const top = this.data ? this.data.t[0] : [0, 0];
    const bottom = this.data ? this.data.b[0] : [0, 0];
    const max = this.data ? this.getRank(this.data.m[top[1]][top[0]]) : 0;
    const min = this.data ? this.getRank(this.data.m[bottom[1]][bottom[0]]) : 0;
    return (
      <div class="app-home">
        <header>
          <h1>🌎 Where to Live</h1>
          <a href="https://github.com/Nicell/where-to-live" target="_blank" rel="noreferrer">GitHub</a>
        </header>
        {this.data && this.zips ? (
          <div>
            <div class="map-holder">
              <app-map data={this.data.m} handleHover={this.updateHover} search={this.search} min={min} max={max} />
            </div>
            <app-hover state={this.hover} />
            <app-search zips={this.zips} value={this.search} handleChange={this.updateSearch} />
            <app-ranks top={this.data.t} bottom={this.data.b} data={this.data.m} />
          </div>
        ) : null}
      </div>
    );
  }
}

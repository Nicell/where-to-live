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
    this.data = await (await fetch('/assets/map.json')).json();
  }

  getZips = async () => {
    this.zips = await (await fetch('/assets/zip.json')).json();
  }

  updateHover = (hover: Hover) => {
    this.hover = hover;
  }

  updateSearch = (query: string) => {
    this.search = query;
  }

  render() {
    return (
      <div class="app-home">
        <header>
          <h1>🌎 Where to Live</h1>
        </header>
        {this.data && this.zips ? (
          <div>
            <div class="map-holder">
              <app-map data={this.data.m} handleHover={this.updateHover} search={this.search} />
            </div>
            <app-hover state={this.hover} />
            <app-search zips={this.zips} handleHover={this.updateHover} value={this.search} handleChange={this.updateSearch} />
          </div>
        ) : null}
      </div>
    );
  }
}

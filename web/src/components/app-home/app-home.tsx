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
  @State() searchIndex: any;
  @State() mapScale: number;

  constructor() {
    this.hover = {
      x: 0,
      y: 0,
      data: {},
      visible: false
    }
    this.search = '';
    this.mapScale = 1;
    this.getData();
    this.getSearchIndex();
  }

  getData = async () => {
    this.data = await (await fetch('assets/map.json')).json();
  }

  getSearchIndex = async () => {
    this.searchIndex = await (await fetch('assets/search.json')).json();
  }

  updateHover = (hover: Hover) => {
    this.hover = hover;
  }

  updateSearch = (query: string) => {
    this.search = query;
  }

  updateMapScale = (newScale: number) => {
    this.mapScale = newScale;
  }

  render() {
    const cell = this.data ? window.innerWidth / window.devicePixelRatio / this.data.m[0].length : 0;

    return (
      <div class="app-home">
        <header>
          <h1><app-icon icon="sun" /> Where to Live</h1>
          <a href="https://github.com/Nicell/where-to-live" target="_blank" rel="noreferrer"><app-icon icon={{ prefix: 'fab', iconName: 'github' }}/></a>
        </header>
        {this.data && this.searchIndex ? (
          <div>
            <div class="map-holder">
              <app-map data={this.data.m} handleHover={this.updateHover} handleScale={this.updateMapScale} search={this.search} />
            </div>
            <app-hover state={this.hover} cell={cell} mapScale={this.mapScale} />
            <app-search searchIndex={this.searchIndex} handleChange={this.updateSearch} />
            <app-ranks top={this.data.t} bottom={this.data.b} data={this.data.m} />
          </div>
        ) : (
          <div class="loading">
            <app-icon class="loader" icon="sun" />
            <span>Loading Weather Data</span>
          </div>
        )}
      </div>
    );
  }
}

import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'app-search',
  styleUrl: 'app-search.css',
  shadow: false
})
export class AppSearch {
  @Prop() zips: any;
  @Prop() handleChange: Function;
  @State() results: any[];

  @State() value: string;

  constructor() {
    this.value = '';
    this.results = [];
  }

  changeValue = (e: UIEvent) => {
    const value = (e.target as HTMLInputElement).value;

    this.evalChange(value);
  }

  evalChange = (value: string) => {
    this.value = value;

    if (isNaN(parseInt(value))) {
      this.handleChange('');
      this.searchByName(value);
    } else {
      this.handleChange(value);
      this.searchByZip(value);
    }
  }

  searchByName = (value: string) => {
    if (value.length > 2) {
      let results = []

      for (let i = 0; i < this.zips.length; i++) {
        if (results.length === 10) {
          break;
        }

        if (this.zips[i].toLowerCase().indexOf(value.toLowerCase()) > -1) {
          results.push({ zip: ('00000' + i).slice(-5), name: this.zips[i]})
        }
      }

      this.results = results;
    } else {
      this.results = [];
    }
  }

  searchByZip = (value: string) => {
    if (value.length > 1 && value.length < 5) {
      let results = [];
      let val = parseInt(value);
      let endVal = val + 1;
      let factor = Math.pow(10, 5 - value.length);

      let start = val * factor;
      let end = endVal * factor;

      for (let i = start; i < end; i++) {
        if (results.length === 10) {
          break;
        }

        if (this.zips[i].length > 0) {
          results.push({ zip: ('00000' + i).slice(-5), name: this.zips[i]});
        }
      }

      this.results = results;
    } else {
      this.results = [];
    }
  }

  render() {
    return (
      <div class="searchWrap">
        <div class="searchHold">
          <div class={this.results.length > 0 ? 'results' : ''}>
            {this.results.length > 0 ?
              this.results.map(zip => (
                <div onClick={() => this.evalChange(zip.zip)}>
                  <span>{zip.zip}</span>
                  <span>{zip.name}</span>
                </div>
              )
            ) : null}
          </div>
          <div class="searchBox">
            <input class="search" value={this.value} onInput={(event: UIEvent) => this.changeValue(event)} placeholder="Search"/>
            <div onClick={() => this.evalChange('')}><app-icon icon="times-circle" /></div>
          </div>
        </div>
      </div>
    )
  }
}

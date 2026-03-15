import { Component, Prop, State, h } from '@stencil/core';

export interface SearchLocation {
  z: string;
  n: string;
  p: number;
  c: number;
}

interface SearchResult extends SearchLocation {
  count: number;
}

@Component({
  tag: 'app-search',
  styleUrl: 'app-search.css',
  shadow: false
})
export class AppSearch {
  @Prop() searchIndex: SearchLocation[];
  @Prop() handleChange: Function;
  @State() results: SearchResult[];

  @State() value: string;

  constructor() {
    this.value = '';
    this.results = [];
  }

  groupNameResults = (locations: SearchLocation[]) => {
    const grouped = new Map<string, SearchResult>();

    for (const location of locations) {
      const existing = grouped.get(location.n);

      if (!existing) {
        grouped.set(location.n, { ...location, count: 1 });
        continue;
      }

      existing.count += 1;

      if (location.p > existing.p || (location.p === existing.p && location.z < existing.z)) {
        existing.z = location.z;
        existing.p = location.p;
      }
    }

    return Array.from(grouped.values());
  }

  nameMatchRank = (name: string, query: string) => {
    const city = name.toLowerCase().split(',')[0];

    if (city === query) {
      return 0;
    }

    if (city.startsWith(query + ' ')) {
      return 1;
    }

    if (city.startsWith(query)) {
      return 2;
    }

    if (city.indexOf(' ' + query) > -1) {
      return 3;
    }

    return 4;
  }

  sortNameResults = (query: string, a: SearchLocation, b: SearchLocation) => {
    const matchRank = this.nameMatchRank(a.n, query) - this.nameMatchRank(b.n, query);
    if (matchRank !== 0) {
      return matchRank;
    }

    if (a.c !== b.c) {
      return b.c - a.c;
    }

    if (a.p !== b.p) {
      return b.p - a.p;
    }

    return a.z.localeCompare(b.z);
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
      const query = value.toLowerCase();

      this.results = this.groupNameResults(
        this.searchIndex.filter(location => location.n.toLowerCase().indexOf(query) > -1)
      )
        .sort((a, b) => this.sortNameResults(query, a, b))
        .slice(0, 10);
    } else {
      this.results = [];
    }
  }

  searchByZip = (value: string) => {
    if (value.length > 1 && value.length < 5) {
      this.results = this.searchIndex
        .filter(location => location.z.indexOf(value) === 0)
        .map(location => ({ ...location, count: 1 }))
        .slice(0, 10);
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
                <div onClick={() => this.evalChange(zip.z)}>
                  <span>{zip.count > 1 ? `${zip.z} +${zip.count - 1}` : zip.z}</span>
                  <span>{zip.n.split(' ').slice(0, -1).map(s => s.charAt(0) + s.toLowerCase().substring(1)).join(' ')} {zip.n.split(' ').slice(-1)}</span>
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

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-search',
  styleUrl: 'app-search.css',
  shadow: false
})
export class AppSearch {
  @Prop() zips: any;
  @Prop() handleHover: Function;
  @Prop() value: string;
  @Prop() handleChange: Function;

  constructor() {
    
  }

  changeValue = (e: UIEvent) => {
    const value = (e.target as HTMLInputElement).value;

    if (isNaN(parseInt(value))) {
      this.handleChange('');
    } else {
      this.handleChange(value);
    }
  }

  render() {
    return (
      <input value={this.value} onInput={(event: UIEvent) => this.changeValue(event)} placeholder="Search"/>
    )
  }
}

import { Component, Element, Prop, h } from '@stencil/core';

import { Hover } from '../app-home/app-home';

@Component({
  tag: 'app-hover',
  styleUrl: 'app-hover.css',
  shadow: false
})
export class AppHover {
  @Element() el: HTMLElement;
  @Prop() state: Hover;

  render() {
    return this.state.visible ? (
      <div class='app-hover' style={{left: this.state.x + 'px', top: this.state.y + 'px'}}>
        {this.state.data}
      </div>
    ) : null;
  }
}

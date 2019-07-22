import { Component, Element, Prop, h } from '@stencil/core';

interface hover {
  x: number;
  y: number;
  data: string;
  visible: boolean;
}

@Component({
  tag: 'app-hover',
  styleUrl: 'app-hover.css',
  shadow: false
})
export class AppHover {
  @Element() el: HTMLElement;
  @Prop() state: hover;

  render() {
    return this.state.visible ? (
      <div class='app-hover' style={{left: this.state.x + 'px', top: this.state.y + 'px'}}>
        {this.state.data}
      </div>
    ) : null;
  }
}

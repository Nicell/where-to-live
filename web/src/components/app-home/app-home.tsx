import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: false
})
export class AppHome {
  render() {
    return (
      <div class='app-home'>
        <header>
          <h1>🌎 Where to Live</h1>
        </header>
        <app-map/>
      </div>
    );
  }
}

import { Component, Element, h } from '@stencil/core';

import data from './map.json';

interface styles { [key: string]: string; }

@Component({
  tag: 'app-map',
  styleUrl: 'app-map.css',
  shadow: false
})
export class AppMap {
  @Element() el: HTMLElement;

  componentDidRender() {
    this.setHtWd()
    window.addEventListener('resize', () => this.setHtWd());
  }

  constructStyles(i, j): styles {
    const styles: styles = {
      height: 'var(--elSize)',
      width: 'var(--elSize)',
      borderTopLeftRadius: '2px',
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px',
      borderBottomLeftRadius: '2px',
      opacity: (Math.random() + .25).toString()
    };

    const bottom = (i === 0 ? '' : data[i - 1][j]).length > 0;
    const top = (i === 49 ? '' : data[i + 1][j]).length > 0;
    const right = (j === 0 ? '' : data[i][j - 1]).length > 0;
    const left = (j === 115 ? '' : data[i][j + 1]).length > 0;

    if (!top && !left) {
      styles.borderTopLeftRadius = '50%';
    }

    if (!top && !right) {
      styles.borderTopRightRadius = '50%';
    }

    if (!bottom && !right) {
      styles.borderBottomRightRadius = '50%';
    }

    if (!bottom && !left) {
      styles.borderBottomLeftRadius = '50%';
    }

    return styles;
  }

  setHtWd() {
    const elSize = Math.floor(window.innerWidth / 116) - 1 + 'px';
    this.el.style.setProperty('--elSize', elSize);
  }

  render() {
    return (
      <div class="app-map">
        {data.map((t, i) => (
          <div class="MapRow">
            {t.map((l, j) => (
              <span key={l} style={this.constructStyles(i, j)} class={l + l ? 'active' : ''} />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

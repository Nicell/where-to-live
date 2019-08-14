import { Component, Prop, h } from '@stencil/core';
import { library, config, icon, IconLookup, IconName } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp, faPlus, faMinus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(faCaretUp, faPlus, faMinus, faTimesCircle, faGithub);

config.autoAddCss = false;

@Component({
  tag: 'app-icon',
  styleUrl: 'app-icon.css',
  shadow: false
})
export class AppIcon {
  @Prop() icon: IconLookup | IconName;
  @Prop() class?: string;

  render() {
    let iconProp: IconLookup = typeof this.icon === 'object' ? this.icon : { prefix: 'fas', iconName: this.icon };

    const iconObj = icon(iconProp);

    if (!iconObj) {
      console.error(`Icon not found! Icon: ${typeof this.icon === 'object' ? `${this.icon.prefix}.${this.icon.iconName}` : `fas.${this.icon}`}`);
      return;
    }

    const iconSVG = iconObj.html[0];

    return (
      <span
        class={`app-icon ${this.class}`}
        ref={(el: HTMLDivElement) => el.innerHTML = iconSVG}
      />
    );
  }
}


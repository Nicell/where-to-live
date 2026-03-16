import { createMemo } from 'solid-js';

import './app-icon.css';

import { config, icon, library, type IconLookup, type IconName } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faCaretUp,
  faCog,
  faExclamationCircle,
  faMinus,
  faPlus,
  faSun,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

library.add(faCaretUp, faCog, faPlus, faMinus, faTimesCircle, faGithub, faExclamationCircle, faSun);

config.autoAddCss = false;

interface AppIconProps {
  icon: IconLookup | IconName;
  class?: string;
}

export default function AppIcon(props: AppIconProps) {
  const markup = createMemo(() => {
    const iconProp: IconLookup =
      typeof props.icon === 'object' ? props.icon : { prefix: 'fas', iconName: props.icon };
    const iconObj = icon(iconProp);

    if (!iconObj) {
      console.error(
        `Icon not found! Icon: ${
          typeof props.icon === 'object'
            ? `${props.icon.prefix}.${props.icon.iconName}`
            : `fas.${props.icon}`
        }`
      );
      return '';
    }

    return iconObj.html[0];
  });

  return <span class={`app-icon ${props.class ?? ''}`.trim()} innerHTML={markup()} />;
}

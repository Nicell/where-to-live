/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Hover,
} from './components/app-home/app-home';
import {
  IconLookup,
  IconName,
} from '@fortawesome/fontawesome-svg-core';

export namespace Components {
  interface AppHome {}
  interface AppHover {
    'cell': number;
    'mapScale': number;
    'state': Hover;
  }
  interface AppIcon {
    'class'?: string;
    'icon': IconLookup | IconName;
  }
  interface AppMap {
    'data': any;
    'handleHover': Function;
    'handleScale': Function;
    'max': number;
    'min': number;
    'search': string;
  }
  interface AppRanks {
    'bottom': any;
    'data': any;
    'top': any;
  }
  interface AppSearch {
    'handleChange': Function;
    'zips': any;
  }
  interface AppUpdate {}
}

declare global {


  interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {}
  var HTMLAppHomeElement: {
    prototype: HTMLAppHomeElement;
    new (): HTMLAppHomeElement;
  };

  interface HTMLAppHoverElement extends Components.AppHover, HTMLStencilElement {}
  var HTMLAppHoverElement: {
    prototype: HTMLAppHoverElement;
    new (): HTMLAppHoverElement;
  };

  interface HTMLAppIconElement extends Components.AppIcon, HTMLStencilElement {}
  var HTMLAppIconElement: {
    prototype: HTMLAppIconElement;
    new (): HTMLAppIconElement;
  };

  interface HTMLAppMapElement extends Components.AppMap, HTMLStencilElement {}
  var HTMLAppMapElement: {
    prototype: HTMLAppMapElement;
    new (): HTMLAppMapElement;
  };

  interface HTMLAppRanksElement extends Components.AppRanks, HTMLStencilElement {}
  var HTMLAppRanksElement: {
    prototype: HTMLAppRanksElement;
    new (): HTMLAppRanksElement;
  };

  interface HTMLAppSearchElement extends Components.AppSearch, HTMLStencilElement {}
  var HTMLAppSearchElement: {
    prototype: HTMLAppSearchElement;
    new (): HTMLAppSearchElement;
  };

  interface HTMLAppUpdateElement extends Components.AppUpdate, HTMLStencilElement {}
  var HTMLAppUpdateElement: {
    prototype: HTMLAppUpdateElement;
    new (): HTMLAppUpdateElement;
  };
  interface HTMLElementTagNameMap {
    'app-home': HTMLAppHomeElement;
    'app-hover': HTMLAppHoverElement;
    'app-icon': HTMLAppIconElement;
    'app-map': HTMLAppMapElement;
    'app-ranks': HTMLAppRanksElement;
    'app-search': HTMLAppSearchElement;
    'app-update': HTMLAppUpdateElement;
  }
}

declare namespace LocalJSX {
  interface AppHome extends JSXBase.HTMLAttributes<HTMLAppHomeElement> {}
  interface AppHover extends JSXBase.HTMLAttributes<HTMLAppHoverElement> {
    'cell'?: number;
    'mapScale'?: number;
    'state'?: Hover;
  }
  interface AppIcon extends JSXBase.HTMLAttributes<HTMLAppIconElement> {
    'class'?: string;
    'icon'?: IconLookup | IconName;
  }
  interface AppMap extends JSXBase.HTMLAttributes<HTMLAppMapElement> {
    'data'?: any;
    'handleHover'?: Function;
    'handleScale'?: Function;
    'max'?: number;
    'min'?: number;
    'search'?: string;
  }
  interface AppRanks extends JSXBase.HTMLAttributes<HTMLAppRanksElement> {
    'bottom'?: any;
    'data'?: any;
    'top'?: any;
  }
  interface AppSearch extends JSXBase.HTMLAttributes<HTMLAppSearchElement> {
    'handleChange'?: Function;
    'zips'?: any;
  }
  interface AppUpdate extends JSXBase.HTMLAttributes<HTMLAppUpdateElement> {}

  interface IntrinsicElements {
    'app-home': AppHome;
    'app-hover': AppHover;
    'app-icon': AppIcon;
    'app-map': AppMap;
    'app-ranks': AppRanks;
    'app-search': AppSearch;
    'app-update': AppUpdate;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}



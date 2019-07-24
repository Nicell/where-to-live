/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Hover,
} from './components/app-home/app-home';

export namespace Components {
  interface AppHome {}
  interface AppHover {
    'state': Hover;
  }
  interface AppMap {
    'data': any;
    'handleHover': Function;
  }
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

  interface HTMLAppMapElement extends Components.AppMap, HTMLStencilElement {}
  var HTMLAppMapElement: {
    prototype: HTMLAppMapElement;
    new (): HTMLAppMapElement;
  };
  interface HTMLElementTagNameMap {
    'app-home': HTMLAppHomeElement;
    'app-hover': HTMLAppHoverElement;
    'app-map': HTMLAppMapElement;
  }
}

declare namespace LocalJSX {
  interface AppHome extends JSXBase.HTMLAttributes<HTMLAppHomeElement> {}
  interface AppHover extends JSXBase.HTMLAttributes<HTMLAppHoverElement> {
    'state'?: Hover;
  }
  interface AppMap extends JSXBase.HTMLAttributes<HTMLAppMapElement> {
    'data'?: any;
    'handleHover'?: Function;
  }

  interface IntrinsicElements {
    'app-home': AppHome;
    'app-hover': AppHover;
    'app-map': AppMap;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}



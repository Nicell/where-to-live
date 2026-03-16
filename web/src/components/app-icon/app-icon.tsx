import './app-icon.css';
import caretUp from '@phosphor-icons/core/assets/bold/caret-up-bold.svg?raw';
import gear from '@phosphor-icons/core/assets/bold/gear-bold.svg?raw';
import github from '@phosphor-icons/core/assets/bold/github-logo-bold.svg?raw';
import minus from '@phosphor-icons/core/assets/bold/minus-bold.svg?raw';
import plus from '@phosphor-icons/core/assets/bold/plus-bold.svg?raw';
import sun from '@phosphor-icons/core/assets/bold/sun-bold.svg?raw';
import warningCircle from '@phosphor-icons/core/assets/bold/warning-circle-bold.svg?raw';
import xCircle from '@phosphor-icons/core/assets/bold/x-circle-bold.svg?raw';

const iconMarkup = {
  'caret-up': caretUp,
  gear,
  github,
  minus,
  plus,
  sun,
  'warning-circle': warningCircle,
  'x-circle': xCircle
} as const;

export type AppIconName = keyof typeof iconMarkup;

interface AppIconProps {
  icon: AppIconName;
  class?: string;
}

export default function AppIcon(props: AppIconProps) {
  return <span class={`app-icon ${props.class ?? ''}`.trim()} aria-hidden="true" innerHTML={iconMarkup[props.icon]} />;
}

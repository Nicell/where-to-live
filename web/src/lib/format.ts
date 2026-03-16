import type { LocationCell } from './types';

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0) + segment.toLowerCase().slice(1))
    .join(' ');
}

export function formatCityState(location: LocationCell) {
  const city = location.c ? titleCase(location.c) : '';
  return [city, location.s].filter(Boolean).join(', ');
}

export function formatLocationLabel(location: LocationCell) {
  const label = formatCityState(location);
  return location.a ? `Near ${label}` : label;
}

export function formatSearchLabel(value: string) {
  const segments = value.split(' ');
  const city = titleCase(segments.slice(0, -1).join(' '));
  const state = segments.slice(-1).join(' ');
  return `${city} ${state}`.trim();
}

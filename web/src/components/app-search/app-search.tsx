import { For, Show, createMemo, createSignal } from 'solid-js';

import './app-search.css';

import { formatSearchLabel } from '../../lib/format';
import type { SearchLocation } from '../../lib/types';
import AppIcon from '../app-icon/app-icon';

interface SearchResult extends SearchLocation {
  count: number;
}

interface AppSearchProps {
  searchIndex: SearchLocation[];
  onChange: (query: string) => void;
}

function groupNameResults(locations: SearchLocation[]) {
  const grouped = new Map<string, SearchResult>();

  for (const location of locations) {
    const existing = grouped.get(location.n);

    if (!existing) {
      grouped.set(location.n, { ...location, count: 1 });
      continue;
    }

    existing.count += 1;

    if (location.p > existing.p || (location.p === existing.p && location.z < existing.z)) {
      existing.z = location.z;
      existing.p = location.p;
    }
  }

  return Array.from(grouped.values());
}

function nameMatchRank(name: string, query: string) {
  const city = name.toLowerCase().split(',')[0];

  if (city === query) {
    return 0;
  }

  if (city.startsWith(`${query} `)) {
    return 1;
  }

  if (city.startsWith(query)) {
    return 2;
  }

  if (city.includes(` ${query}`)) {
    return 3;
  }

  return 4;
}

function sortNameResults(query: string, a: SearchLocation, b: SearchLocation) {
  const matchRank = nameMatchRank(a.n, query) - nameMatchRank(b.n, query);
  if (matchRank !== 0) {
    return matchRank;
  }

  if (a.c !== b.c) {
    return b.c - a.c;
  }

  if (a.p !== b.p) {
    return b.p - a.p;
  }

  return a.z.localeCompare(b.z);
}

export default function AppSearch(props: AppSearchProps) {
  const [value, setValue] = createSignal('');

  const results = createMemo<SearchResult[]>(() => {
    const currentValue = value();

    if (Number.isNaN(parseInt(currentValue, 10))) {
      if (currentValue.length <= 2) {
        return [];
      }

      const query = currentValue.toLowerCase();
      return groupNameResults(
        props.searchIndex.filter((location) => location.n.toLowerCase().includes(query))
      )
        .sort((a, b) => sortNameResults(query, a, b))
        .slice(0, 10);
    }

    if (currentValue.length > 1 && currentValue.length < 5) {
      return props.searchIndex
        .filter((location) => location.z.startsWith(currentValue))
        .map((location) => ({ ...location, count: 1 }))
        .slice(0, 10);
    }

    return [];
  });

  const evalChange = (nextValue: string) => {
    setValue(nextValue);

    if (Number.isNaN(parseInt(nextValue, 10))) {
      props.onChange('');
      return;
    }

    props.onChange(nextValue);
  };

  return (
    <div class="searchWrap">
      <div class="searchHold">
        <div class="searchBox">
          <input
            class="search"
            value={value()}
            onInput={(event) => evalChange(event.currentTarget.value)}
            placeholder="Search ZIP code or city"
          />
          <button type="button" onClick={() => evalChange('')} aria-label="Clear search">
            <AppIcon icon="times-circle" />
          </button>
        </div>
        <Show when={results().length > 0}>
          <div class="results">
            <For each={results()}>
              {(result) => (
                <button type="button" onClick={() => evalChange(result.z)}>
                  <span>{result.count > 1 ? `${result.z} +${result.count - 1}` : result.z}</span>
                  <span>{formatSearchLabel(result.n)}</span>
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

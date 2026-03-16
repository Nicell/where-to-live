import { For, Show, createEffect, createMemo, createSignal } from 'solid-js';

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
  const [highlightedIndex, setHighlightedIndex] = createSignal(-1);

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

  createEffect(() => {
    const nextResults = results();
    const currentIndex = highlightedIndex();

    if (nextResults.length === 0) {
      if (currentIndex !== -1) {
        setHighlightedIndex(-1);
      }
      return;
    }

    if (currentIndex >= nextResults.length) {
      setHighlightedIndex(nextResults.length - 1);
    }
  });

  const evalChange = (nextValue: string) => {
    setValue(nextValue);
    setHighlightedIndex(-1);

    if (Number.isNaN(parseInt(nextValue, 10))) {
      props.onChange('');
      return;
    }

    props.onChange(nextValue);
  };

  const selectResult = (result: SearchResult) => {
    evalChange(result.z);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const nextResults = results();
    if (nextResults.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((currentIndex) =>
        currentIndex < nextResults.length - 1 ? currentIndex + 1 : nextResults.length - 1
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((currentIndex) => (currentIndex > 0 ? currentIndex - 1 : 0));
      return;
    }

    if (event.key === 'Enter') {
      const currentIndex = highlightedIndex();
      if (currentIndex < 0) {
        event.preventDefault();
        selectResult(nextResults[0]);
        return;
      }

      event.preventDefault();
      selectResult(nextResults[currentIndex]);
      return;
    }

    if (event.key === 'Escape') {
      setHighlightedIndex(-1);
    }
  };

  return (
    <div class="searchWrap">
      <div class="searchHold">
        <div class="searchBox">
          <input
            class="search"
            value={value()}
            onInput={(event) => evalChange(event.currentTarget.value)}
            onKeyDown={(event) => handleKeyDown(event)}
            placeholder="Search ZIP code or city"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results().length > 0}
            aria-activedescendant={
              highlightedIndex() >= 0 ? `search-result-${highlightedIndex()}` : undefined
            }
          />
          <button type="button" onClick={() => evalChange('')} aria-label="Clear search">
            <AppIcon icon="x-circle" />
          </button>
        </div>
        <Show when={results().length > 0}>
          <div class="results" role="listbox">
            <For each={results()}>
              {(result, index) => (
                <button
                  id={`search-result-${index()}`}
                  type="button"
                  role="option"
                  aria-selected={highlightedIndex() === index()}
                  classList={{ active: highlightedIndex() === index() }}
                  onMouseEnter={() => setHighlightedIndex(index())}
                  onClick={() => selectResult(result)}
                >
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

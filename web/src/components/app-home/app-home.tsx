import { Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import './app-home.css';

import type { HoverState, MapData, SearchLocation } from '../../lib/types';
import AppHover from '../app-hover/app-hover';
import AppIcon from '../app-icon/app-icon';
import AppMap from '../app-map/app-map';
import { defaultPaletteMode, type PaletteModeId } from '../app-map/canvas-util';
import AppRanks from '../app-ranks/app-ranks';
import AppSearch from '../app-search/app-search';

const emptyHover: HoverState = {
  x: 0,
  y: 0,
  data: null,
  visible: false
};

const mapDataUrl = `${import.meta.env.BASE_URL}assets/map.json`;
const searchDataUrl = `${import.meta.env.BASE_URL}assets/search.json`;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export default function AppHome() {
  const [hover, setHover] = createSignal<HoverState>(emptyHover);
  const [search, setSearch] = createSignal('');
  const [data, setData] = createSignal<MapData | null>(null);
  const [searchIndex, setSearchIndex] = createSignal<SearchLocation[] | null>(null);
  const [mapScale, setMapScale] = createSignal(1);
  const [mapWidth, setMapWidth] = createSignal(0);
  const [paletteMode, setPaletteMode] = createSignal<PaletteModeId>(defaultPaletteMode);
  const [detailsOpen, setDetailsOpen] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  const cell = createMemo(() => {
    const mapData = data();
    const currentMapWidth = mapWidth();
    if (!mapData || mapData.m.length === 0 || currentMapWidth === 0) {
      return 0;
    }

    return currentMapWidth / mapData.m[0].length;
  });

  const mapAspect = createMemo(() => {
    const mapData = data();
    if (!mapData || mapData.m.length === 0) {
      return 1.8;
    }

    return mapData.m[0].length / mapData.m.length;
  });

  onMount(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDetailsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    onCleanup(() => window.removeEventListener('resize', handleResize));

    void fetchJson<MapData>(mapDataUrl)
      .then((mapPayload) => {
        setData(mapPayload);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unable to load weather data.';
        setLoadError(message);
      });

    void fetchJson<SearchLocation[]>(searchDataUrl)
      .then((searchPayload) => {
        setSearchIndex(searchPayload);
      })
      .catch((error: unknown) => {
        console.error('Unable to load search index.', error);
      });
  });

  return (
    <div class="app-root">
      <Show
        when={data()}
        fallback={
          <div class="loading">
            <Show
              when={!loadError()}
              fallback={
                <>
                  <AppIcon icon="exclamation-circle" />
                  <span>{loadError()}</span>
                </>
              }
            >
              <>
                <AppIcon class="loader" icon="sun" />
                <span>Loading Weather Data</span>
              </>
            </Show>
          </div>
        }
      >
        <section class="app-home" style={{ '--map-aspect': String(mapAspect()) }}>
          <div class="top-hud">
            <div class="hud-brand">
              <AppIcon icon="sun" />
              <span>Where to Live</span>
            </div>
            <Show when={searchIndex()}>
              <div class="hud-search">
                <AppSearch searchIndex={searchIndex() ?? []} onChange={setSearch} />
              </div>
            </Show>
            <span class="hud-chip hud-meta">NOAA 2010-2024</span>
            <button
              type="button"
              class="hud-chip hud-details"
              onClick={() => setDetailsOpen((open) => !open)}
              aria-expanded={detailsOpen()}
            >
              {detailsOpen() ? 'Hide details' : 'Open details'}
            </button>
            <a
              class="hud-chip hud-source"
              href="https://github.com/Nicell/where-to-live"
              target="_blank"
              rel="noreferrer"
            >
              <AppIcon icon={{ prefix: 'fab', iconName: 'github' }} />
              <span>Source</span>
            </a>
          </div>
          <div class="map-holder">
            <AppMap
              data={data()!.m}
              search={search()}
              onHoverChange={setHover}
              onScaleChange={setMapScale}
              onPaletteChange={setPaletteMode}
              onWidthChange={setMapWidth}
            />
          </div>
          <Show when={detailsOpen()}>
            <aside class="detail-panel">
              <div class="detail-panel-body">
                <AppRanks top={data()!.t} bottom={data()!.b} data={data()!.m} />
              </div>
            </aside>
          </Show>
          <AppHover
            state={hover()}
            cell={cell()}
            mapScale={mapScale()}
            paletteMode={paletteMode()}
          />
        </section>
      </Show>
    </div>
  );
}

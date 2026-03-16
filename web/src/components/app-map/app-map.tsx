import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';

import './app-map.css';

import type { HoverState, LocationCell, MapGrid, ScoreRange } from '../../lib/types';
import AppIcon from '../app-icon/app-icon';
import {
  defaultPaletteMode,
  drawCanvas,
  type PaletteModeId,
  paletteModes
} from './canvas-util';

const stateBorderStorageKey = 'map-state-borders';
const scoreRangeStorageKey = 'map-score-range';

const emptyHover: HoverState = {
  x: 0,
  y: 0,
  data: null,
  visible: false
};

interface AppMapProps {
  data: MapGrid;
  search: string;
  onHoverChange: (hover: HoverState) => void;
  onScaleChange: (scale: number) => void;
  onPaletteChange: (mode: PaletteModeId) => void;
  onWidthChange?: (width: number) => void;
}

interface TransformState {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export default function AppMap(props: AppMapProps) {
  let rootRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let currentHover = emptyHover;

  const [paletteMode, setPaletteMode] = createSignal<PaletteModeId>(defaultPaletteMode);
  const [settingsMenuOpen, setSettingsMenuOpen] = createSignal(false);
  const [paletteSubmenuOpen, setPaletteSubmenuOpen] = createSignal(false);
  const [showStateBorders, setShowStateBorders] = createSignal(false);
  const [scoreRange, setScoreRange] = createSignal<ScoreRange>({ min: 0, max: 100 });
  const [width, setWidth] = createSignal(0);
  const [transform, setTransform] = createSignal<TransformState>({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  });

  const adjustedWidth = createMemo(() => width() / window.devicePixelRatio);
  const activePalette = createMemo(
    () => paletteModes.find((mode) => mode.id === paletteMode()) ?? paletteModes[0]
  );
  const rangeFilterActive = createMemo(() => scoreRange().min > 0 || scoreRange().max < 100);

  const commitHover = (nextHover: HoverState) => {
    if (
      nextHover.visible === currentHover.visible &&
      nextHover.data === currentHover.data &&
      nextHover.x === currentHover.x &&
      nextHover.y === currentHover.y
    ) {
      return;
    }

    currentHover = nextHover;
    props.onHoverChange(nextHover);
  };

  const clearHover = () => {
    commitHover(emptyHover);
  };

  const calcWidth = () => {
    if (!rootRef) {
      return;
    }

    setWidth(rootRef.clientWidth * window.devicePixelRatio);
  };

  const changeScale = (factor: number) => {
    const currentWidth = width();
    const currentTransform = transform();
    const height = (currentWidth * props.data.length) / props.data[0].length;
    let newScale = 0;

    if (factor < 1 && currentTransform.a !== 1) {
      newScale = Math.max(1, currentTransform.a * factor);
    } else if (factor > 1 && currentTransform.a !== 5) {
      newScale = Math.min(5, currentTransform.a * factor);
    }

    if (newScale === 0) {
      return;
    }

    const newXCalc =
      (currentTransform.e * newScale) / currentTransform.a -
      ((newScale - 1) * currentWidth) / 2 +
      (((currentTransform.a - 1) * currentWidth) / 2 * newScale) / currentTransform.a;
    const newYCalc =
      (currentTransform.f * newScale) / currentTransform.a -
      ((newScale - 1) * height) / 2 +
      (((currentTransform.a - 1) * height) / 2 * newScale) / currentTransform.a;
    const newX = Math.min(Math.max(newXCalc, currentWidth - currentWidth * newScale), 0);
    const newY = Math.min(Math.max(newYCalc, height - height * newScale), 0);

    setTransform({ ...currentTransform, a: newScale, d: newScale, e: newX, f: newY });
    props.onScaleChange(newScale);
  };

  const changeTranslation = (x: number, y: number) => {
    const currentWidth = width();
    const currentTransform = transform();
    const height = (currentWidth * props.data.length) / props.data[0].length;
    const newX = Math.min(
      Math.max(currentTransform.e + x, currentWidth - currentWidth * currentTransform.a),
      0
    );
    const newY = Math.min(
      Math.max(currentTransform.f + y, height - height * currentTransform.a),
      0
    );

    if (currentTransform.e !== newX || currentTransform.f !== newY) {
      setTransform({ ...currentTransform, e: newX, f: newY });
    }
  };

  const buildHoverState = (cellData: LocationCell | null, rowIndex: number, colIndex: number) => {
    if (!canvasRef || !cellData?.c) {
      return emptyHover;
    }

    const rect = canvasRef.getBoundingClientRect();
    const canvasCell = canvasRef.width / window.devicePixelRatio / props.data[0].length;
    const currentTransform = transform();

    return {
      x:
        rect.left +
        window.scrollX +
        currentTransform.e / window.devicePixelRatio +
        (colIndex * canvasCell + canvasCell / 2) * currentTransform.a,
      y:
        rect.top +
        window.scrollY +
        currentTransform.f / window.devicePixelRatio +
        rowIndex * canvasCell * currentTransform.a,
      data: cellData,
      visible: true
    };
  };

  const findHoverByCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef) {
      return emptyHover;
    }

    const rect = canvasRef.getBoundingClientRect();
    const currentTransform = transform();
    const cell = canvasRef.width / window.devicePixelRatio / props.data[0].length;
    const x = (clientX - rect.left - currentTransform.e / window.devicePixelRatio) / currentTransform.a;
    const y = (clientY - rect.top - currentTransform.f / window.devicePixelRatio) / currentTransform.a;

    for (let rowIndex = 0; rowIndex < props.data.length; rowIndex += 1) {
      const row = props.data[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cellData = row[colIndex];
        if (
          y > rowIndex * cell &&
          y < rowIndex * cell + cell &&
          x > colIndex * cell &&
          x < colIndex * cell + cell &&
          cellData?.c
        ) {
          return buildHoverState(cellData, rowIndex, colIndex);
        }
      }
    }

    return emptyHover;
  };

  const searchHover = () => {
    const search = props.search;
    if (!canvasRef || search.length !== 5) {
      clearHover();
      return;
    }

    for (let rowIndex = 0; rowIndex < props.data.length; rowIndex += 1) {
      const row = props.data[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cellData = row[colIndex];
        const zips = cellData?.z ?? [];
        for (const zip of zips) {
          if (`00000${zip}`.slice(-5) === search) {
            commitHover(buildHoverState(cellData, rowIndex, colIndex));
            return;
          }
        }
      }
    }

    clearHover();
  };

  const handleCanvasHover = (event: MouseEvent) => {
    if (props.search.length === 5) {
      return;
    }

    commitHover(findHoverByCoordinates(event.clientX, event.clientY));
  };

  const handleCanvasLeave = () => {
    if (props.search.length !== 5) {
      clearHover();
    }
  };

  const renderCanvas = () => {
    if (!canvasRef) {
      return;
    }

    const context = canvasRef.getContext('2d');
    const currentWidth = width();
    if (!context || currentWidth === 0) {
      return;
    }

    context.clearRect(0, 0, canvasRef.width, canvasRef.height);
    const cell = canvasRef.width / props.data[0].length;
    const currentTransform = transform();
    context.setTransform(
      currentTransform.a,
      currentTransform.b,
      currentTransform.c,
      currentTransform.d,
      currentTransform.e,
      currentTransform.f
    );
    drawCanvas(
      context,
      props.data,
      currentTransform,
      currentWidth,
      cell,
      props.search,
      paletteMode(),
      showStateBorders(),
      scoreRange()
    );
  };

  const clampScore = (value: number) => Math.max(0, Math.min(100, value));

  const persistScoreRange = (nextRange: ScoreRange) => {
    setScoreRange(nextRange);
    window.localStorage.setItem(scoreRangeStorageKey, JSON.stringify(nextRange));
  };

  const updateScoreRange = (key: keyof ScoreRange, nextValue: string) => {
    const parsedValue = Number.parseInt(nextValue, 10);
    const safeValue = Number.isNaN(parsedValue) ? 0 : clampScore(parsedValue);
    const currentRange = scoreRange();

    if (key === 'min') {
      persistScoreRange({
        min: Math.min(safeValue, currentRange.max),
        max: currentRange.max
      });
      return;
    }

    persistScoreRange({
      min: currentRange.min,
      max: Math.max(safeValue, currentRange.min)
    });
  };

  const resetScoreRange = () => {
    persistScoreRange({ min: 0, max: 100 });
  };

  onMount(() => {
    const storedMode = window.localStorage.getItem('map-palette-mode') as PaletteModeId | null;
    if (storedMode && paletteModes.some((mode) => mode.id === storedMode)) {
      setPaletteMode(storedMode);
    }

    setShowStateBorders(window.localStorage.getItem(stateBorderStorageKey) === 'true');
    const storedScoreRange = window.localStorage.getItem(scoreRangeStorageKey);
    if (storedScoreRange) {
      try {
        const parsedScoreRange = JSON.parse(storedScoreRange) as Partial<ScoreRange>;
        const min = clampScore(parsedScoreRange.min ?? 0);
        const max = clampScore(parsedScoreRange.max ?? 100);
        setScoreRange({ min: Math.min(min, max), max: Math.max(max, min) });
      } catch (error) {
        console.error('Unable to restore score range.', error);
      }
    }
    calcWidth();

    const handleResize = () => calcWidth();
    window.addEventListener('resize', handleResize);
    onCleanup(() => window.removeEventListener('resize', handleResize));
  });

  createEffect(() => {
    props.onPaletteChange(paletteMode());
  });

  createEffect(() => {
    props.onWidthChange?.(adjustedWidth());
  });

  createEffect(() => {
    props.search;
    transform();
    width();

    if (props.search.length === 5) {
      searchHover();
      return;
    }

    clearHover();
  });

  createEffect(() => {
    width();
    transform();
    paletteMode();
    showStateBorders();
    scoreRange();
    props.search;

    const timer = window.setTimeout(() => renderCanvas(), 50);
    onCleanup(() => window.clearTimeout(timer));
  });

  const updatePaletteMode = (mode: PaletteModeId) => {
    if (paletteMode() === mode) {
      setPaletteSubmenuOpen(false);
      return;
    }

    setPaletteMode(mode);
    setPaletteSubmenuOpen(false);
    window.localStorage.setItem('map-palette-mode', mode);
  };

  const toggleSettingsMenu = () => {
    const nextValue = !settingsMenuOpen();
    setSettingsMenuOpen(nextValue);
    if (!nextValue) {
      setPaletteSubmenuOpen(false);
    }
  };

  const togglePaletteSubmenu = () => {
    if (!settingsMenuOpen()) {
      setSettingsMenuOpen(true);
    }

    setPaletteSubmenuOpen((open) => !open);
  };

  const toggleStateBorders = () => {
    const nextValue = !showStateBorders();
    setShowStateBorders(nextValue);
    window.localStorage.setItem(stateBorderStorageKey, String(nextValue));
  };

  return (
    <div
      class="app-map"
      ref={(element) => {
        rootRef = element;
      }}
    >
      <canvas
        ref={(element) => {
          canvasRef = element;
        }}
        class="map-canvas"
        style={{
          width: `${adjustedWidth()}px`,
          height: `${(adjustedWidth() / props.data[0].length) * props.data.length}px`
        }}
        width={width()}
        height={(width() / props.data[0].length) * props.data.length}
        onMouseMove={handleCanvasHover}
        onMouseLeave={handleCanvasLeave}
      />
      <div classList={{ 'settings-picker': true, open: settingsMenuOpen() }}>
        <button
          type="button"
          class="settings-trigger"
          onClick={toggleSettingsMenu}
          aria-expanded={settingsMenuOpen()}
          aria-label="Open map settings"
        >
          <AppIcon icon="gear" />
        </button>
        <Show when={settingsMenuOpen()}>
          <div class="settings-menu" role="group" aria-label="Map settings">
            <div class="settings-section">
              <button
                type="button"
                classList={{ 'settings-row': true, active: paletteSubmenuOpen() }}
                onClick={togglePaletteSubmenu}
                aria-expanded={paletteSubmenuOpen()}
              >
                <span class="settings-row-main">
                  <span class="palette-swatch trigger-swatch" style={{ 'background-image': activePalette().swatch }} />
                  <span class="settings-copy">
                    <span class="settings-name">Colors</span>
                    <span class="settings-description">{activePalette().label}</span>
                  </span>
                </span>
                <span classList={{ 'palette-caret': true, open: paletteSubmenuOpen() }} />
              </button>
              <Show when={paletteSubmenuOpen()}>
                <div class="palette-submenu" role="group" aria-label="Map color palette">
                  <For each={paletteModes}>
                    {(mode) => (
                      <button
                        type="button"
                        classList={{ 'palette-option': true, active: paletteMode() === mode.id }}
                        onClick={() => updatePaletteMode(mode.id)}
                        title={mode.description}
                      >
                        <span class="palette-swatch" style={{ 'background-image': mode.swatch }} />
                        <span class="settings-copy">
                          <span class="settings-name">{mode.label}</span>
                          <span class="settings-description">{mode.description}</span>
                        </span>
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
            <div class="settings-section">
              <button
                type="button"
                classList={{ 'settings-row': true, 'toggle-option': true, active: showStateBorders() }}
                onClick={toggleStateBorders}
                aria-pressed={showStateBorders()}
              >
                <span classList={{ 'toggle-pill': true, active: showStateBorders() }} aria-hidden="true">
                  <span class="toggle-knob" />
                </span>
                <span class="settings-copy">
                  <span class="settings-name">State gaps</span>
                  <span class="settings-description">
                    Separate states with larger gaps instead of one continuous land mass.
                  </span>
                </span>
              </button>
            </div>
            <div class="settings-section">
              <div class="range-copy">
                <span class="range-label">Highlight score</span>
                <span class="range-value">
                  {scoreRange().min} to {scoreRange().max}
                </span>
              </div>
              <div class="range-inputs">
                <label class="range-field">
                  <span>Min</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange().min}
                    onInput={(event) => updateScoreRange('min', event.currentTarget.value)}
                  />
                </label>
                <label class="range-field">
                  <span>Max</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange().max}
                    onInput={(event) => updateScoreRange('max', event.currentTarget.value)}
                  />
                </label>
              </div>
              <div class="range-sliders">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange().min}
                  onInput={(event) => updateScoreRange('min', event.currentTarget.value)}
                  aria-label="Minimum highlighted score"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scoreRange().max}
                  onInput={(event) => updateScoreRange('max', event.currentTarget.value)}
                  aria-label="Maximum highlighted score"
                />
              </div>
              <button
                type="button"
                class="range-reset"
                onClick={resetScoreRange}
                disabled={!rangeFilterActive()}
              >
                Reset
              </button>
            </div>
          </div>
        </Show>
      </div>
      <div class="map-controls">
        <div class="map-move">
          <button type="button" class="move up" onClick={() => changeTranslation(0, width() / 5)}>
            <AppIcon icon="caret-up" />
          </button>
          <button type="button" class="move down" onClick={() => changeTranslation(0, -width() / 5)}>
            <AppIcon icon="caret-up" />
          </button>
          <button type="button" class="move left" onClick={() => changeTranslation(width() / 5, 0)}>
            <AppIcon icon="caret-up" />
          </button>
          <button type="button" class="move right" onClick={() => changeTranslation(-width() / 5, 0)}>
            <AppIcon icon="caret-up" />
          </button>
        </div>
        <div class="map-zoom">
          <button type="button" onClick={() => changeScale(4 / 3)}>
            <AppIcon icon="plus" />
          </button>
          <button type="button" onClick={() => changeScale(3 / 4)}>
            <AppIcon icon="minus" />
          </button>
        </div>
      </div>
    </div>
  );
}

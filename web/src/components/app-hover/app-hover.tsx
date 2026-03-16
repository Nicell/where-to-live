import { For, Show, createMemo, type JSX } from 'solid-js';

import './app-hover.css';

import { formatLocationLabel } from '../../lib/format';
import type { HoverState } from '../../lib/types';
import { getRawWeatherScore, getWeatherScore } from '../../utils/score';
import { defaultPaletteMode, getChartColors, type PaletteModeId } from '../app-map/canvas-util';

const monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthLetter = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

interface AppHoverProps {
  state: HoverState;
  cell: number;
  mapScale: number;
  paletteMode?: PaletteModeId;
}

export default function AppHover(props: AppHoverProps) {
  const palette = createMemo(() => props.paletteMode ?? defaultPaletteMode);
  const weather = createMemo(() => props.state.data?.w?.m ?? []);
  const normalizedScore = createMemo(() =>
    Math.max(0, Math.min(getWeatherScore(props.state.data), 100))
  );
  const rawScore = createMemo(() => getRawWeatherScore(props.state.data));
  const offset = createMemo(() =>
    Math.min(
      Math.max(props.state.x, 272 / 2) + 5,
      document.documentElement.clientWidth - 272 / 2 - 5
    )
  );
  const chartColors = createMemo(() => getChartColors(palette()));
  const style = createMemo(
    () =>
      ({
        left: `${offset()}px`,
        top: `${props.state.y}px`,
        '--before-offset': `calc(50% + ${props.state.x - offset()}px)`,
        '--cell-size': `${props.cell * props.mapScale + 7}px`
      }) as JSX.CSSProperties
  );

  return (
    <Show when={props.state.visible && props.state.data}>
      <div
        classList={{ 'app-hover': true, flip: props.state.y - 135 < window.pageYOffset }}
        style={style()}
      >
        <div class="hover-title">
          <span>{formatLocationLabel(props.state.data!)}</span>
          <span title={`Raw score: ${rawScore()}`}>{normalizedScore()}/100</span>
        </div>
        <div class="hover-charts">
          <For each={weather().filter((_, index) => index % 2 === 0)}>
            {(pleasantDays, index) => {
              const monthIndex = index();
              const unpleasantDays = weather()[monthIndex * 2 + 1];
              return (
                <div class="hover-chart">
                  <div class="hover-chart-bar" style={{ 'background-color': chartColors().track }}>
                    <div
                      style={{
                        height: `${(unpleasantDays / monthDay[monthIndex]) * 100}%`,
                        background: chartColors().negative
                      }}
                    />
                    <div
                      style={{
                        height: `${(pleasantDays / monthDay[monthIndex]) * 100}%`,
                        background: chartColors().positive
                      }}
                    />
                  </div>
                  <span>{monthLetter[monthIndex]}</span>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}

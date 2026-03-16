import { For } from 'solid-js';

import './app-ranks.css';

import { formatCityState } from '../../lib/format';
import type { LocationCell, MapGrid } from '../../lib/types';
import { getRawWeatherScore, getWeatherScore } from '../../utils/score';

interface AppRanksProps {
  top: [number, number][];
  bottom: [number, number][];
  data: MapGrid;
}

function renderScore(location: LocationCell) {
  const normalized = Math.max(0, Math.min(getWeatherScore(location), 100));
  const raw = getRawWeatherScore(location);
  return <span title={`Raw score: ${raw}`}>{normalized}/100</span>;
}

function getLocationAt(data: MapGrid, position: [number, number]) {
  return data[position[1]][position[0]];
}

export default function AppRanks(props: AppRanksProps) {
  return (
    <div class="rankingPane">
      <section class="rankingSection">
        <span class="rankingLabel">Method</span>
        <p>
          NOAA weather data from 2010 to 2024. Each place is scored by pleasant days minus
          unpleasant days, then normalized to 0-100. Perceived temperature includes humidity.
        </p>
      </section>
      <section class="rankingSection">
        <span class="rankingLabel">Rules</span>
        <div class="criteriaGrid">
          <div class="criteriaBlock">
            <span>Pleasant</span>
            <ul>
              <li>Average perceived temperature between 62°F and 75°F</li>
              <li>Maximum perceived temperature below 82°F</li>
              <li>Minimum perceived temperature above 55°F</li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">
                  Visibility
                </a>{' '}
                above 6 statute miles
              </li>
              <li>Less than 0.10&quot; of precipitation</li>
            </ul>
          </div>
          <div class="criteriaBlock">
            <span>Unpleasant</span>
            <ul>
              <li>Average perceived temperature below 45°F</li>
              <li>Average perceived temperature above 88°F</li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">
                  Visibility
                </a>{' '}
                below 5 statute miles
              </li>
              <li>Any snow, hail, thunder, or tornadoes</li>
              <li>More than 0.20&quot; of precipitation</li>
            </ul>
          </div>
        </div>
      </section>
      <section class="rankingSection">
        <div class="rankingHeading">
          <span class="rankingLabel">Top</span>
          <h2>Best weather</h2>
        </div>
        <div class="rankingList">
          <For each={props.top}>
            {(position) => {
              const location = getLocationAt(props.data, position);
              return (
                <div>
                  <span>{formatCityState(location)}</span>
                  {renderScore(location)}
                </div>
              );
            }}
          </For>
        </div>
      </section>
      <section class="rankingSection">
        <div class="rankingHeading">
          <span class="rankingLabel">Bottom</span>
          <h2>Hardest weather</h2>
        </div>
        <div class="rankingList">
          <For each={props.bottom}>
            {(position) => {
              const location = getLocationAt(props.data, position);
              return (
                <div>
                  <span>{formatCityState(location)}</span>
                  {renderScore(location)}
                </div>
              );
            }}
          </For>
        </div>
      </section>
    </div>
  );
}

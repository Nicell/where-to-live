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
    <div class="rankingWrap">
      <div class="rankingBox">
        <div class="ranking about">
          <span>About</span>
          <p>
            Using NOAA weather data from 2010 to 2024, we calculate the average number of
            pleasant and unpleasant days for each month. We then combine those to display a
            heatmap of the best places to live by weather.
          </p>
          <p>
            The weather score is normalized from the raw pleasant-minus-unpleasant-day total onto
            a 0 to 100 scale, so the gaps between nearby scores still show up on the map.
          </p>
          <p>
            We calculate the perceived temperature, which takes into account relative humidity, to
            more accurately evaluate the temperature.
          </p>
          <div>
            <p>A pleasant day is counted when all of the following are met:</p>
            <ul>
              <li>Average perceived temperature between 62°F and 75°F</li>
              <li>Maximum perceived temperature below 82°F</li>
              <li>Minimum perceived temperature above 55°F</li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">
                  Visibility
                </a>{' '}
                of more than 6 statute miles
              </li>
              <li>Less than 0.10&quot; of precipitation</li>
            </ul>
          </div>
          <div>
            <p>An unpleasant day is counted when any of the following are met:</p>
            <ul>
              <li>Average perceived temperature below 45°F</li>
              <li>Average perceived temperature above 88°F</li>
              <li>
                <a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">
                  Visibility
                </a>{' '}
                of less than 5 statute miles
              </li>
              <li>Any snow, hail, thunder, or tornadoes</li>
              <li>More than 0.20&quot; of precipitation</li>
            </ul>
          </div>
          <p>All other days are not counted and are instead considered normal days.</p>
        </div>
        <div class="rankingCompare">
          <div class="ranking">
            <span>Top Locations</span>
            <div>
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
          </div>
          <div class="ranking">
            <span>Worst Locations</span>
            <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

import { Component, Prop, h } from '@stencil/core';
import { getRawWeatherScore, getWeatherScore } from '../../utils/score';


@Component({
  tag: 'app-ranks',
  styleUrl: 'app-ranks.css',
  shadow: false
})
export class AppRanks {
  @Prop() top: any;
  @Prop() bottom: any;
  @Prop() data: any;

  renderScore(location) {
    const normalized = Math.max(0, Math.min(getWeatherScore(location), 100));
    const raw = getRawWeatherScore(location);
    return <span title={`Raw score: ${raw}`}>{normalized}/100</span>;
  }

  render() {
    return (
      <div class="rankingWrap">
        <div class="rankingBox">
          <div class="ranking about">
            <span>About</span>
            <p>Using NOAA weather data from 2010 to 2024, we calculate the average number of pleasant and unpleasant days for each month. We then combine those to display a heatmap of the best places to live by weather.</p>
            <p>The weather score is normalized from the raw pleasant-minus-unpleasant-day total onto a 0 to 100 scale, so the gaps between nearby scores still show up on the map.</p>
            <p>We calculate the perceived temperature, which takes into account relative humidity, to more accurately evaluate the temperature.</p>
            <p>
              A pleasant day is counted when all of the following are met:
              <ul>
                <li>Average perceived temperature between 62°F and 75°F</li>
                <li>Maximum perceived temperature below 82°F</li>
                <li>Minimum perceived temperature above 55°F</li>
                <li><a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">Visibility</a> of more than 6 statute miles</li>
                <li>Less than 0.10" of precipitation</li>
              </ul>
            </p>
            <p>
              An unpleasant day is counted when any of the following are met:
              <ul>
                <li>Average perceived temperature below 45°F</li>
                <li>Average perceived temperature above 88°F</li>
                <li><a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">Visibility</a> of less than 5 statute miles</li>
                <li>Any snow, hail, thunder, or tornadoes</li>
                <li>More than 0.20" of precipitation</li>
              </ul>
            </p>
            <p>All other days are not counted and are instead considered normal days.</p>
          </div>
          <div class="rankingCompare">
            <div class="ranking">
              <span>Top Locations</span>
              <div>
                {this.top.map(p => (
                  <div>
                    <span>{this.data[p[1]][p[0]].c.split(' ').map(s => s.charAt(0) + s.toLowerCase().substring(1)).join(' ')}, {this.data[p[1]][p[0]].s}</span>
                    {this.renderScore(this.data[p[1]][p[0]])}
                    </div>
                ))}
              </div>
            </div>
            <div class="ranking">
              <span>Worst Locations</span>
              <div>
                {this.bottom.map(p => (
                  <div>
                    <span>{this.data[p[1]][p[0]].c.split(' ').map(s => s.charAt(0) + s.toLowerCase().substring(1)).join(' ')}, {this.data[p[1]][p[0]].s}</span>
                    {this.renderScore(this.data[p[1]][p[0]])}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

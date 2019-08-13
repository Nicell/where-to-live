import { Component, Prop, h } from '@stencil/core';


@Component({
  tag: 'app-ranks',
  styleUrl: 'app-ranks.css',
  shadow: false
})
export class AppRanks {
  @Prop() top: any;
  @Prop() bottom: any;
  @Prop() data: any;

  render() {
    return (
      <div class="rankingWrap">
        <div class="rankingBox">
          <div class="ranking about">
            <span>About</span>
            <p>Using NOAA weather data from 1990 to the last full year, we calculate the average number of pleasant and unpleasant days for each month. We then combine those to display a heatmap of the best places to live by weather.</p>
            <p>We calculate the perceived temperature, which takes into account relative humidity, to more accurately evaluate the temperature.</p>
            <p>
              A pleasant day is counted when all of the following are met:
              <ul>
                <li>Average perceived temperature between 60°F and 80°F</li>
                <li>Maximum perceived temperature below 85°F</li>
                <li>Minimum perceived temperature above 50°F</li>
                <li><a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">Visibility</a> of more than 5</li>
                <li>Less than .05" of precipitation</li>
              </ul>
            </p>
            <p>
              An unpleasant day is counted when any of the following are met:
              <ul>
                <li>Average perceived temperature below 40°F</li>
                <li>Average perceived temperature above 90°F</li>
                <li><a href="https://en.wikipedia.org/wiki/Visibility" target="_blank" rel="nofollow">Visibility</a> of less than 5</li>
                <li>Any snow, hail, thunder, or tornados</li>
                <li>More than .1" of precipitation</li>
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
                    <span>{this.data[p[1]][p[0]].c}, {this.data[p[1]][p[0]].s}</span>
                    <span>{this.data[p[1]][p[0]].w.m.reduce((a, b, i) => i % 2 === 0 ? a + b : a - b, 0)}</span>
                    </div>
                ))}
              </div>
            </div>
            <div class="ranking">
              <span>Worst Locations</span>
              <div>
                {this.bottom.map(p => (
                  <div>
                    <span>{this.data[p[1]][p[0]].c}, {this.data[p[1]][p[0]].s}</span>
                    <span>{this.data[p[1]][p[0]].w.m.reduce((a, b, i) => i % 2 === 0 ? a + b : a - b, 0)}</span>
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

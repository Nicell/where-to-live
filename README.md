# 🌎 Where to Live
[![Go Report Card](https://goreportcard.com/badge/github.com/Nicell/where-to-live?style=flat-square)](https://goreportcard.com/report/github.com/Nicell/where-to-live)
[![GitHub Actions Build](https://img.shields.io/github/actions/workflow/status/Nicell/where-to-live/ci.yml?branch=master&style=flat-square)](https://github.com/Nicell/where-to-live/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/Nicell/where-to-live.svg?style=flat-square)](LICENSE)

A website to show the best places to live based on weather in the US

# ✨ How it works
Using NOAA weather data from 2010 to 2024, we calculate the average number of pleasant and unpleasant days for each month. We then combine those to display a heatmap of the best places to live by weather.

We calculate the **perceived temperature**, which takes into account relative humidity, to more accurately evaluate the temperature.

A pleasant day is counted when all of the following are met:
 - Average perceived temperature between 62°F and 75°F
 - Maximum perceived temperature below 82°F
 - Minimum perceived temperature above 55°F
 - [Visibility](https://en.wikipedia.org/wiki/Visibility) of more than 6 statute miles
 - Less than 0.10" of precipitation

An unpleasant day is counted when any of the following are met:
 - Average perceived temperature below 45°F
 - Average perceived temperature above 88°F
 - [Visibility](https://en.wikipedia.org/wiki/Visibility) of less than 5 statute miles
 - Any snow, hail, thunder, or tornadoes
 - More than 0.20" of precipitation

All other days are not counted and are instead considered normal days.

# 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 🤝 Acknowledgments
 - [Kelly Norton](https://github.com/kellegous) for the [pleasant-places](https://github.com/kellegous/pleasant-places) repository, which we used as reference and inspiration.
 - [Spencer Mortensen](http://spencermortensen.com) for his [article](http://spencermortensen.com/articles/bezier-circle/) explaining how to create very accurate circle approximations using bezier curves, which we used for creating circles and curves in HTML canvas.

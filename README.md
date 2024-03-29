# 🌎 Where to Live
[![Go Report Card](https://goreportcard.com/badge/github.com/Nicell/where-to-live?style=flat-square)](https://goreportcard.com/report/github.com/Nicell/where-to-live)
[![CircleCI Build](https://img.shields.io/circleci/build/github/Nicell/where-to-live.svg?style=flat-square)](https://circleci.com/gh/Nicell/where-to-live)
[![License](https://img.shields.io/github/license/Nicell/where-to-live.svg?style=flat-square)](LICENSE)

A website to show the best places to live based on weather in the US

# ✨ How it works
Using NOAA weather data from 2008 to 2021, we calculate the average number of pleasant and unpleasant days for each month. We then combine those to display a heatmap of the best places to live by weather.

We calculate the **perceived temperature**, which takes into account relative humidity, to more accurately evaluate the temperature.

A pleasant day is counted when all of the following are met:
 - Average perceived temperature between 60°F and 80°F
 - Maximum perceived temperature below 85°F
 - Minimum perceived temperature above 50°F
 - [Visibility](https://en.wikipedia.org/wiki/Visibility) of more than 5
 - Less than .05" of precipitation

An unpleasant day is counted when any of the following are met:
 - Average perceived temperature below 40°F
 - Average perceived temperature above 85°F
 - [Visibility](https://en.wikipedia.org/wiki/Visibility) of less than 5
 - Any snow, hail, thunder, or tornados
 - More than .1" of precipitation

All other days are not counted and are instead considered normal days.

# 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 🤝 Acknowledgments
 - [Kelly Norton](https://github.com/kellegous) for the [pleasant-places](https://github.com/kellegous/pleasant-places) repository, which we used as reference and inspiration.
 - [Spencer Mortensen](http://spencermortensen.com) for his [article](http://spencermortensen.com/articles/bezier-circle/) explaining how to create very accurate circle approximations using bezier curves, which we used for creating circles and curves in HTML canvas.

export function getRawWeatherScore(location: any): number {
  const weather = location && location.w ? location.w : null;
  if (weather && typeof weather.r === 'number') {
    return weather.r;
  }

  const months = weather && weather.m ? weather.m : [];
  return months.reduce((a, b, i) => i % 2 === 0 ? a + b : a - b, 0);
}

export function getWeatherScore(location: any): number {
  const weather = location && location.w ? location.w : null;
  if (weather && typeof weather.p === 'number') {
    return weather.p;
  }

  return getRawWeatherScore(location);
}

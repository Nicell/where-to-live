export interface WeatherData {
  m: number[];
  p?: number;
  r?: number;
}

export interface LocationCell {
  a?: boolean;
  c?: string;
  s?: string;
  z?: number[];
  w?: WeatherData;
}

export type MapGrid = LocationCell[][];

export interface MapData {
  m: MapGrid;
  t: [number, number][];
  b: [number, number][];
}

export interface SearchLocation {
  z: string;
  n: string;
  p: number;
  c: number;
}

export interface HoverState {
  x: number;
  y: number;
  data: LocationCell | null;
  visible: boolean;
}

export interface ScoreRange {
  min: number;
  max: number;
}

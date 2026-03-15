import { getWeatherScore } from '../../utils/score';

interface radius {
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;
}

interface rgb {
  r: number;
  g: number;
  b: number;
}

interface paletteDefinition {
  id: PaletteModeId;
  label: string;
  description: string;
  swatch: string;
  stops: string[];
  chartPositive: string;
  chartNegative: string;
  chartTrack: string;
}

export type PaletteModeId = 'contrast' | 'cividis' | 'viridis';

const c = 1 - 0.55191502449; // This constant is based off of this article by Spencer Mortensen http://spencermortensen.com/articles/bezier-circle/

const neutralFill = { r: 213, g: 219, b: 225 };

export const defaultPaletteMode: PaletteModeId = 'viridis';

export const paletteModes: paletteDefinition[] = [
  {
    id: 'cividis',
    label: 'Cividis',
    description: 'Safest blue-to-gold option for color-vision deficiency.',
    swatch: 'linear-gradient(90deg, #00204c 0%, #2f4f73 28%, #626e7d 55%, #9f9447 78%, #fee838 100%)',
    stops: ['#00204c', '#2f4f73', '#626e7d', '#9f9447', '#fee838'],
    chartPositive: '#355f8d',
    chartNegative: '#9f7e2e',
    chartTrack: '#d5dde5'
  },
  {
    id: 'viridis',
    label: 'Viridis',
    description: 'Best general-purpose sequential palette for ordered scores.',
    swatch: 'linear-gradient(90deg, #440154 0%, #3b528b 28%, #21918c 58%, #5dc863 80%, #c8df21 100%)',
    stops: ['#440154', '#3b528b', '#21918c', '#5dc863', '#c8df21'],
    chartPositive: '#15803d',
    chartNegative: '#c2410c',
    chartTrack: '#dce3ed'
  },
  {
    id: 'contrast',
    label: 'Ocean',
    description: 'Higher-contrast navy-to-teal scale without blown-out highlights.',
    swatch: 'linear-gradient(90deg, #203a5c 0%, #235789 24%, #1f7a8c 52%, #1fa187 78%, #8bd3c7 100%)',
    stops: ['#203a5c', '#235789', '#1f7a8c', '#1fa187', '#8bd3c7'],
    chartPositive: '#1f7a8c',
    chartNegative: '#235789',
    chartTrack: '#d8e5ea'
  }
];

const paletteStops = paletteModes.reduce((acc, mode) => {
  acc[mode.id] = mode.stops.map(hexToRgb);
  return acc;
}, {} as Record<PaletteModeId, rgb[]>);

function hexToRgb(hex: string): rgb {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function mix(base: rgb, overlay: rgb, amount: number): rgb {
  const weight = Math.min(Math.max(amount, 0), 1);
  return {
    r: Math.round(base.r + (overlay.r - base.r) * weight),
    g: Math.round(base.g + (overlay.g - base.g) * weight),
    b: Math.round(base.b + (overlay.b - base.b) * weight)
  };
}

function interpolate(stops: rgb[], amount: number): rgb {
  if (stops.length === 1) {
    return stops[0];
  }

  const normalized = Math.min(Math.max(amount, 0), 1);
  const index = Math.min(stops.length - 2, Math.floor(normalized * (stops.length - 1)));
  const start = stops[index];
  const end = stops[index + 1];
  const localAmount = normalized * (stops.length - 1) - index;

  return mix(start, end, localAmount);
}

export function getPaletteMode(id: PaletteModeId = defaultPaletteMode): paletteDefinition {
  return paletteModes.find((mode) => mode.id === id) || paletteModes[0];
}

export function getChartColors(id: PaletteModeId = defaultPaletteMode) {
  const mode = getPaletteMode(id);
  return {
    positive: mode.chartPositive,
    negative: mode.chartNegative,
    track: mode.chartTrack
  };
}

function getFillColor(score: number, paletteMode: PaletteModeId, saturated: boolean): string {
  const stops = paletteStops[paletteMode] || paletteStops[defaultPaletteMode];
  const base = interpolate(stops, score / 100);
  const fill = saturated ? base : mix(base, neutralFill, 0.72);
  const alpha = saturated ? 1 : 0.55;
  return `rgba(${fill.r}, ${fill.g}, ${fill.b}, ${alpha})`;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.bezierCurveTo(x + width - radius.tr * c, y, x + width, y + radius.tr * c, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.bezierCurveTo(x + width, y + height - radius.br * c, x + width - radius.br * c, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.bezierCurveTo(x + radius.bl * c, y + height, x, y + height - radius.bl * c, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.bezierCurveTo(x, y + radius.tl * c, x + radius.tl * c, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

export function drawCanvas(ctx: CanvasRenderingContext2D, data, transform: DOMMatrix2DInit, width: number, cell: number, search: string, paletteMode: PaletteModeId) {
  const size = cell * .85;
  const height = width * data.length / data[0].length;
  data.forEach((t, i) => t.forEach((l, j) => {
    if (l.c && (j * cell + (cell - size) / 2) * transform.a < -transform.e + width && (j * cell + (cell - size) / 2 + size) * transform.a > -transform.e && (i * cell + (cell - size) / 2) * transform.a < -transform.f + height && (i * cell + (cell - size) / 2 + size) * transform.a > -transform.f) {
      const half = size / 2;
      const corner = size / 6;
      const radius = { tl: corner, tr: corner, br: corner, bl: corner }

      const bottom = (i === data.length - 1 || !data[i + 1][j].c ? '' : data[i + 1][j].c).length > 0;
      const top = (i === 0 || !data[i - 1][j].c ? '' : data[i - 1][j].c).length > 0;
      const right = (j === data[i].length - 1 || !data[i][j + 1].c ? '' : data[i][j + 1].c).length > 0;
      const left = (j === 0 || !data[i][j - 1].c ? '' : data[i][j - 1].c).length > 0;

      if (!top && !left)
        radius.tl = half;
      if (!top && !right)
        radius.tr = half;
      if (!bottom && !right)
        radius.br = half;
      if (!bottom && !left)
        radius.bl = half;

      let saturated;
      if (search.length > 0) {
        if (l.z) {
          const contains = l.z.filter(zip => ('00000' + zip.toString()).slice(-5).substr(0, search.length) === search);
          if (contains.length > 0) {
            saturated = true;
          } else {
            saturated = false;
          }
        } else {
          saturated = false;
        }
      } else {
        saturated = true;
      }

      const score = Math.max(0, Math.min(getWeatherScore(l), 100));
      ctx.fillStyle = getFillColor(score, paletteMode, saturated);
      roundRect(ctx, j * cell + (cell - size) / 2, i * cell + (cell - size) / 2, size, size, radius);
    }
  }));
}

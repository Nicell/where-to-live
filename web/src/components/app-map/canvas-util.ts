interface radius {
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;
}

const c = 1 - 0.55191502449; // This constant is based off of this article by Spencer Mortensen http://spencermortensen.com/articles/bezier-circle/

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

export function drawCanvas(ctx: CanvasRenderingContext2D, data, transform: DOMMatrix2DInit, width: number, cell: number, search: string) {
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

      const w = l.w && l.w.m ? l.w.m : [];
      const days = w.reduce((a, b, i) => i%2 === 0 ? a + b : a - b, 0);
      ctx.fillStyle = `hsla(203, ${saturated ? '100%' : '0%'}, 46%, ${ days === 0 ? .2 : (days + 365) / (365 + 201) * .8 + .2})`;
      roundRect(ctx, j * cell + (cell - size) / 2, i * cell + (cell - size) / 2, size, size, radius);
    }
  }));
}

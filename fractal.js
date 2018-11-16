function multiply(c1, c2) {
  if (typeof(c1) == "object" && typeof(c2) == "object") {
    return [(c1[0] * c2[0]) - (c1[1] * c2[1]), (c1[0] * c2[1]) + (c1[1] * c2[0])]
  } else if (typeof(c1) == "object" && typeof(c2) == "number") {
    return [c1[0] * c2, c1[1] * c2]
  }
  return multiply(c2, c1);
}
let mul = multiply

function power(c, n) {
  for (let i = 1; i < n; i++) {
    c = multiply(c, c);
  }
  return c
}
let pow = power;

function add(c1, c2) {
  if (typeof(c1) == "object" && typeof(c2) == "object") {
    return [c1[0] + c2[0], c1[1] + c2[1]];
  } else if (typeof(c1) == "object" && typeof(c2) == "number") {
    return [c1[0] + c2, c1[1]]
  }
  return add(c2, c1);
}

function magnitude(c) {
  return Math.sqrt(c[0] ** 2 + c[1] ** 2);
}

function getColor(angle) {
  angle = angle % 360;
  let h2 = angle / 60;
  let s2 = 1;
  let v2 = 1;
  let c = v2 * s2;
  let x = c * (1 - Math.abs((h2 % 2) - 1));
  let m = v2 - c;
  let r, g, b;
  if (h2 < 1) {
    r = c;
    g = x;
    b = 0;
  } else if (h2 < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (h2 < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (h2 < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (h2 < 5) {
    r = x;
    g = 0;
    b = c;
  } else if (h2 <= 6) {
    r = c;
    g = 0;
    b = x;
  }
  r = (r + m) * 255
  g = (g + m) * 255
  b = (b + m) * 255
  return [r, g, b]
}

function draw(options) {
  let width = options.context.canvas.width;
  let height = options.context.canvas.height;
  let imageData = options.context.getImageData(0, 0, width, height);
  let buf = new ArrayBuffer(imageData.data.length);
  let buf8 = new Uint8ClampedArray(buf);
  let data = new Uint32Array(buf);

  let z, c, i, r, g, b;
  let smoothcolor;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      z = [(x - width / 2) / 100, (y - height / 2) / 100];
      z = multiply(z, 1 / options.zoom);
      z = add(z, [options.xshift, options.yshift]);
      c = z.slice();

      smoothcolor = Math.exp(-magnitude(z));

      i = 0;
      while (i < options.iterations && z[0] ** 2 + z[1] ** 2 <= 4) {
        z = eval(options.formula);

        smoothcolor += Math.exp(-magnitude(z));

        i++;
      }

      if (i < options.iterations || !options.drawblack) {
        if (options.smoothshading) {
          [r, g, b] = getColor(options.hueshift + smoothcolor / options.iterations * 360 * 2);
        } else {
          [r, g, b] = getColor(options.hueshift + i / options.iterations * 360);
        }
      } else {
        r = 0;
        g = 0;
        b = 0;
      }

      data[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;

    }
  }

  imageData.data.set(buf8);

  if (options.drawtocanvas) {
    options.context.putImageData(imageData, 0, 0);
  }
  return imageData;
}

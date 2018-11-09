let canvas = window.fractal;
let ctx = canvas.getContext("2d");
window.generate.addEventListener("click", update);
window.formula.value = "add(pow(z, 2), c)";
window.iterations.value = 50;
window.zoom.value = 1;
window.xshift.value = 0;
window.yshift.value = 0;

function multiply(c1, c2) {
	if (typeof(c1) == "object" && typeof(c2) == "object") {
		return [(c1[0] * c2[0]) - (c1[1] * c2[1]), (c1[0] * c2[1]) + (c1[1] * c2[0])]
	} else if (typeof(c1) == "object" && typeof(c2) == "number") {
		return [c1[0] * c2, c1[1] * c2]
	}
	return multiply(c2, c1);
}
let mul = multiply

function pow(c, n) {
	for (let i = 1; i < n; i++) {
		c = multiply(c, c);
	}
	return c
}

function add(c1, c2) {
	if (typeof(c1) == "object" && typeof(c2) == "object") {
		return [c1[0] + c2[0], c1[1] + c2[1]];
	} else if (typeof(c1) == "object" && typeof(c2) == "number") {
		return [c1[0] + c2, c1[1] + c2]
	}
	return add(c2, c1);
}

function update(e) {
	draw();
}

function draw() {
	let width = canvas.width;
	let height = canvas.height;
	let formula = window.formula.value;
	let iterations = window.iterations.value;
	let zoom = Number(window.zoom.value);
	let xshift = Number(window.xshift.value);
	let yshift = Number(window.yshift.value);
	
    let imageData = ctx.getImageData(0, 0, width, height);
    let buf = new ArrayBuffer(imageData.data.length);
    let buf8 = new Uint8ClampedArray(buf);
    let data = new Uint32Array(buf);
	
	let z, c, i, r, g, b, n;
	
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			
			z = [(x - width / 2) / 100, (y - height / 2) / 100];
			z = multiply(z, zoom);
			z = add(z, [xshift, yshift]);
			c = z.slice();
			
			i = 0;
			while (i < iterations && z[0] ** 2 + z[1] ** 2 <= 4) {
				z = eval(formula);
				i++;
			}
			
			r = 0;
			g = 0;
			b = 0;
			
			if (i < iterations) {
				n = i / iterations * 255;
				r = n;
			}
			
			data[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
			
		}
	}
	
	imageData.data.set(buf8);
	ctx.putImageData(imageData, 0, 0);
	
}

draw();

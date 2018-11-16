let canvas = window.fractal;
let context = canvas.getContext("2d");
window.generate.addEventListener("click", update);
window.generatezoom.addEventListener("click", zoomIn);
window.formula.value = "add(pow(z, 2), c)";
window.iterations.value = 50;
window.zoom.value = 1;
window.xpos.value = 0;
window.ypos.value = 0;
window.hueshift.value = 0;
window.checkdrawblack.checked = true;
window.checksmooth.checked = true;

function getOptions() {
	return {
		context: context,
		formula: window.formula.value,
		iterations: Number(window.iterations.value),
		zoom: Number(window.zoom.value),
		xshift: Number(window.xpos.value),
		yshift: Number(window.ypos.value),
		hueshift: Number(window.hueshift.value),
		drawblack: window.checkdrawblack.checked,
		smoothshading: window.checksmooth.checked,
		drawtocanvas: true,
	}
}

function update(e) {
  draw(getOptions());
}

function flipbook(imgs) {
  if (imgs.length > 0) {
    ctx.putImageData(imgs[0], 0, 0);
    imgs.shift();
    requestAnimationFrame(function() {
      flipbook(imgs);
    });
  }
}

function zoomIn(e) {
  let imgs = [];
	let options = getOptions();
  for (let i = 0; i < 60; i++) {
    imgs.push(draw(options));
    window.zoom.value *= 1.5;
  }
  flipbook(imgs);
}


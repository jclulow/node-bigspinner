/* vim: set ts=8 sts=8 sw=8 noet: */

function
create_grid(w, h)
{
	var lines = [];
	while (lines.length < h) {
		var line = [];
		while (line.length < w) {
			line.push(' ');
		}
		lines.push(line);
	}
	return (lines);
}

function
squash_grid(g)
{
	var out = [];
	for (var y = 0; y < g.length; y++) {
		out.push(g[y].join(''));
	}
	return (out);
}

function
draw_line(g, c, x0, y0, x1, y1)
{
	var y;
	var t;
	var swapaxis = false;

	/*
	 * Adjust for quadrant:
	 */
	if (Math.abs(y1 - y0) > Math.abs(x1 - x0)) {
		swapaxis = true;
		t = x0;
		x0 = y0;
		y0 = t;
		t = x1;
		x1 = y1;
		y1 = t;
	}

	/*
	 * Adjust for horizontal direction:
	 */
	if (x1 < x0) {
		t = x0;
		x0 = x1;
		x1 = t;
		t = y0;
		y0 = y1;
		y1 = t;
	}

	var dx = x1 - x0;
	var dy = y1 - y0;

	if (dx === 0) {
		/*
		 * Handle vertical line.
		 */
		for (y = y0; y <= y1; y++) {
			g[y][x0] = c;
		}
		return;
	}

	var e = 0;
	var thres = dx / 2;
	y = y0;

	for (var x = x0; x < x1; x++) {
		if (swapaxis) {
			g[x][y] = c;
		} else {
			g[y][x] = c;
		}

		e += dy;

		if (dy < 0 && e < -thres) {
			/*
			 * Line slopes down.
			 */
			e += dx;
			y -= 1;
		} else if (dy >= 0 && e > thres) {
			/*
			 * Line slopes up.
			 */
			e -= dx;
			y += 1;
		}
	}

	if (swapaxis) {
		g[x][y] = c;
	} else {
		g[y][x] = c;
	}
}

module.exports = {
	create_grid: create_grid,
	squash_grid: squash_grid,
	draw_line: draw_line
};

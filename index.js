/* vim: set ts=8 sts=8 sw=8 noet: */

var lib_bresenham = require('./lib/bresenham');

var ESC = '\u001b';
var CSI = ESC + '[';

function
create_font_character(w, h, c, x0, y0, x1, y1)
{
	var grid = lib_bresenham.create_grid(w, h);

	lib_bresenham.draw_line(grid, c, x0, y0, x1, y1);

	return (lib_bresenham.squash_grid(grid));
}

function
create_font(w, h, c)
{
	var h2 = Math.floor(h / 2);
	var w2 = Math.floor(w / 2);

	var font = [
		create_font_character(w, h, c, 0, h2, w - 1, h2),
		create_font_character(w, h, c, 0, 0, w - 1, h - 1),
		create_font_character(w, h, c, w2, 0, w2, h - 1),
		create_font_character(w, h, c, 0, h - 1, w - 1, 0)
	];

	return (font);
}

function
wblank(font, str, n)
{
	/*
	 * Rewind to the top line of the spinner region.
	 */
	w(str, CSI + font[0].length + 'A');
	w(str, CSI + '1G');

	/*
	 * Clear out the region used by the spinner.
	 */
	var line = '';
	while (line.length < font[0][0].length)
		line += ' ';
	for (var i = 0; i < font[0].length; i++) {
		w(str, line + '\n');
	}

	/*
	 * And again...
	 */
	w(str, CSI + font[0].length + 'A');
	w(str, CSI + '1G');
}

function
w(str, s)
{
        str.write(s);
}

function
wl(font, str, n)
{
        for (var y = 0; y < font[n].length; y++) {
                w(str, font[n][y] + '\n');
        }
}

function
getbool(val0, val1, def)
{
	if (val0 === true || val0 === false)
		return (val0);
	if (val1 === true || val1 === false)
		return (val1);
	return (def);
}

function
BigSpinner(opts)
{
	var self = this;

	self.bs_hide_cursor = getbool(opts.hideCursor, opts.hide_cursor, true);

	self.bs_height = opts.height || 8;
	self.bs_width = opts.width || 8;
	self.bs_font_char = opts.fontChar || '#';

	self.bs_font = create_font(self.bs_width, self.bs_height,
	    self.bs_font_char);

	self.bs_delay = opts.delay || 250;
	self.bs_destroyed = false;
	self.bs_first = true;
	self.bs_stream = opts.stream || process.stderr; self.bs_iter = 0;
	self.bs_interv = setInterval(function () {
		if (self.bs_hide_cursor)
			self.bs_stream.write(CSI + '?25l');
		if (!self.bs_first) {
			/*
			 * Rewind to the top line of the spinner region.
			 */
			w(self.bs_stream, CSI + self.bs_font[0].length + 'A');
			w(self.bs_stream, CSI + '1G');
		} else {
			self.bs_first = false;
		}
		wl(self.bs_font, self.bs_stream,
		    self.bs_iter++ % self.bs_font.length);
	}, self.bs_delay);

	if (self.bs_hide_cursor) {
		self.bs_exit_handler = function () {
			try {
				self.bs_stream.write(CSI + '?25h');
			} catch (ex) {
			}
		};
		process.on('exit', self.bs_exit_handler);
	}
}

BigSpinner.prototype.destroy = function
destroy()
{
	var self = this;

	if (self.bs_destroyed)
		return;
	self.bs_destroyed = true;

	if (self.bs_hide_cursor) {
		self.bs_stream.write(CSI + '?25h');
	}

	if (self.bs_exit_handler) {
		process.removeListener('exit', self.bs_exit_handler);
	}

	clearInterval(self.bs_interv);
	wblank(self.bs_font, self.bs_stream);
};

function
create_spinner(opts)
{
	return (new BigSpinner(opts));
}

module.exports = {
	createSpinner: create_spinner
};

/* vim: set ts=8 sts=8 sw=8 noet: */

var ESC = '\u001b';
var CSI = ESC + '[';

var L0 = ['        ', ' #      ', '    #   ', '       #'];
var L1 = ['        ', '  #     ', '    #   ', '      # '];
var L2 = ['        ', '   #    ', '    #   ', '     #  '];
var L3 = [' ###### ', '    #   ', '    #   ', '    #   '];
var L4 = ['        ', '     #  ', '    #   ', '   #    '];
var L5 = ['        ', '      # ', '    #   ', '  #     '];
var L6 = ['        ', '       #', '    #   ', ' #      '];

var L = [ L0, L1, L2, L3, L4, L5, L6 ];

function
wblank(str, n)
{
	/*
	 * Rewind to the top line of the spinner region.
	 */
	w(str, CSI + (L.length) + 'A');
	w(str, CSI + '1G');

	/*
	 * Clear out the region used by the spinner.
	 */
	var line = '';
	while (line.length < L[0][0].length)
		line += ' ';
	for (var i = 0; i < L.length; i++) {
		w(str, line + '\n');
	}

	/*
	 * And again...
	 */
	w(str, CSI + (L.length) + 'A');
	w(str, CSI + '1G');
}

function
w(str, s)
{
        str.write(s);
}

function
wl(str, n)
{
        for (var i = 0; i < L.length; i++) {
                w(str, L[i][n] + '\n');
        }
}

function
BigSpinner(opts)
{
	var self = this;

	self.bs_delay = opts.delay || 250;
	self.bs_destroyed = false;
	self.bs_first = true;
	self.bs_stream = opts.stream || process.stderr;
	self.bs_iter = 0;
	self.bs_interv = setInterval(function () {
		if (!self.bs_first) {
			/*
			 * Rewind to the top line of the spinner region.
			 */
			w(self.bs_stream, CSI + (L.length) + 'A');
			w(self.bs_stream, CSI + '1G');
		} else {
			self.bs_first = false;
		}
		wl(self.bs_stream, self.bs_iter++ % L[0].length);
	}, self.bs_delay);
}

BigSpinner.prototype.destroy = function
destroy()
{
	var self = this;

	if (self.bs_destroyed)
		return;
	self.bs_destroyed = true;

	clearInterval(self.bs_interv);
	wblank(self.bs_stream);
};

function
create_spinner(opts)
{
	return (new BigSpinner(opts));
}

module.exports = {
	createSpinner: create_spinner
};

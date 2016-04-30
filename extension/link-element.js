var linkElement = document.createElement('a');

linkElement.checkDoubleTLD = function () {
	var pairs = [ // http://namebio.com
		'.co.at', '.co.com', '.co.id',
		'.co.il', '.co.in', '.co.ke', '.co.kr', '.co.nz', '.co.uk', '.co.ve', '.co.za',
		'.com.ar', '.com.au', '.com.bo', '.com.br', '.com.bz', '.com.cn', '.com.co', '.com.es', '.com.gt', '.com.mx', '.com.my', '.com.ng', 
		'.com.pa', '.com.pe', '.com.ph', '.com.pk', '.com.pl', '.com.pt', '.com.sg', '.com.tw', '.com.ua', '.com.uy', '.com.vc', '.com.ve', '.com.vn',
		'.de.com', '.eu.com', '.gen.in', '.in.com ', '.in.info', '.ind.in', '.ki.li', '.maclist.com', '.me.uk',
		'.net.au', '.net.cn', '.net.com', '.net.in', '.net.nz', '.net.pl',
		'.nom.es',
		'.or.at', '.org.cn', '.org.com', '.org.es', '.org.in', '.org.mx', '.org.pl', '.org.uk',
		'.qc.ca', '.sa.com', '.se.com', '.uk.com', '.uk.net', '.ums.net', '.us.com'
	];
	var position;
	for (var p = 0; p < pairs.length; p++) {
		position = this.hostname.indexOf(pairs[p]);
		if (position === (this.hostname.length - pairs[p].length) && position > -1) {
			return true;
		}
	}
	return false;
};

linkElement.createURL = function (url) {
	this.href = url;
	var parts = this.hostname.split('.');	
	var noOfParts = this.checkDoubleTLD() ? 3 : 2;
	while (parts.length > noOfParts) {
		parts.shift();
	}
	this.domain = parts.join('.');
	this.root = this.protocol + '//' + this.host;
	return this;
};

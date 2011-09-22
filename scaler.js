(function() {
	var scaler = window.scaler =  {};

	var shrink = function(src, w, h, cb) {
		var img = new Image();
		img.src = src;

		img.onload = function() {
		    var canvas = document.createElement('canvas');
			var dim = getDimensions(img.width, img.height, w, h);
			var ctx = canvas.getContext('2d');
		    
		    canvas.width = dim[0];
		    canvas.height = dim[1];
		    ctx.drawImage(img,0,0,dim[0],dim[1]);

		    cb(null, canvas.toDataURL());
		};
	};

	var getDimensions = function(originWidth, originHeight, w, h) {
		var ratio = originWidth/originHeight;

		if (originWidth > w || !h) {
			return [w, Math.round(w / ratio)];
		}
		if (originHeight > h || !w) {
			return [Math.round(w * ratio), h];
		}
		if (!w) {
			return [originWidth * h / originHeight, h];
		}

		return [w, h];
	};

	var hasCanvas = function (){
		return !!document.createElement('canvas').getContext;
	};

	var hasFileReader = function() {
		return typeof FileReader !== 'undefined';
	};

	scaler.supported = hasCanvas() && hasFileReader();

	scaler.scale = function(file, w, h, cb) {
		if (typeof file === 'string') {
			shrink(file, w, h, cb);
			return;
		}

		var filter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;

		if (!filter.test(file.type)) { 
			cb(new Error('file is not an image'), null);
			return;
		}

		var fr = new FileReader();
		fr.readAsDataURL(file);

		fr.onload = function() {
			shrink(fr.result, w, h, cb);
		};
	};

	return scaler;
})()
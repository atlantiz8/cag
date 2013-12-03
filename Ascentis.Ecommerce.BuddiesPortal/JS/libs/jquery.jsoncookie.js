(function ($) {
	var isObject = function (x) {
		return (typeof x === 'object') && !(x instanceof Array) && (x !== null);
	};
	
	$.extend({
		getJSONCookie: function (cookieName) {
			var cookieData = $.cookie(cookieName);
			return cookieData ? JSON.parse(cookieData) : {};
		},
		setJSONCookie: function (cookieName, data, options) {
			var cookieData = '';
			
			options = $.extend({
				expires: 90,
				path: '/'
			}, options);
			
			if (!isObject(data)) {	// data must be a true object to be serialized
				//throw new Error('JSONCookie data must be an object');
			}
			
			cookieData = JSON.stringify(data);
			
			return $.cookie(cookieName, cookieData, options);
		},
		removeJSONCookie: function (cookieName) {
			return $.cookie(cookieName, null);
		},
		JSONCookie: function (cookieName, data, options) {
			if (data) {
				$.setJSONCookie(cookieName, data, options);
			}
			return $.getJSONCookie(cookieName);
		}
	});
})(jQuery);

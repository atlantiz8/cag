(function() {		
	
	/* General methods/references: */
	
	// TOUCH hover/toggle methods/vars/references
	var CUR_HOVER;
	var _htmlBody = $("html, body");
	
	function is_touch_device() {
	  return !!('ontouchstart' in window);
	}
	var IS_TOUCH = is_touch_device();
	//	IS_TOUCH = true;
		
	function touchHoverHandler(e) {
			var tarHover = $(this);
			if (CUR_HOVER) CUR_HOVER.removeClass("hover");
			if (CUR_HOVER && CUR_HOVER[0] ===  tarHover[0]) {
				if (CUR_HOVER.hasClass("toggle")) {
					
					return;
				}
			}
			CUR_HOVER = tarHover;
				
			CUR_HOVER.addClass("hover");
			_htmlBody.bind("mousedown", function(e) { $(e.currentTarget).unbind("mousedown"); CUR_HOVER.removeClass("hover"); CUR_HOVER = null;  } );
			e.stopPropagation();
		
	};			
			
		

	// ----------------------------------------
		
	/**
	MASONARY LAYOUT LOGIC for Homepage
	*/
	var columnW = 250;
	var container;
	var items;
	var imgs = null;
	var lastAvailColumns = 0;
	var _window = $(window);
	
	//----------------------- CHANGI BUDDIES Functions ---------------------//
	
		
	$(document).ready( function() {   // STARt ready layout
	
		// TOUCH hover replacement -- UI Utilization
		if (IS_TOUCH) {
			var elems = $(".notouch");
			elems.removeClass("notouch");
			elems.bind("mousedown", touchHoverHandler);
		}
	
		var rng = new ParkMiller();
		rng.seed( Math.round(Math.random()*2147483647) );
	
		container =  $('.container');
				// hide container initially until masonary is up
		$(".container").css("display", "none");
		
		items =  container.children(".item");
		imgs = items.find("img.pimg");

		items.filter( function() { return $(this).hasClass("closable")} ).children(".btn-close").click( function() {
			$(this).parent().remove();
			container.masonry("reload");
		});
		
		var dimensions = [
		[240,240],  // square
		[240,160],  // portrait
		[240,329]  // landscape
		]
		//
		imgs.each( function() {
			var randIndex = Math.floor( rng.uniform()*3 );
			//$(this).width( randIndex
			var imgElem = $(this);
			var src = imgElem.attr("src");
			src = src.split("_");
			var srcDim = dimensions[randIndex];
			imgElem.data("id", src[0] );
			imgElem.data("width", srcDim[0]);
			imgElem.data("height", srcDim[1]);
			imgElem.parent().append($('<img class="loader" src="../img/ajax-loader.gif"></img>'));
		});
		
	
		container.masonry({
		  itemSelector: '.item:visible',
		  columnWidth: columnW,
		  gutterWidth: 0,
		  isResizable:false,
		  isFitWidth: false
		 
		});
		container.css("display", "block");
		_window.trigger("resize");
		
		
		/************************************************ For changi buddies **************************************/
		var filename = location.pathname.substr(location.pathname.lastIndexOf("/")+1,location.pathname.length);
		console.log(filename);
		$('li.topnavitem a').removeClass('active');
		var test = $('li.topnavitem a').filter(function(){ return $(this).html().toUpperCase() === "ABOUT"});
		console.log(test);
		switch(filename.toLowerCase()){
			case 'about.aspx': $('li.topnavitem a').filter(function(){ return $(this).html().toUpperCase() === "ABOUT"}).addClass('active'); break;
			case 'mywishlist.aspx': $('li.topnavitem a').filter(function(){ return $(this).html().toUpperCase() === "MY WISHLIST"}).addClass('active'); break;
			case 'friendwishlist.aspx': $('li.topnavitem a').filter(function(){ return $(this).html().toUpperCase() === "FRIENDS' WISHLISTS"}).addClass('active'); break;
			default: $('li.topnavitem a').filter(function(){ return $(this).html().toUpperCase() === "ABOUT"}).addClass('active'); break;
		}
		
		$.ajax({
		    type: "POST",
		    url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function (data) {
		        //data = $.parseJSON(data.d);
				console.log(data);
		    }
		});
	});
		
	/******** END DOCUMENT READY *********/
	
	
	 // Adjust sizing logic upon window resize
	var adjustSizing = function() { 
			var rng = new ParkMiller();
			rng.seed( Math.round(Math.random()*2147483647) );
			
			if (imgs ==null) return;
			
			
			function onImgLoaded() {
				//$(this).css("background-color", "auto");
				$(this).parent().removeClass("loading");
				
			}
			
			var w = container.width();
			var availableColumns = Math.floor((w)/ columnW);
			var upToCol = Math.floor( availableColumns  * .5 );
			if (upToCol < 0) upToCol = 0;
			if (upToCol > 3) upToCol = 3;
			
			var count;
			
			if (availableColumns != lastAvailColumns) {
				count = 4;
				rng.autoseed();
				
				imgs.each( function() {
					var elem = $(this);
				if (elem.hasClass("fixed")) return;
					if (upToCol > 0) count--;
					if (count <= 0) upToCol = 0;
					var dw = parseInt(elem.data("width"));
					var dh = parseInt(elem.data("height"));
			
					
					var imgW = 0;
					var addColumnsUsed = 0;
					imgW = columnW;
					imgW -= 10;
				
					
					var elemParent = elem.parent();
					elemParent.width(imgW);
					var ch = Math.round( dh * (imgW / dw) );

		
					
					var tarSrc = elem.data("id") + "_" + imgW+"x"+ch + ".jpg";
					if (elem.attr("src") != tarSrc) {
						elemParent.addClass("loading");
						elem.load( onImgLoaded );
						elem.attr("src", tarSrc);
					}
					

					
					elem.attr("width", imgW).attr("height", ch);
					
	
					
				});
				
				container.masonry("reload");
			}
			
			// align container
			var capW = _window.width();
				var tarW = (availableColumns * (columnW));
		
				tarW = Math.round((capW-tarW+8)*.5);
				var minW = 0;
				if (tarW < 4) {
					tarW = 4;
				}
				
			
				container.css("left", tarW+ "px");
				
			lastAvailColumns = availableColumns;
			
		};
	_window.resize( adjustSizing);
		
		
})();
		
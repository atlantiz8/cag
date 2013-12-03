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
			
			
	// -- UI initialization
		$(document).ready( function() {  // STARt ready
			
	
		
			// TOUCH hover replacement
			if (IS_TOUCH) {
				var elems = $(".notouch");
				elems.removeClass("notouch");
				elems.bind("mousedown", touchHoverHandler);
			}

            // ------------------ removed by ascentis Sandy 12/3/2013. -----start------------------------
			// FILTER BAR scroll locking
			///*
			//$("#filter").each( function() {
			//	var me = $(this);
			//	var topper = me.position().top;
			//	me.scrollToFixed({ marginTop: 0, limit: -topper});
			//});
			//*/

			// Slider price range
			//$( "#SliderPriceRange" ).slider({
            //range: true,
            //min: 1,
            //max: 500,
            //values: [ 60, 330 ],
            //slide: function( event, ui ) {
            //    $( "#SliderPriceRangeAmount" ).html( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			//	 $( "#SliderPriceRangeInput" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            //}
			//});
			
			
			//$( "#SliderPriceRangeInput" ).val( "$" + $( "#SliderPriceRange" ).slider( "values", 0 ) +
			//	" - $" + $( "#SliderPriceRange" ).slider( "values", 1 ) );
			//$( "#SliderPriceRangeAmount" ).html( "$" + $( "#SliderPriceRange" ).slider( "values", 0 ) +
			//	" - $" + $( "#SliderPriceRange" ).slider( "values", 1 ) );
            // ---------------------------removed by ascentis Sandy,12/3/2012---end------------------------------
			
		});		// eND READY
		

			
		/**
		MASONARY LAYOUT LOGIC for Homepage
		*/
		var SNAP_HEIGHT = false;  // no longer being used variant
	
		var columnW = 200;
		var marginer = 0;
		var container;
		var items;
		var promoItems;
		var imgs = null;
		var lastAvailColumns = 0;
		var _window = $(window);
		
		var curReplaced;
		var FIRST_ITEM_GONE = false;
		
		function checkForReplacement() {
				var replacer = $("#Replacer");
				//
				var i;
				var elem;
				var len = items.length;
				var w;
				var h;
				var landscape = replacer.hasClass("long");
				for (i=1; i< len; i++) {
					elem = $(items[i]);
					w = elem.width();
					h = elem.height();
					if ( landscape  ) {
						if (w > h)  break;
					}
					else if (w < h) {
						break;
					}
				}
				if (i >= len) {
				//	alert("no suitable replacement found to fill up space");
					return; 
				}
				if (curReplaced != null && curReplaced[0] === elem[0]) {
				//	alert("Replacemnet is the same");
					return; 
				}
				
				replacer.css("display", "block");
				if (curReplaced != null) curReplaced.css("display", "block");
				curReplaced = elem;
				elem.css("display", "none");
				var replacerDiv = $("#ReplacerDiv")
				replacerDiv.html( elem.html() );
				if (IS_TOUCH) {
					_htmlBody.trigger("mousedown");
					replacerDiv.find(".overlay").bind("mousedown", touchHoverHandler);
				}
				if (landscape) {
					replacerDiv.css("width", 390+"px");
					replacerDiv.children("img").css("width",  390+"px").css("height",  266+"px");
				}
				else {
					replacerDiv.css("width", 190+"px");
					replacerDiv.children("img").css("width",  190+"px").css("height",  266+"px");
				}
				
				container.masonry("reload");
			}
			
		
		$(document).ready( function() {   // STARt ready layout
		
			container =  $('#container');
					// hide container initially until masonary is up
			$("#container").css("display", "none");
			
			promoItems = container.find(".promotag");
			items =  container.children(".item");
			imgs = items.find("img");

			items.filter( function() { return $(this).hasClass("closable")} ).children(".btn-close").click( function() {
				$(this).parent().remove();
				container.masonry("reload");
			});
			
			
			$("#PromoTag .promotag.first .btn-close").click( function() { $(this).parent().remove(); FIRST_ITEM_GONE = true; checkForReplacement() } );
					
			container.masonry({
			  itemSelector: '.item:visible',
			  columnWidth: columnW,
			  gutterWidth: 0,
			  isResizable:false,
			  isFitWidth: false
			 
			});
			container.css("display", "block");
			_window.trigger("resize");

		});
		
		
		 // Adjust sizing logic upon window resize
		var adjustSizing = function() { 
			if (imgs ==null) return;
			
			var w = container.width();
			var availableColumns = Math.floor((w+marginer)/ columnW);
			var upToCol = Math.floor( availableColumns  * .5 );
			if (upToCol < 0) upToCol = 0;
			if (upToCol > 3) upToCol = 3;
			
			var count;
			
			if (availableColumns != lastAvailColumns) {
				count = 4;
				
				imgs.each( function() {
					var elem = $(this);
				if (elem.hasClass("fixed")) return;
					if (upToCol > 0) count--;
					if (count <= 0) upToCol = 0;
					var dw = parseInt(elem.data("width"));
					var dh =  parseInt(elem.data("height"));
			
					
					var imgW = dw > dh ? 2 : 1;
					imgW*=columnW;
				
					imgW -= 10;
					var elemParent = elem.parent();
					elemParent.width(imgW);
					var ch = dh * (imgW / dw);
					
					
					
					if (SNAP_HEIGHT) {  // no longer being used variant
						var parentHeight = Math.ceil(ch/columnW) * columnW   -10 ;
						elemParent.height(parentHeight);
						elem.css("margin-top", (parentHeight - ch)*.5 );
					}
					

					
					//elem.width(imgW ).height(ch);
					elem.attr("width", imgW).attr("height", ch);
				//	var btns  = elemParent.find(".overlay>.buttons");
				//	btns.css("top", Math.round(ch - btns.height() - 86)*.5 + "px" );
	
					
				});
				
			
				if ((availableColumns - 4) <  2 ) {
					promoItems.removeClass("long");
					if (FIRST_ITEM_GONE) checkForReplacement();
				}
				else   {
					promoItems.addClass("long");
					if (FIRST_ITEM_GONE) checkForReplacement();
				}
				
				
				container.masonry("reload");
			}
			
			var capW = _window.width();
				var tarW = (availableColumns * (columnW+marginer));
				//tarW = tarW  < 980 ? 980 : tarW;
				//container.css("width", (availableColumns * (columnW)) + "px");
				tarW = Math.round((capW-tarW+8)*.5);
				var minW = 0;
				if (tarW < 4) {
					
					//-tarW;
					tarW = 4;
				}
				
				//tarW += 5+ 5*minW;
				container.css("left", tarW+ "px");
				
			lastAvailColumns = availableColumns;
			
		};
		_window.resize( adjustSizing);
		
})();
		
$(document).ready(function(){
 
	$(function() {
	$('#overview').click(function(){
		if(!$('#overview h3 span').hasClass('down')){
			$('#overview h3 span').addClass('down');
			$('#overview p').slideDown();
		}else{
			$('#overview h3 span').removeClass('down');
			$('#overview p').slideUp();
		}

	});
		});
	$(function() {
		$('.overlay_wishlist').click(function(){
			$('#popup_wishlist').show();
			$('#overlay').show();

		});
	});
	
	$(function() {
	
		$('#wishlist_header p span').click(function(){
			$('#overlay').hide();
			$('#popup_wishlist').hide();

		});
		$('#ds_wishlist').click(function(){
			$('#overlay').hide();
			$('#popup_wishlist').hide();
			$('#wish_pop').show().delay(6000).slideUp();	
		});
	});

	$(function() {
	
		$('#share').click(function(){
			$('#fb_share').show();
			$('#overlay').show();

		});
		$('#fb_share_header p span').click(function(){
			$('#overlay').hide();
			$('#fb_share').hide();
		});
		
	});


		
	
});
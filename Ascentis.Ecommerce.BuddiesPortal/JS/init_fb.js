
/***************** Document Ready ********************/
$(document).ready(function () {
	console.log('document Ready');
    $.ajaxSetup({ cache: true });
	
	window.fbAsyncInit = function() {
		// init the FB JS SDK
		FB.init({
			appId      : '522474577834445',                        // App ID from the app dashboard
			status     : true,                                 // Check Facebook Login status
			xfbml      : true                                  // Look for social plugins on the page
		});

		// Additional initialization code such as adding Event Listeners goes here
	
		FB.getLoginStatus(function(response){
			console.log('got login status');
			console.log(response);
			if (response.status === 'connected') {
				$('#accesstoken').val(response.authResponse.accessToken);
                //$('#token-wrapper').show();
                FB.api('/me', function (response) {
                    if (response) load_user(response);
                    else $('#result').append('<br/>Load user data when init failed.');
                });
				console.log('user id: ' + response.authResponse.userID);
			} 
			else if (response.status === 'not_authorized') {
                FB.login(facebook_login, { scope: 'email,friends_status,user_status,publish_actions' });
			} 
			else {
				// the user isn't logged in to Facebook.
                FB.login(facebook_login, { scope: 'email,friends_status,user_status,publish_actions' });
			}
		});
	};

	// Load the SDK asynchronously
	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all/debug.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	
	$('#friendsUsingApp').dialog({
		autoOpen: false,
		dialogClass: 'friend-list',
		title: 'Friends using this app',
		hide: {
			effect: "fade",
			easing: "easeOutCirc",
			duration: 1000
		},
		show: {
			effect: "fade",
			easing: "easeInCirc",
			duration: 1000
		}
	});
	
});

/********************** Facebook Functions *******************/

function facebook_login(response) {
    if (response.authResponse) {
        console.log(response);
        console.log('Welcome!  Fetching your information.... ');
        //get_app_data();
        FB.api('/me', function (response) {
            console.log(response);
            console.log('Good to see you, ' + response.name + '.');
			load_user(response);
        });
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}




function load_user(response) {
    var id_tag = $('<div>').attr({ 'id': 'user-id' }).html(response.id);
    var firstname_tag = $('<div>').attr({ 'id': 'user-firstname' }).html(response.first_name);
    var lastname_tag = $('<div>').attr({ 'id': 'user-lastname' }).html(response.last_name);
    FB.api('/me?fields=picture', function (response) {
        var profilepic_tag = $('<img/>').attr({ 'id': 'user-pic', 'src': response.picture.data.url ,'onclick':'$("#friendsUsingApp").dialog("open");'}).appendTo('#userDetail');
    });

    $('#userDetail').append('User ID: ').append(id_tag).append('Firstname: ').append(firstname_tag).append('Lastname').append(lastname_tag);
	
	//load friends using this app
	load_friends();
}

function load_friends(){
	var query = 'SELECT uid, pic_small, name, profile_url FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1';
	FB.api('fql?q='+encodeURIComponent(query), function(response){
		console.log(response);
		//only show up to 7 friends
		for(var i=0; (i < 7 || i < response.data.length); i++){
			var user_tag = $('<a>').attr({'class':'user-div','href':response.data[i].profile_url,'id':response.data[i].uid})
				.html('<img src="'+response.data[i].pic_small+'">'+response.data[i].name);
			$('#friendsUsingApp').append(user_tag);
			$('#friendsUsingAppPreview').append('<img src="'+response.data[i].pic_small+'">');
			//$('div#overlay-container2 div.default div.content').append(user_tag);
		}
		
		//display "and # others."
		if(response.data.length > 7)$('#friendsUsingAppPreview').append('and '+ (response.data.length - 7) +' others.');
	});
}

function remove_publish_permission(){
	console.log('start remove publish permission');
	var permission = '/permissions/publish_actions';
	FB.api(
		'https://graph.facebook.com/me'+permission,
		'delete',
		function(response){
			if(response){
                $('#result').append('<br/>permission of '+permission+' removed');
				console.log('permission of '+permission+' removed');
				console.log(response);
			}
			else{
				console.log('something bad happened.');
				console.log(response);
			}
		}
	);
}

function remove_all_permission(){
	console.log('start remove all permission');
	var permission = '/permissions';
	FB.api(
		'https://graph.facebook.com/me'+permission,
		'delete',
		function(response){
			if(response){
                $('#result').append('<br/>permission of '+permission+' removed');
				console.log('permission of '+permission+' removed');
				console.log(response);
			}
			else{
				console.log('something bad happened.');
				console.log(response);
			}
		}
	);
}


/******************** Wishlist functions **************************/
var member_id = '10709';
var wishlist_url = 'http://buddies.ecomm.ascentis.com.sg/Wishlist/Wishlist.aspx?memberID=' + member_id;
function create_wishlist(){
	FB.login(facebook_login, {scope: 'email,friends_status,user_status,publish_actions'});
	
	FB.api(
		'me/changi_buddies:create',
		'post',
		{
			'wishlist': wishlist_url,
			'privacy': {value: 'ALL_FRIENDS'}
		},
		function(response){
			if(!response) alert('Error occured.');
			else if(response.error){
				$('#result').append('<br/>Create Wishlist ERROR: '+response.error.message);
				if(response.error.type == 'OAuthException'){
					$('#result').append('<br/>Permission not granted, please approve permission with login button.');
				}
			}
			else{
				//handle_response(response, 'create_wishlist');
				$('#result').append('<br/>Wishlist created. ID is ' + response.id + '. View console for the response.');
				$('#wishlistID').val(response.id);
			}
		}
	);
}

function publish_wishlist(){
	if(!$('#wishlistID').val() || $('#wishlistID').val()==''){
		console.log('no wishlist id to publish');
		return;
	}
	
	FB.api(
		'me/changi_buddies:create',
		'post',
		{
			'wishlist': $('#wishlistID').val()
		},
		function(response){
			if(!response) alert('Error occured.');
			else if(response.error){
				$('#result').append('<br/>Publishe Wishlist ERROR: '+response.error.message);
				if(response.error.type == 'OAuthException'){
					$('#result').append('<br/>Permission not granted, please approve permission with login button.');
				}
			}
			else{
				//handle_response(response, 'create_wishlist');
				$('#result').append('<br/>Wishlist Published. ID is ' + response.id + '. View console for the response.');
			}
		}
	);
}

function share_wishlist(){
	if(!$('#wishlistID').val() || $('#wishlistID').val()==''){
		console.log('no wishlist id to publish');
		return;
	}
	
	console.log('share wishlist start');
	
	window.open(
        'http://www.facebook.com/sharer.php?s=100&p[title]=My Wishlist&p[summary]=My Wishlist Description&p[url]='+wishlist_url+'&p[images][0]=https://fbcdn-photos-d-a.akamaihd.net/hphotos-ak-prn1/p74x74/851586_531503430264893_538310029_n.png',
        'facebook-share-dialog', 
        'width=626,height=436'
    ); 
	
//	FB.ui({
//		'method': 'feed',
//		'name': 'My wishlist',
//		'app_id': '522474577834445',
//		'link': wishlist_url,
//		'caption': 'Test caption of the link',
//		'fb:explicitly_shared': true,
//		'actions': { name:'Fulfill', link: wishlist_url + '&action=fulfill'},
//		'properties': {
//			'wishlist_id': $('#wishlistID').val(),
//			'wishlish_link': { text:'wishlist link', href:wishlist_url }
//		}
//	},
//	function(response){
//		$('#result').append('<br/>Call back from share wishlist. See console for response');
//		console.log(response);
//	});
}














/*********************** other functions *********************************/
function showPopup(title) {
	var tW = "auto";var tH = "auto";
	var holder = $("div#overlay-container2");
	holder.css({opacity:0, visibility:"hidden"}); 
	holder.css({height:$(document).height()});	

	var panelFree = holder.find("div.default");	
	panelFree.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });	
	panelFree.find("> div.header > h1").html(title); 
	//panelFree.find("> div.content").html(content);

	panelFree.find("> div.header > a.close.closing").click(function () {
		panelFree.find ("> div.header a.close.closing").unbind();
		TweenMax.to(holder, 1, {css:{autoAlpha:0} });
		TweenMax.to(panelFree, 1, {css:{autoAlpha:0} });	        
	});

	holder.css({display:"block"});
	panelFree.css({display:"block", width: tW, height:tH});		

	var tX = $(window).width()* 0.5 - panelFree.width() * .5;
	var tY = $(window).scrollTop() + $(window).height()* 0.5 - panelFree.height() * .5;
	panelFree.css({ left: tX, top: tY-200 });

	TweenMax.to(holder, 1, {css:{autoAlpha:1} });
	TweenMax.to(panelFree, 1, { css: { autoAlpha: 1} });
}  
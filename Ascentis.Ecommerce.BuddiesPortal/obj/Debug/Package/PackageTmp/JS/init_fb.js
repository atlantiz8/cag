
/***************** Document Ready ********************/
$(document).ready(function () {
	console.log('document Ready');
    $.ajaxSetup({ cache: true });
    //$.getScript('//connect.facebook.net/en_UK/all.js', function () {
	window.fbAsyncInit = function() {
        FB.init({
            appId: '522474577834445',
            channelUrl: 'channel.html',
            status: true,
            xfbml: true
        });
        /*FB.Event.subscribe('auth.statusChange', function (response) {
			console.log(response);
		});*/
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
        /*FB.Event.subscribe('auth.authResponseChange', function (response) {
            // do something with response
            console.log('authResponseChange triggered:');
            console.log(response);


            if (response.status == 'connected') {
                $('#accesstoken').val(response.authResponse.accessToken);
                //$('#token-wrapper').show();
                FB.api('/me', function (response) {
                    if (response) load_user(response);
                    else $('#result').append('<br/>Load user data when init failed.');
                });
                //get_app_data();
            }
            else {
            }
        });*/

    }
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
        var profilepic_tag = $('<img/>').attr({ 'id': 'user-pic', 'src': response.picture.data.url }).appendTo('#userDetail');
    });

    $('#userDetail').append('User ID: ').append(id_tag).append('Firstname: ').append(firstname_tag).append('Lastname').append(lastname_tag);
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
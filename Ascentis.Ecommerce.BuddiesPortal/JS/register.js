function Register (targ){
	//rewardsPanel
	var target = targ;
	this.init = init;

	var IsValidCRM = false;
	var CRMAuthResponse;
	var crDefault = "Last 11 digits of your card";
	var fnameDefault = "First Name";
	var lnameDefault = "Last Name";

	var currentOrderAutoID = ''; 

	function init() {
	    loadCalendar();
	    initPassportNumSection();

	    //registration page   
	    if (target.html() != undefined) {
	        //target.find("div.buttons a.notBt").click(notMemberClick);
	        target.find("div.buttons a.loginBt").click(loginClick);
	        $("#wrapper").find("div.buttons a.clearBt").click(clearClick);
	        $("#wrapper").find("div.buttons a.createAcctBt").click(
                function () {
                    if (currentOrderAutoID > 0) {
                        if (IsValidCRM == false) {
                            modal.showConfirm("Changi Rewards", "You have not entered your Changi Rewards details, reward points for the placed order will not be awarded. Are you sure you want to continue?",
                            createAcctClick, function () { $("#wrapper div.rewardsPanel div.m_content.login").find(" input[name=cardno]").focus(); return false; }, 430, 100, "Yes, continue without CR", "No, I will enter my CR");
                        } else { createAcctClick(); }
                    } else { createAcctClick(); }

                });
	        //target.find("div.m_content.login").find(" input[name=cardno]").focus();
	        $("#wrapper").find("div.boxleft").find(" select[name='salutation']").focus();
	        loadLists(true, true, true);

	        currentOrderAutoID = getQueryString("orderid");
	        if ($.isNumeric(currentOrderAutoID)) {
	            currentOrderAutoID = parseInt(currentOrderAutoID);
	            if (currentOrderAutoID > 0) {
	                loadGuestProfile();
	            }
	        }

	        $(".withDefault").click(function () {
	            var name = $(this).attr("name");
	            var defaultText = (name == "given name" ? fnameDefault : name == "family name" ? lnameDefault : crDefault);
	            if ($(this).val() == defaultText) { $(this).val(""); }
	            $(this).css("color", "#000");
	        });

            $(".withDefault").focusout(function () {
                var name = $(this).attr("name");
                var defaultText = (name == "given name" ? fnameDefault : name == "family name" ? lnameDefault : crDefault);
                if ($(this).val() == "") { $(this).val(defaultText); $(this).css("color", "#838383"); }
            });

	    }
        //edit account/change password page
	    else {
	        target = $("div.grid_16");
	        var type = getQueryString("t");	        
	        if (type != null) {
	            if (type == 1) {                    
	                $("div.editacct").css("display", "block");
	                $('div.newsletter').css("display", "block");
	                $("div.changePwd").css("display", "none");
	                $("div.linkAcct").css("display", "none");
	                loadMemberProfile();
	                loadLists(true, true, true);
	                target.find("div.buttons a.saveAcct").click(editAccount);
	            } else if (type == 2) {
	                $("div.editacct").css("display", "none");
	                $('div.newsletter').css("display", "none");
	                $("div.changePwd").css("display", "block");
	                $("div.linkAcct").css("display", "none");
	                target.find("div.buttons a.saveAcct").click(changePwd);
	            }
	        }
	    }

	    $(" .numeric").each(function () {
	        $(this).keydown(function (event) {	            
	            if (event.shiftKey) {
	                event.preventDefault();
	                return false;
	            }
	            else {
	                var input = parseInt(event.keyCode);
	                if ((input >= 48 && input <= 58) || input == 8 || input == 46 || input == 37 || input == 39 || input == 9) {
	                }
	                else {
	                    event.preventDefault();
	                    return false;
	                }
	            }
	        });
	    });

	    $(" .required").each(function () {
	        $(this).change(function () {
	            if ($(this).val() != '') {
	                if ($(this).parent().find("div.errormsg").css("display") == 'block') {
	                    $(this).parent().find("div.errormsg").remove();
	                }
	            }
	        });
	    });

	    $("div.login input").each(function () {
	        $(this).change(function () {	          
	            if ($(this).val() != '') {
	                if ($("div.login input[name='password']").parent().find("div.error").css("display") == 'block') {
	                    $("div.login input[name='password']").parent().find("div.error").remove();
	                }
	            }
	        });
	    });

	    $("#termsconditions").change(function () {
	        if ($('#termsconditions').attr('checked')) {
	            $("div.termserr").remove();
	        }
	    });

	    var passport = $(" input[name='passportnum']");
	    passport.change(function () {
	        passport = $(" input[name='passportnum']");
	        passport.val(passport.val().toUpperCase());
	    });
	}

	function initPassportNumSection() {
	    if (isPassportMandatory != null && isPassportMandatory == "1") {
	        $("#wrapper").find("div.boxleft").find(" input[name='passportnum']").addClass('required').prev().html("Passport *");
	    } else {
	        $("#wrapper").find("div.boxleft").find(" input[name='passportnum']").removeClass('required').prev().html("Passport");
	    }
	}

	function loadLists(isCountry, isNationality, isCountryCode) {	    
	    $.ajax({
	        type: "POST",
	        url: wsHubPath + "WSHub/wsMember.asmx/GetLists",
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function (data) {
	            var objResult = $.parseJSON(data.d);
	            objResult = $.parseJSON(objResult);
	            if (objResult != null) {
	                if (isCountry) {
	                    $("#wrapper").find("div.boxright").find(" select[name='country']").empty();
	                    $("#wrapper").find("div.boxright").find(" select[name='country']").append("<option>&nbsp;</option>");
	                    $.each(objResult.country, function (i, item) {
	                        $("#wrapper").find("div.boxright").find(" select[name='country']").append("<option>" + item.option + "</option>");
	                    });
	                }

	                if (isNationality) {
	                    $("#wrapper").find("div.boxleft").find(" select[name='nationality']").empty();
	                    $("#wrapper").find("div.boxleft").find(" select[name='nationality']").append("<option></option>");
	                    $.each(objResult.nationality, function (i, item) {
	                        $("#wrapper").find("div.boxleft").find(" select[name='nationality']").append("<option>" + item.option + "</option>");
	                    });
	                }

	                if (isCountryCode) {                        
	                    $("#wrapper").find("div.boxleft").find(" select[name='countrycode']").empty();
	                    $("#wrapper").find("div.boxleft").find(" select[name='countrycode']").append("<option value=''>&nbsp;</option>");
	                    $.each(objResult.countrycode, function (i, item) {
	                        $("#wrapper").find("div.boxleft").find(" select[name='countrycode']").append("<option value='" + item.value + "'>" + item.option + "</option>");
	                    });
	                }
	                
	            }
	        }
	    });
	}

    function loadCalendar() {
        $("#yearPicker").empty();
        $("#mthPicker").empty();
        $("#dayPicker").empty();
        $("#yearPicker").append("<option />");
        $("#mthPicker").append("<option />");
        $("#dayPicker").append("<option />");
        for (i = new Date().getFullYear(); i > 1900; i--) {
            $("#yearPicker").append($('<option />').val(i).html(i));
        }
        var month = ["Jan", "Feb", "Mar", "Apr","May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (var i = 0; i < month.length; i++) {
            $("#mthPicker").append($('<option />').val(i+1).html(month[i]));
        }
        for (var i = 1; i <= 31; i++) {
            $("#dayPicker").append($('<option />').val(i).html(i));
        }

    }

    function createReCaptcha() {
        Recaptcha.create(publicKey,
        "recaptcha",
        {
            theme: "red",
            lang: 'en'
        }
      );
    }


	function notMemberClick (e) {
		//console.log("register.init");
		e.preventDefault();
		var tLoginPanel = target.find ("div.m_content.login");
		var tMsgPanel = target.find("div.m_content.message");
		//$("#wrapper").find("div.boxleft").find(" input[name='email address']").focus();
		$("#wrapper").find("div.buttons a.createAcctBt").removeClass("disabled");

		var bts = $(this).parent().find("a.notBt");
		
		TweenMax.to(bts, 0.6, { css: { autoAlpha: 0 }, ease: Power4.easeOut });
		tMsgPanel.css({ visible: "hidden", opacity: 0, display: "block" });
		TweenMax.to(tMsgPanel, 1.8, { css: { autoAlpha: 1 }, ease: Power4.easeOut });

//		TweenMax.to(tLoginPanel, 0.6, {css:{autoAlpha:0}, ease:Power4.easeOut, onComplete:function (){
//			//tLoginPanel.css({ display:"none"});
//			tMsgPanel.css({visible:"hidden", opacity:0, display:"block"});
//			TweenMax.to(tMsgPanel, 1.8, {css:{autoAlpha:1}, ease:Power4.easeOut});
//        } 
//        });
        IsValidCRM = false;
    }

	function loginClick (e) {
		e.preventDefault();
		var self = $(this);
		self.find("div.text").css({display:"none"});
		self.find("div.loader").css({display:"block"});
		
		var tLoginPanel = target.find ("div.m_content.login");
		tLoginPanel.find("div.error").css({display:"none"});
		
		var tUser  = tLoginPanel.find (" input[name=cardno]").val();
		var tPass  = tLoginPanel.find (" input[name=password]").val();

		if (tUser == '' || tPass == '' || tUser == crDefault) {
		    //modal.showFree("Information", "Please input your card number and password.", CallbackFunction, 400, 100);
		    var msg = "<div class='error' style='color:red;margin-left:20px;margin-top:4px'>Invalid card number or password.</div>";
		    tLoginPanel.find(" input[name='password']").parent().append(msg);
		    tLoginPanel.find(" input[name=cardno]").focus();
		    resetButtons("#wrapper");
		    return;
		}

		tUser = $("#cardPrefix").text() + tUser; tUser = tUser.replace(/\-/g, ''); ;
		var sData = {cardNo: tUser, password:tPass};

		//console.log(JSON.stringify(sData) );

		$("#wrapper").find("div.buttons a.loginBt").addClass("disabled");
		$("#wrapper").find("div.buttons a.loginBt").css("cursor", "default");

		$.ajax({
		    type: "POST",
            data: JSON.stringify(sData),
		    url:  wsHubPath + "WSHub/wsMember.asmx/Authenticate_CRMMember",
		    contentType: "application/json; charset=utf-8",
		    dataType: "json"
		}).done(loginLoadDone) ;

	}
	function loginLoadDone(tData) {
	    var objResult = $.parseJSON(tData.d);
		var panelBt = target.find ("div.buttons a.loginBt")
		panelBt.find("div.text").css({display:"block"});
		panelBt.find("div.loader").css({display:"none"});

		$("#wrapper").find("div.buttons a.loginBt").removeClass("disabled");

		if (objResult != null) {
		    if (objResult == "EXISTS") {
		        
		        IsValidCRM = false;
		        var tLoginPanel = target.find("div.m_content.login div.error");
		        target.find("div.m_content.login div.error").html("");
		        target.find("div.m_content.login div.error").html("Card is already registered with eCommerce. Please use another card number.").css("margin-left","20px").css("width","420px");
		        tLoginPanel.css({ display: "block" });
		    }
		    else {
		        target.find("div.m_content.login div.error").html("Invalid Card Number or NRIC/FIN.").css("margin-left","20px");
		        
		        switch (objResult.IsValid) {
		            case true:
		                IsValidCRM = true;
		                CRMAuthResponse = objResult;
		                loginSuccessful(tData);
		                break;
		            case false:
		                IsValidCRM = false;
		                var tLoginPanel = target.find("div.m_content.login div.error");
		                tLoginPanel.css({ display: "block" });
		                //panel.find("div.content div.error").css({display:"block"});
		                break;
		        }
		    }
		}
	}
	function loginSuccessful (tData){
		var tLoginPanel = target.find ("div.m_content.login");
		var tMsgPanel = target.find ("div.m_content.loginmessage");
		//$("#wrapper").find("div.boxleft").find(" input[name='email address']").focus();
		
        var tMsgPanel1 = target.find("div.m_content.message");
        tMsgPanel1.css({ display: "none" });        

		var bts =   target.find ("div.buttons");
		TweenMax.to(bts, 0.6, {css:{autoAlpha:0}, ease:Power4.easeOut } ) ; 
		TweenMax.to(tLoginPanel, 0.6, {css:{autoAlpha:0}, ease:Power4.easeOut, onComplete:function (){
			tLoginPanel.css({ display:"none"});
			tMsgPanel.css({visible:"hidden", opacity:0, display:"block"});
			TweenMax.to(tMsgPanel, 1.8, {css:{autoAlpha:1}, ease:Power4.easeOut});
        }});

    }

    function createAcctClick(e) {
        //e.preventDefault();

        if ($("#wrapper").find("div.buttons a.createAcctBt").hasClass("disabled")) return;
        if ($("#wrapper").find("div.buttons a.createAcctBt").find("div.loader").css("display") == "block") return;

        var self = $("#wrapper").find("div.buttons a.createAcctBt");
        self.find("div.text").css({ display: "none" });
        self.find("div.loader").css({ display: "block" });

        var panel = $("#wrapper").find("div.boxleft.main");
        var panelRight = $("#wrapper").find("div.boxright");
        var eMail = panel.find(" input[name='email address']").val();
        var password = panel.find(" input[name='password']").val();
        var verifyPword = panel.find(" input[name='verify password']").val();
        var salutation = panel.find(" select[name='salutation']").val();
        var familyName = panel.find(" input[name='family name']").val();
        var givenName = panel.find(" input[name='given name']").val();
        var securityQ = panel.find(" select[name='securityQuestion']").val();
        var securityA = panel.find(" input[name='security answer']").val();
        var passportNo = panel.find(" input[name='passportnum']").val();
        if (passportNo != '') passportNo = passportNo.toUpperCase();

        var birthDate = $("#yearPicker").val() + '/' + $("#mthPicker").val() + '/' + $("#dayPicker").val();
        var gender = "";  //panel.find(" select[name='gender']").val();
        var ctrycode = panel.find(" select[name='countrycode']").val();
        var contact =  panel.find(" input[name='contact']").val();
        var mobile = "";  //$("#wrapper").find("div.boxright").find(" input[name='mobile']").val();
        var newsLetter = $('#newsletter').attr('checked') ? 1 : 0;
        var termsCondition = $('#termsconditions').attr('checked') ? 1 : 0;

        var nationality = panel.find(" select[name='nationality']").val();
        var country = panelRight.find(" select[name='country']").val();
        var address1 = panelRight.find(" input[name='address1']").val();
        var address2 = panelRight.find(" input[name='address2']").val();
        var city = panelRight.find(" input[name='city']").val();
        var zipcode = panelRight.find(" input[name='zipcode']").val();
        var captcha = $("div.captcha").find(" input[name='captcha']").val();
                
        $("div.errormsg").remove();
        var errormsg = "<div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>{msg}</div>";
        var msg = "";

        if (captcha == '') {
            msg = errormsg.replace("{msg}", "CAPTCHA is required.");
            $("div.captcha").find(" input[name='captcha']").parent().append(msg);
            $("div.captcha").find(" input[name='captcha']").focus();
        }

        if (nationality == '') {
            msg = errormsg.replace("{msg}", "Nationality is required.");
            panel.find(" select[name='nationality']").parent().append(msg);
            panel.find(" select[name='nationality']").focus();
        }

        if ($("#yearPicker").val() == '' || $("#mthPicker").val() == '' || $("#dayPicker").val() == '') {
            msg = "<div class='fieldtitle alpha errormsg'><div class='errormsg'>Date of Birth is required.</div></div>";
            $("#dayPicker").parent().append(msg).find(".fieldtitle.alpha.errormsg").first().css("height", "25px").css("margin-left", "120px").css("margin-top", "-9px");
            $("#mthPicker").focus();
        }

        if ((isPassportMandatory != null && isPassportMandatory == "1") && passportNo == '') {
            msg = errormsg.replace("{msg}", "Passport No. is required.");
            panel.find(" input[name='passportnum']").parent().append(msg);
            panel.find(" input[name='passportnum']").focus();
        }

        if (passportNo != '' && !isValidPassportNum(passportNo)) {
            msg = errormsg.replace("{msg}", "Invalid passport number.");
            panel.find(" input[name='passportnum']").parent().append(msg);
            panel.find(" input[name='passportnum']").focus();
        }


        if (ctrycode == '' || contact == '') {
            msg = errormsg.replace("{msg}", "Contact Number is required.");
            panel.find(" input[name='contact']").parent().append(msg);
            panel.find(" input[name='contact']").focus();
        }

//        if (gender == '') {
//            msg = errormsg.replace("{msg}", "Gender is required.");
//            panel.find(" select[name='gender']").parent().append(msg);
//            panel.find(" select[name='gender']").focus();
//        }       

        if (securityQ == '') {
            msg = errormsg.replace("{msg}", "Security Question is required.");
            panel.find(" select[name='securityQuestion']").parent().append(msg);
            panel.find(" select[name='securityQuestion']").focus();
        }

        if (securityA == '') {
            msg = errormsg.replace("{msg}", "Security Answer is required.");
            panel.find(" input[name='security answer']").parent().append(msg);
            panel.find(" input[name='security answer']").focus();
        }

        if (password != '' && verifyPword != '' && password != verifyPword) {
            msg = errormsg.replace("{msg}", "Passwords do not match. Please check that your passwords match.");
            panel.find(" input[name='verify password']").parent().append(msg).find(".fieldtitle.alpha.errormsg").first().css("height", "30px");
            panel.find(" input[name='verify password']").focus();
        }

        if (verifyPword == '') {
            msg = errormsg.replace("{msg}", "Verify Password is required.");
            panel.find(" input[name='verify password']").parent().append(msg);
            panel.find(" input[name='verify password']").focus();
        }

        if (password == '') {
            msg = errormsg.replace("{msg}", "Password is required.");
            panel.find(" input[name='password']").parent().append(msg).find(".fieldtitle.alpha.errormsg").first().css("height", "25px");
            panel.find(" input[name='password']").focus();
        } else {
            if (!isValidPassword(password)) {
                msg = errormsg.replace("{msg}", "Password provided is not valid.<br />");
                panel.find(" input[name='password']").parent().append(msg);
                panel.find(" input[name='password']").focus();
                $(".errormsg").css("height", "30px");
            }
        }

        if (eMail == '') {
            msg = errormsg.replace("{msg}", "Email Address is required.");
            panel.find(" input[name='email address']").parent().append(msg);
            panel.find(" input[name='email address']").focus();
        }
        else {
            if (!isValidEmail(eMail)) {
                msg = errormsg.replace("{msg}", "Invalid email address.");
                panel.find(" input[name='email address']").parent().append(msg);
                panel.find(" input[name='email address']").focus();
            }
        }

        if (givenName == '' || familyName == '' || salutation == '' || givenName == fnameDefault || familyName == lnameDefault) {
            if (salutation == '') {
                msg = errormsg.replace("{msg}", "Salutation is required.");
                panel.find(" select[name='salutation']").parent().append(msg);
                panel.find(" select[name='salutation']").focus();
            } else if (givenName == '' || familyName == '' || givenName == fnameDefault || familyName == lnameDefault) {
                msg = errormsg.replace("{msg}", "Name is required.");
                panel.find(" input[name='given name']").parent().append(msg);
                panel.find(" input[name='given name']").focus();
            }
        }

        if (msg != '') {
            if (msg.search("Passwords do not match") > -1) {
                modal.showFree("Warning", "Passwords do not match. Please check that your passwords match.", CallbackFunction, "auto", 100);
            }
            else {
                modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
            }
            resetButtons("#wrapper");
            return;
        }
        
        if (termsCondition == 0) {
            msg = "Agreement with the terms and conditions is required.";
            $('div.terms').append('<div class="errormsg termserr" style="margin-left:36px;">Agreement with the terms and conditions is required.</div>');
            $('#termsconditions').focus();
            modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
            resetButtons("#wrapper");
            return;
        }

        //var data = { privatekey: privateKey, remoteip: ip, challenge: chal, response: resp }
        var data = { captcha: captcha }
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/VerifyCaptcha",
            data: JSON.stringify(data),
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (output) {
                output = JSON.stringify(output);
                if (output.indexOf('true') != -1) {                    
                    //country = country.indexOf("Select") >= 0 ? "" : country;
                    var crmData = null;
                    var crmCard = $("#wrapper div.rewardsPanel div.m_content.login").find(" input[name=cardno]").val();
                    if (crmCard != null && crmCard != "") { crmCard = "00002001" + crmCard.replace(/\-/g, ''); }
                    if (CRMAuthResponse != null) {
                        crmData = JSON.stringify(CRMAuthResponse);
                    }
                    contact = ctrycode + contact;
                    var sData = { IsCRMMember: IsValidCRM, UserID: eMail, Password: password, Salutation: salutation, FName: givenName, LName: familyName, PasswordSecurityQuestionId: securityQ, PasswordSecurityAnswer: securityA,
                        PassportNumber: passportNo, DateofBirth: birthDate, Gender: gender, ContactNo: contact, MobileNo: mobile, Address1: address1, Address2: address2, PostalCode: zipcode,
                        Nationality: nationality, City: city, Country: country, NewsLetter: newsLetter, CRMAuthResponse: crmData, CRMCard: crmCard, OrderID: currentOrderAutoID
                    };

                    $.ajax({
                        type: "POST",
                        url: wsHubPath + "WSHub/wsMember.asmx/CreateMemberProfile",
                        data: JSON.stringify(sData),
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: createDone,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            //console.log("error:" + errorThrown);
                        }
                    });

                }
                if (output.indexOf('false') != -1) {
                    //Recaptcha.reload();
                    $("#recaptcha").append("<div class='errormsg'>Invalid CAPTCHA.</div>");
                    modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);
                    $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                    $("div.captcha").find(" input[name='captcha']").focus();
                    resetButtons("#wrapper");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //Recaptcha.reload();
                $("#recaptcha").append("<div class='errormsg'>Invalid CAPTCHA.</div>");
                modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);
                $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                $("div.captcha").find(" input[name='captcha']").focus();
                resetButtons("#wrapper");
            }
        });

    }

    function createDone(msg) {
        resetButtons("#wrapper");
        if (msg.d != null) {
            if (msg.d > 0) {
                modal.showFree("Registration successful", "Registration successful.<br />An activation link is sent to your registered email for your verification.<br />The email may be in your junk or spam folder.", function () { window.location.href = "../Default.aspx"; }, "auto", 135);
            }
            else if (msg.d == -2) {
                $("#wrapper").find("div.boxleft").find(" input[name='email address']").focus();
                modal.showFree("Information", "The email address you have entered is already in use.", CallbackFunction, "auto", 100);
            }
            else if (msg.d == -3) {
                $("#wrapper").find("div.boxleft").find(" input[name='email address']").focus();
                modal.showFree("Information", "This card number has been registered to another account.", CallbackFunction, "auto", 100);
            }
            else if (msg.d == -4) {
                $("#wrapper").find("div.boxleft").find(" input[name='passportnum']").focus();
                modal.showFree("Information", "Passport and Date of Birth information provided is already registered.", CallbackFunction, "auto", 100);
            }
            else {
                modal.showFree("Information", "Sorry, we were unable to create your account, Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110);
            }
        }
    }

    function clearClick(e) {
        e.preventDefault();

        var panel = $("#wrapper").find("div.boxleft");
        panel.find(" input[name='email address']").val('');
        panel.find(" input[name='password']").val('');
        panel.find(" input[name='verify password']").val('');
        panel.find(" select[name='salutation']").val('Mr');
        panel.find(" input[name='family name']").val('');
        panel.find(" input[name='given name']").val('');
        panel.find(" select[name='securityQuestion']").val(1);
        panel.find(" input[name='security answer']").val('');
        panel.find(" input[name='passportnum']").val('');
        panel.find(" select[name='gender']").val('Male');
        panel.find(" select[name='nationality']").val('');
        panel.find(" select[name='country']").val('');
        panel.find(" input[name='address1']").val('');
        panel.find(" input[name='address2']").val('');
        panel.find(" input[name='city']").val('');
        panel.find(" input[name='zipcode']").val('');
        $("#wrapper").find("div.boxright").find(" input[name='contact']").val('');
        $("#wrapper").find("div.boxright").find(" input[name='mobile']").val('');
        loadCalendar();
        //Recaptcha.reload();
    }

    function resetButtons(targ) {
        $(targ).find("div.text").css({ display: "block" });
        $(targ).find("div.loader").css({ display: "none" });        
    }

    function loadGuestProfile() {
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/GetGuestDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var objResult = $.parseJSON(data.d);
                if (objResult != null && objResult != undefined) {
                    var holder = $('#wrapper').find("div.boxleft.main");

                    var name = objResult.Name.split(" ");
                    if (name != undefined && name.length > 0) {
                        var l = name.length, fname = '', gname = '';
                        fname = name[l - 1];
                        for (var i = l - 2; i >= 0; i--) {
                            gname = name[i] + ' ' + gname;
                        }
                        fname = $.trim(fname);
                        gname = $.trim(gname);
                        holder.find(" input[name='family name']").val(fname);
                        holder.find(" input[name='given name']").val(gname);
                    }

                    holder.find(" input[name='email address']").val(objResult.Email);
                    holder.find(" input[name='passportnum']").val(objResult.Passport);

                    var bdate = objResult.DateOfBirth.split(" "); //DateOfBirth format: dd M yy.Sample: 28 Sep 1984
                    if (bdate[0].substring(0, 1) == 0) { bdate[0] = bdate[0].substring(2, 1); }
                    //if (bdate[1].substring(0, 1) == 0) { bdate[1] = bdate[1].substring(2, 1); }
                    $("#dayPicker").val(bdate[0]);
                    $("#mthPicker option").each(function () {
                        $(this).attr('selected', $(this).text() == bdate[1] ? 'selected' : null);
                    });
                    $("#yearPicker").val(bdate[2]);

                    if (objResult.IsAllowPromotion != null && objResult.IsAllowPromotion == 1) {                        
                        $('#newsletter').attr('checked', true);
                    }
                }
            }
        });
    }

    function loadMemberProfile() {
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/GetMemberProfile",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var objResult = $.parseJSON(data.d);
                if (objResult != null && objResult != undefined) {
                    var holder = target.find("div.boxleft");
                    holder.find(" input[name='email']").val(objResult.email);
                    target.find("div.boxleft").find(" input[name='passportnum']").val(objResult.passport);
                    holder.find(" input[name='contact']").val(objResult.contactNo);
                    //holder.find(" input[name='mobile']").val(objResult.mobileNo);
   
                    if (objResult.newsLetter == "True") {
                        $('#editNewsLetter').attr('checked', 'checked');
                    }
                    var bdate = objResult.birthday.split("-");
                    if (bdate[0].substring(0, 1) == 0) { bdate[0] = bdate[0].substring(2, 1); }
                    if (bdate[1].substring(0, 1) == 0) { bdate[1] = bdate[1].substring(2, 1); }
                    $("#mthPicker").val(bdate[0]);
                    $("#dayPicker").val(bdate[1])
                    $("#yearPicker").val(bdate[2]);

                    var panelRight = $("div.editacct").find("div.boxright");
                    panelRight.find(" select[name='country']").val(objResult.country);
                    panelRight.find(" input[name='address1']").val(objResult.address1);
                    panelRight.find(" input[name='address2']").val(objResult.address2);
                    panelRight.find(" input[name='city']").val(objResult.city);
                    panelRight.find(" input[name='zipcode']").val(objResult.postalcode);
                }
            }
        });
    }

    function editAccount() {
        $("div.grid_16").find("div.text").css({ display: "none" });
        $("div.grid_16").find("div.loader").css({ display: "block" });

        var panelLeft = $("div.editacct").find("div.boxleft");
        var panelRight = $("div.editacct").find("div.boxright");
        var eMail = panelLeft.find(" input[name='email']").val();
        var passportNo = panelLeft.find(" input[name='passportnum']").val();
        if (passportNo != '') passportNo = passportNo.toUpperCase();

        var birthDate = $("#yearPicker").val() + '/' + $("#mthPicker").val() + '/' + $("#dayPicker").val();
        //var ctrycode = panelLeft.find(" select[name='countrycode']").val();
        var contact = panelLeft.find(" input[name='contact']").val();
        var mobile = "";  //panelLeft.find(" input[name='mobile']").val();
        var newsLetter = $('#editNewsLetter').attr('checked') ? 1 : 0;

        var country = panelRight.find(" select[name='country']").val();
        var address1 = panelRight.find(" input[name='address1']").val();
        var address2 = panelRight.find(" input[name='address2']").val();
        var city = panelRight.find(" input[name='city']").val();
        var zipcode = panelRight.find(" input[name='zipcode']").val();

        var captcha = $("div.captcha").find(" input[name='captcha']").val();

        $(".errormsg").remove();        
        var errormsg = "<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>{msg}</div>";
        var msg = "";

        if (captcha == '') {
            msg = errormsg.replace("{msg}", "CAPTCHA is required.");
            $("div.captcha").find(" input[name='captcha']").parent().append(msg);
            $("div.captcha").find(" input[name='captcha']").focus();
        }

        if (contact == '') {
            msg = errormsg.replace("{msg}", "Contact Number is required.");
            panelLeft.find(" input[name='contact']").parent().append(msg);
            panelLeft.find(" input[name='contact']").focus();
        } else {
            if (!isValidContactNum(contact)) {              
                msg = errormsg.replace("{msg}", "Invalid contact number.");
                panelLeft.find(" input[name='contact']").parent().append(msg);
                panelLeft.find(" input[name='contact']").focus();
            }
        }

//        if (mobile != '' && !isValidContactNum(mobile)) {
//            msg = errormsg.replace("{msg}", "Invalid mobile number.");
//            panelLeft.find(" input[name='mobile']").parent().append(msg);
//            panelLeft.find(" input[name='mobile']").focus();
//        }

        if ($("#yearPicker").val() == '' || $("#mthPicker").val() == '' || $("#dayPicker").val() == '') {
            msg = "<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'><div class='errormsg'>Date of Birth is required.</div></div>";
            //msg = errormsg.replace("{msg}", "Date of Birth is required.");
            $("#yearPicker").parent().append(msg).find(".fieldtitle.alpha.errormsg").first().css("margin-left", "-192px").css("margin-top", "8px");
            $("#mthPicker").focus();
        }

        if ((isPassportMandatory != null && isPassportMandatory == "1") && passportNo == '') {
            msg = errormsg.replace("{msg}", "Passport No. is required.");
            panelLeft.find(" input[name='passportnum']").parent().append(msg);
            panelLeft.find(" input[name='passportnum']").focus();
        }

        if (passportNo != '' && !isValidPassportNum(passportNo)) {
            msg = errormsg.replace("{msg}", "Invalid passport number.");
            panelLeft.find(" input[name='passportnum']").parent().append(msg);
            panelLeft.find(" input[name='passportnum']").focus();
        }

        if (eMail == '') {
            msg = errormsg.replace("{msg}", "Email Address is required.");
            panelLeft.find(" input[name='email']").parent().append(msg);
            panelLeft.find(" input[name='email']").focus();
        }
        else {
            if (!isValidEmail(eMail)) {
                msg = errormsg.replace("{msg}", "Invalid email address.");
                panelLeft.find(" input[name='email']").parent().append(msg);
                panelLeft.find(" input[name='email']").focus();
            }
        }

        if (msg != '') {
            modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
            resetButtons("div.grid_16");
            return;
        }

//        var chal = Recaptcha.get_challenge();
        //        var resp = Recaptcha.get_response();        

//        if (resp == '') {
//            $("#recaptcha").append("<div class='errormsg'>CAPTCHA is required.</div>");
//            modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
//            $("#recaptcha_response_field").focus();
//            resetButtons("div.grid_16");
//            return;
//        }

        //var data = { privatekey: privateKey, remoteip: ip, challenge: chal, response: resp }
        var data = { captcha: captcha}

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/VerifyCaptcha",
            data: JSON.stringify(data),
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (output) {
                //console.log(output);
                output = JSON.stringify(output);
                if (output.indexOf('true') != -1) {                    
                    var sData = { EmailAdd: eMail, Passport: passportNo, BirthDate: birthDate, ContactNo1: contact, ContactNo2: mobile, NewsLetter: newsLetter, Address1: address1, Address2: address2, PostalCode: zipcode, City:city, Country:country };
                    $.ajax({
                        type: "POST",
                        url: wsHubPath + "WSHub/wsMember.asmx/UpdateMemberProfile",
                        data: JSON.stringify(sData),
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (data.d != null) {
                                if (data.d > 0) {
                                    modal.showFree("Information", "Profile updated.", function () { window.location.href = "../Member/MyAccount.aspx"; }, 400, 100);
                                } else if (data.d == -3 || data.d == -4) {
                                    modal.showFree("Information", "The email address you have entered is already in use.", CallbackFunction, "auto", 100);
                                    $("div.editacct").find("div.boxleft").find(" input[name='email address']").focus();
                                } else if (data.d == -5) {
                                    modal.showFree("Information", "Your account has been locked out.<br />Please reset your password to unlock your account.",
                                    function () {
                                        $.ajax({
                                            type: "POST",
                                            url: wsHubPath + "WSHub/wsMember.asmx/LogoutMember",
                                            dataType: 'json',
                                            contentType: "application/json; charset=utf-8",
                                            success: function (data) {
                                                window.location.href = "../Default.aspx";
                                            }
                                        });
                                    }
                                    , "auto", 110);
                                } else if (data.d == -6) {
                                    modal.showFree("Information", "Current password is invalid.", CallbackFunction, "auto", 100);
                                } else {
                                    modal.showFree("Information", "Failed to update profile, please try again later. <br />Should this problem persists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110);
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            //console.log("error:" + errorThrown);
                        }
                    });
                }
                if (output.indexOf('false') != -1) {
                    //Recaptcha.reload();
                    modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);                    
                    $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                    $("div.captcha").find(" input[name='captcha']").focus();
                    resetButtons("#wrapper");
                    return;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);               
                $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                $("div.captcha").find(" input[name='captcha']").focus();
                resetButtons("#wrapper");
                return;
            }
        });

    }

    function changePwd() {
        $("div.grid_16").find("div.text").css({ display: "none" });
        $("div.grid_16").find("div.loader").css({ display: "block" });

        var panelLeft = $("div.changePwd").find("div.boxcenter");
        var currentPwd = panelLeft.find(" input[name='password']").val();
        var newPwd = panelLeft.find(" input[name='new password']").val();
        var verifyPword = panelLeft.find(" input[name='verify password']").val();
        var captcha = $("div.captcha").find(" input[name='captcha']").val();

        $(".errormsg").remove();
        var errormsg = "<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>{msg}</div>";
        var msg = "";

        if (captcha == '') {
            msg = errormsg.replace("{msg}", "CAPTCHA is required.");
            $("div.captcha").find(" input[name='captcha']").parent().append(msg);
            $("div.captcha").find(" input[name='captcha']").focus();
        }

        if (newPwd != '' && verifyPword != '' && newPwd != verifyPword) {
            msg = errormsg.replace("{msg}", "Passwords do not match.<br />Please check that your passwords match.");
            panelLeft.find(" input[name='verify password']").parent().append(msg);
            panelLeft.find(" input[name='verify password']").focus();
            $(".errormsg").css("height", "30px");
        }

        if (verifyPword == '') {
            msg = errormsg.replace("{msg}", "Verify Password is required.");
            panelLeft.find(" input[name='verify password']").parent().append(msg);
            panelLeft.find(" input[name='verify password']").focus();
        }

        if (newPwd == '') {
            msg = errormsg.replace("{msg}", "Password is required.");
            panelLeft.find(" input[name='new password']").parent().append(msg).find(".errormsg").css("margin-top", "-10px");
            panelLeft.find(" input[name='new password']").focus();
        } else {
            if (!isValidPassword(newPwd)) {                
                msg = errormsg.replace("{msg}", "Password provided is not valid.<br />");
                panelLeft.find(" input[name='new password']").parent().append(msg).find(".errormsg").css("margin-top", "-10px");
                panelLeft.find(" input[name='new password']").focus();
            }
        }

        if (currentPwd != '' && newPwd != '' && currentPwd == newPwd) {
            msg = errormsg.replace("{msg}", "New password should not be the same as the current<br />password.");
            panelLeft.find(" input[name='new password']").parent().append(msg).find(".errormsg").css("margin-top", "-10px").css("height","30px");
            panelLeft.find(" input[name='new password']").focus();
        }

        if (currentPwd == '') {
            msg = errormsg.replace("{msg}", "Current Password is required.");
            panelLeft.find(" input[name='password']").parent().append(msg);
            panelLeft.find(" input[name='password']").focus();
        }

        if (msg != '') {
            modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
            resetButtons("div.grid_16");
            return;
        }
       
//        var chal = Recaptcha.get_challenge();
//        var resp = Recaptcha.get_response();

//        if (resp == '') {
//            $("#recaptcha").append("<div class='errormsg'>CAPTCHA is required.</div>");
//            modal.showFree("Warning", "Please ensure all information are correct.", CallbackFunction, 400, 100);
//            $("#recaptcha_response_field").focus();
//            resetButtons("div.grid_16");
//            return;
//        }

//        var data = { privatekey: privateKey, remoteip: ip, challenge: chal, response: resp }
        var data = { captcha: captcha }

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/VerifyCaptcha",
            data: JSON.stringify(data),
            datatype: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (output) {
                //console.log(output);
                output = JSON.stringify(output);
                if (output.indexOf('true') != -1) {                    
                    currentPwd = $.sha256(currentPwd);
                    newPwd = $.sha256(newPwd);
                    var sData = { CurrentPassword: currentPwd, NewPassword: newPwd, MemberAutoID: 0 };
                    $.ajax({
                        type: "POST",
                        url: wsHubPath + "WSHub/wsMember.asmx/ResetPassword",
                        data: JSON.stringify(sData),
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (data.d != null) {
                                var objResult = $.parseJSON(data.d);
                                if (objResult != null) {
                                    switch (objResult.status) {
                                        case 0: { modal.showFree("Change Password", "Your password has been successfully changed.", function () { window.location.href = "../Member/MyAccount.aspx"; }, "auto", 100); break; }
                                        case -5:
                                            {
                                                modal.showFree("Information", "Your account has been locked out.<br />Please reset your password to unlock your account.",
                                                        function () {
                                                            $.ajax({
                                                                type: "POST",
                                                                url: wsHubPath + "WSHub/wsMember.asmx/LogoutMember",
                                                                dataType: 'json',
                                                                contentType: "application/json; charset=utf-8",
                                                                success: function (data) {
                                                                    window.location.href = "../Default.aspx";
                                                                }
                                                            });
                                                        }
                                                , "auto", 110);
                                                break;
                                            }
                                        case -6: { modal.showFree("Information", "Current password is invalid.", CallbackFunction, "auto", 100); break; }
                                        default: { modal.showFree("Information", "Failed to update profile, please try again later. <br />Should this problem persists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110); break; }
                                    }
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            //console.log("error:" + errorThrown);
                        }
                    });
                }
                if (output.indexOf('false') != -1) {
                    //Recaptcha.reload();
                    modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);
                    $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                    $("div.captcha").find(" input[name='captcha']").focus();
                    resetButtons("#wrapper");
                    return;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                modal.showFree("Warning", "Invalid CAPTCHA.", CallbackFunction, 400, 100);
                $("div.captcha").find(" input[name='captcha']").parent().append("<span class='errormsg'><br /></span><div class='fieldtitle alpha errormsg'>&nbsp;</div><div class='errormsg'>Invalid CAPTCHA.</div>");
                $("div.captcha").find(" input[name='captcha']").focus();
                resetButtons("#wrapper");
                return;
            }
        });
    }

    function isValidContactNum(inputContactNum) {
        var contactRegex = new RegExp(/^(\+){0,1}(?:[0-9]??){6,14}[0-9]$/);
        var valid = contactRegex.test(inputContactNum);
        return valid;
    }

    function isValidPassportNum(inputPassportNum) {
        var passportRegex = new RegExp(/^[a-zA-Z0-9<]{6,10}([0-9]{1}[a-zA-Z]{3}[0-9]{7}[a-zA-Z]{1}[0-9]{7}[a-zA-Z0-9<]{14}[0-9]{2}){0,1}$/);
        var valid = passportRegex.test(inputPassportNum);
        return valid;
    }

    function isValidEmail(eMail) {
        var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
        var valid = emailRegex.test(eMail);
        return valid;
    }

    function isValidPassword(Password) {
        var pwdRegex = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/);
        var valid = pwdRegex.test(Password);
        if (valid) {
            valid = (Password.length < 8) ? false : (RegExp(/^(?=.*[0-9])/).test(Password) && RegExp(/^(?=.*[a-z])/).test(Password) && RegExp(/^(?=.*[A-Z])/).test(Password));
        }
        return valid;
    }

    function CallbackFunction() {
        resetButtons("#wrapper");
    }
}

$(document).ready(function () {
    register = new Register($("#wrapper div.rewardsPanel"));
    register.init();
});

function getNumberOfDays(year, month) {
    var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
    return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

function loadDays() {
    var selMonth = $("#mthPicker").val() - 1;
    var selYear = $("#yearPicker").val();
    var days = getNumberOfDays(selYear, selMonth);
    var day = $("#dayPicker").val();
    $("#dayPicker").empty();
    for (var i = 1; i <= days; i++) {
        $("#dayPicker").append($('<option />').val(i).html(i));
    }
    if (days == undefined) {
        for (var i = 1; i <= 31; i++) {
            $("#dayPicker").append($('<option />').val(i).html(i));
        }
    }
    if (day != null || day != '') {$("#dayPicker").val(day); }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function changeList(obj) {
    var right = $("#wrapper").find("div.boxright.rewardsPanel").html() == undefined ? "div.boxright" : "div.boxright.rewardsPanel";
    var text = $("#wrapper").find(obj == 'country' ? right : "div.boxleft.main").find(" select[name='" + obj + "']").val();    
    if (text.search("-") == 6) {
        $("#wrapper").find(obj == 'country' ? right : "div.boxleft.main").find(" select[name='" + obj + "']").val(' ');                
    }
}

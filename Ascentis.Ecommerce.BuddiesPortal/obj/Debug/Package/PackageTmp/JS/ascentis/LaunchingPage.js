//load launchingPage
$(document).ready(function () {
    InitLanguage();
});

// InitLanguage funtion update by Sandy 7/3/2013.
function InitLanguage() {
    $.ajax({
        type: "POST",
        url:  wsHubPath + "WSHub/wsHub.asmx/GetLanguageMaster",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (d) {
            var lang = $.parseJSON(d.d);
           
            //ascentis-glaissa:added mar 08 2013 and removed toLowerCase
            $("#language").empty();

            for (var i = 0; i < lang.length; i++) {
                if (lang[i].DisplayName != 'Chinese' && lang[i].DisplayName != 'chinese') {//Disabled Chinese version by ChenChi on Apr 24 2013
                    $("<option value='" + lang[i].LanguageCultureCode + "'>" + lang[i].DisplayName + "</option>").appendTo("#language");
                }
            }
            var baseLang;
            if (navigator.userLanguage) {
                baseLang = navigator.userLanguage.substring(0, 5);
            } else {
                baseLang = navigator.language.substring(0, 5);
            }

            baseLang = 'en-US';
            //ascentis-glaissa, mar 08 2013: removed toLowerCase()
            //ascentis-sandy,mar 09 2013: add string.replace(/zh-cn/gi,'zh-CN').replace(/en-us/gi,'en-US') for set select 'language' value
//            if (null == $.cookie('Language')) {
                $.cookie('Language', "en-US", { path: '/' });
                $("#language").val($.trim(baseLang.replace(/zh-cn/gi, 'zh-CN').replace(/en-us/gi, 'en-US')));
//            } else {
//                $("#language").val($.trim($.cookie('Language').replace(/zh-cn/gi, 'zh-CN').replace(/en-us/gi, 'en-US')));
//            }

            $("#language").change(function () {
                $.cookie("Language", $("#language").val(), { path: '/' });
                window.location.href = window.location.href;
            });
        }
    });
}

var JsonToString = function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof (v);
            if (t == "string") {
                v = v.replace(/"/g, "\\\""); //.replace(/'/g, "\\\'");
                v = '"' + v + '"';
            }
            else if (t == "object" && v !== null) {
                v = JsonToString(v);
            }
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

var GetStringFromResponse = function (obj) {
    if (obj != '') {
        try {
            obj = obj.toString();
        } catch (ex) {
        }
    }

    var t = typeof (obj);
    if (t == "string") {
        return $.trim(
        obj.replace('&#39;', "'")
        .replace("&quot;", '"')
        .replace("*@*", '\\')
        );
    } else {
        return null;
    }
};

var StringEncode = function (obj) {
    if (obj != '') {
        try {
            obj = obj.toString();
        } catch (ex) {
        }
    }

    var t = typeof (obj);
    if (t == "string") {
        return $.trim(obj.replace('"', '\"').replace("'", "\'").replace(new RegExp("[\n]+$", "g"), "")); //.replace(new RegExp("[(\r\n|\n|\r)]+$", "g"), "")
    } else {
        return null;
    }
};
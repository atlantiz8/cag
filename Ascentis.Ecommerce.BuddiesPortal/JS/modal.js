function ChangiModal() {
    var holder = $("div#overlay-container2");
    var panelConfirm = holder.find("div.confirm");
    var panelLoading = holder.find("div.loading");
    var panelFree = holder.find("div.default");
    var panelThreeButtons = holder.find("div.threeButtons");
    var panelWithInputs = holder.find("div.withInputs");
    var existSessionCountdown = false;

    this.init = init;
    this.showFree = showFree;
    this.showConfirm = showConfirm;
    this.showLoading = showLoading;
    this.showThreeButtons = showThreeButtons;
    this.showWithInputs = showWithInputs;
    this.closeAll = closeAll;
    this.showConfirmWithSessionCountdown = showConfirmWithSessionCountdown;

    function init() {
        //console.log (holder);
        holder.css({ opacity: 0, visibility: "hidden" });
        panelConfirm.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });
        panelLoading.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });
        panelFree.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });
        panelThreeButtons.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });
        panelWithInputs.css({ opacity: 0, visibility: "hidden", margin: "0 0 0 0" });
    }

    function StartCountdown(countSecond, navigationURL) {
        var count = countSecond;
        setInterval(function () {
            if (count > 59) {
                $("div.countdown").hide();
            } else {
                $("div.countdown").show();
                $("div.countdown").html("Your current session will be expired in " + count + " seconds!");
            }
            if (count == 0) {
                closeAll();
                window.location = navigationURL;
            }
            count--;
        }, 1000);
    }

    function showFree(header, content, callback, width, height, showCountdown, navURL, hideCloseBtn) {
        closeAll(); //Added by ChenChi on Jul 10 2013
        var tW = (width) ? width : 660;
        var tH = (height) ? height : "auto";
        holder.css({ height: $(document).height() });

        panelFree.find("> div.header > h1").html(header);
        panelFree.find("> div.content").html(content);
        panelFree.find("> div.header > a.close.closing").click(function () {
            //ascentis-glaissa, mar 11 2013: call closeAll() first before callback()
            //due to issue when modal.showFree() is called successively. succeeding modal disappears immediately.
            closeAll();
            callback();
        });

        holder.css({ display: "block" });
        panelFree.css({ display: "block", width: tW, height: tH });

        centerBox(panelFree);

        TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
        TweenMax.to(panelFree, 1, { css: { autoAlpha: 1} });
        //TweenMax.to($("#wrapper"), 1, { css: { autoAlpha: 1} });
        if (showCountdown == true) {
            StartCountdown(1200, navURL);
        }

        //ascentis-glaissa, added apr 06 2013
        if (hideCloseBtn == true) {
            panelFree.find("> div.header > a.close.closing").css({ display: "none" });
        }
    }

    function showConfirmWithSessionCountdown() {

        if (!existSessionCountdown) {
            var tW = 540, tH = "auto", header = 'Warning', count = 60, confirmBtnText = 'Yes', cancelBtnText = null;
            var content = '<img style=\'margin:-10px 5px 0 0\' src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAANCAYAAABPeYUaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTAxMTJBRjk0MUIyMTFFMkJCQjZGQkE4RjVFOTg0MEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTAxMTJBRkE0MUIyMTFFMkJCQjZGQkE4RjVFOTg0MEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMDExMkFGNzQxQjIxMUUyQkJCNkZCQThGNUU5ODQwQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBMDExMkFGODQxQjIxMUUyQkJCNkZCQThGNUU5ODQwQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsTVkS8AAAC8SURBVHjaYlxlaMhAALAB8S98CpgYCIONQDyHEkMygdgSiEOA2AOXIhY8BsgBcSMQywMxDxCfBGJtIP5IiktAXvgO1fQUiKWBuJcU7yQAsSsW8WRs4tgMwWkjkgt5CBkyGYiFCIRVLz5DwoE4EIkPMowfiNXR1KUBsRM2Q0AapqEpBjn7ORDfwOctZEOmYfHGXyA2h2J0oAjE7ciGBEK9gg6YgZgTPSCRQA4Q27NAFc3HE5AnCaTqmQABBgATJhpFbOxWDQAAAABJRU5ErkJggg==\' />Your current session will be expired in <span class=\'modal-countdown\'>59</span> seconds!<br/><span style=\'margin-left:10px\'>Please click the YES button below to renew your session.</span>';
            var cancelCallback, closeCallback, confirmCallback;
            cancelCallback = closeCallback = function () { closeAll(); return false; };
            confirmCallback = function () {
                $.ajax({
                    type: "POST",
                    url: wsHubPath + "WSHub/wsMember.asmx/GetMemberProfile",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        //var objResult = $.parseJSON(data.d);
                    }
                });
            };


            holder.css({ height: $(document).height(), display: 'block' });

            panelConfirm.css({ display: "block", width: tW, height: tH });

            panelConfirm.find("> div.header > h1").html(header);
            panelConfirm.find("> div.content > div.msg").html(content);
            if (confirmBtnText != undefined && confirmBtnText != null) panelConfirm.find("> div.content a.confirmbt div.text").html(confirmBtnText);
            if (cancelBtnText != undefined && cancelBtnText != null) {
                panelConfirm.find("> div.content a.cancelbt div.text").html(cancelBtnText);
            } else {
                panelConfirm.find("> div.content a.cancelbt").css({ display: 'none' });
            }

            panelConfirm.find("> div.header > a.close.closing").click(function () {
                if (closeCallback != undefined && closeCallback != null) {
                    closeCallback();
                } else {
                    cancelCallback(); 
                }

                existSessionCountdown = false;                
                closeAll();
            });

            //            panelConfirm.find("> div.content a.cancelbt").click(function () {
            //                cancelCallback();
            //                existSessionCountdown = false;
            //                closeAll();
            //            });

            panelConfirm.find("> div.content a.confirmbt").click(function () {
                confirmCallback();
                existSessionCountdown = false;
                count = 60;
                clearInterval(modalCountHandler);
                closeAll();
            }).css("margin-left", "140px");

            centerBox(panelConfirm);

            TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
            TweenMax.to(panelConfirm, 1, { css: { autoAlpha: 1} });

            existSessionCountdown = true;

            var modalCountHandler = setInterval(function () {
                if (count >= 0) {
                    if (existSessionCountdown) {
                        panelConfirm.find("> div.content span.modal-countdown").html(count);

                        if (count < 2) {
                            panelConfirm.find('> div.content a.confirmbt').addClass("disabled");
                        }
                    }
                }
                if (count <= 0) {
                    __doPostBack('ctl00$logout', '');
                    clearInterval(modalCountHandler);
                }
                count--;
            }, 900);
        }
    }

    function centerBox(target) {
        var tX = $(window).width() * 0.5 - target.width() * .5;
        var tY = $(window).scrollTop() + $(window).height() * 0.5 - target.height() * .5;
        target.css({ left: tX, top: tY });


    };

    function showConfirm(header, content, callback, cancelCallback, width, height, confirmBtnText, cancelBtnText, closeCallback) {

        var tW = (width) ? width : 400;
        var tH = (height) ? (height < 300) ? "auto" : height : "auto";
        holder.css({ height: $(document).height() });

        holder.css({ display: "block" });
        panelConfirm.css({ display: "block", width: tW, height: tH });

        panelConfirm.find("> div.header > h1").html(header);
        panelConfirm.find("> div.content > div.msg").html(content);
        if (confirmBtnText != undefined && confirmBtnText != null) panelConfirm.find("> div.content a.confirmbt div.text").html(confirmBtnText);
        if (cancelBtnText != undefined && cancelBtnText != null) panelConfirm.find("> div.content a.cancelbt div.text").html(cancelBtnText);

        panelConfirm.find("> div.header > a.close.closing").click(function () {
            if (closeCallback != undefined && closeCallback != null) {
                closeCallback();
            } else { cancelCallback(); }
            closeAll();
        });

        panelConfirm.find("> div.content a.cancelbt").click(function () {
            cancelCallback();
            closeAll();
        });

        panelConfirm.find("> div.content a.confirmbt").click(function () {
            callback();
            closeAll();
        });

        centerBox(panelConfirm);

        TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
        TweenMax.to(panelConfirm, 1, { css: { autoAlpha: 1} });
    }

    function showLoading(content, width, height) {
        var tW = (width) ? width : 400;
        var tH = (height) ? (height < 300) ? "auto" : height : "auto";
        holder.css({ height: $(document).height() });

        holder.css({ display: "block" });
        panelLoading.css({ display: "block" });
        panelLoading.css({ display: "block", width: tW, height: tH });

        //ascentis-glaissa, apr 22 2013
        panelLoading.find("> div.content > p").html(content);

        centerBox(panelLoading);

        TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
        TweenMax.to(panelLoading, 1, { css: { autoAlpha: 1} });
    }

    function showThreeButtons(header, content, btnCallback1, btnCallback2, btnCallback3, cancelCallback, width, height, btnText1, btnText2, btnText3, onLoadFnc, onLoadFncParam) {

        var tW = (width) ? width : 400;
        var tH = (height) ? (height < 300) ? "auto" : height : "auto";
        holder.css({ height: $(document).height() });

        holder.css({ display: "block" });
        panelThreeButtons.css({ display: "block", width: tW, height: tH });

        panelThreeButtons.find("> div.header > h1").html(header);
        panelThreeButtons.find("> div.content > div.msg").html(content);
        if (btnText1 != null && btnText1 != "") panelThreeButtons.find("> div.content a.button1 div.text").html(btnText1);
        if (btnText2 != null && btnText2 != "") panelThreeButtons.find("> div.content a.button2 div.text").html(btnText2);
        if (btnText3 != null && btnText3 != "") panelThreeButtons.find("> div.content a.button3 div.text").html(btnText3);

        panelThreeButtons.find("> div.header > a.close.closing").click(function () {
            cancelCallback();
            closeAll();
        });

        panelThreeButtons.find("> div.content a.button1").click(function () {
            btnCallback1();
            closeAll();
        });

        panelThreeButtons.find("> div.content a.button2").click(function () {
            btnCallback2();
            closeAll();
        });

        panelThreeButtons.find("> div.content a.button3").click(function () {
            btnCallback3();
            closeAll();
        });

        centerBox(panelThreeButtons);

        if (onLoadFnc != null && onLoadFnc != undefined) {
            if (onLoadFncParam != null && onLoadFncParam != undefined) {
                onLoadFnc(onLoadFncParam);
            } else { onLoadFnc(); }
        }

        TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
        TweenMax.to(panelThreeButtons, 1, { css: { autoAlpha: 1} });
    }

    function showWithInputs(header, content, inputFields, callback, cancelCallback, onloadFnc, width, height, closeAfterConfirm) {

        var tW = (width) ? width : 400;
        var tH = (height) ? (height < 300) ? "auto" : height : "auto";
        holder.css({ height: $(document).height() });

        holder.css({ display: "block" });
        panelWithInputs.css({ display: "block", width: tW, height: tH });

        panelWithInputs.find("> div.header > h1").html(header);
        panelWithInputs.find("> div.content > div.msg").html(content);
        panelWithInputs.find("> div.content > div.inputs").hide();
        panelWithInputs.find("> div.content > div.inputs" + inputFields).show();

        panelWithInputs.find("> div.header > a.close.closing").click(function () {
            cancelCallback();
            closeAll();
        });

        panelWithInputs.find("> div.content a.cancelbt").click(function () {
            cancelCallback();
            closeAll();
        });

        panelWithInputs.find("> div.content a.confirmbt").click(function () {
            if (panelWithInputs.find("> div.content a.confirmbt").hasClass("disabled")) return false;
            callback();
            if (closeAfterConfirm == undefined || closeAfterConfirm == null) closeAll();
        });

        centerBox(panelWithInputs);
        onloadFnc();

        TweenMax.to(holder, 1, { css: { autoAlpha: 1} });
        TweenMax.to(panelWithInputs, 1, { css: { autoAlpha: 1} });
    }

    function closeAll() {
        //ascentis-glaissa mar 11 2013:change div.content to div.header for close button.
        panelFree.find("> div.header a.close.closing").unbind();
        panelConfirm.find("> div.header a.close.closing").unbind();

        panelConfirm.find("> div.content a.cancelbt").unbind();
        panelConfirm.find("> div.content a.confirmbt").unbind();

        panelThreeButtons.find("> div.content a.button1").unbind();
        panelThreeButtons.find("> div.content a.button2").unbind();
        panelThreeButtons.find("> div.content a.button3").unbind();

        panelWithInputs.find("> div.content a.cancelbt").unbind();
        panelWithInputs.find("> div.content a.confirmbt").unbind();

        TweenMax.to(holder, 1, { css: { autoAlpha: 0} });
        TweenMax.to(panelConfirm, 1, { css: { autoAlpha: 0} });
        TweenMax.to(panelLoading, 1, { css: { autoAlpha: 0} });
        TweenMax.to(panelFree, 1, { css: { autoAlpha: 0} });
        TweenMax.to(panelThreeButtons, 1, { css: { autoAlpha: 0} });
        TweenMax.to(panelWithInputs, 1, { css: { autoAlpha: 0} });
    };
}

$(document).ready(function () {
    modal = new ChangiModal();
    modal.init();
});

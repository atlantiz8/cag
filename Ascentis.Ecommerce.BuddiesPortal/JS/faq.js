function FAQ() {
    var $holder;
    var $list;

    function init() {
        $holder = $("div.CustServContent");
        $list = $holder.find("> div.content");
        $list.find("> a").click(onListClick);

        $list.find("ol li > h2 > a").click(listItemClick);

        $holder.find("> div.content ol > li:first-child > div").css({ display: "none" });
    }
    this.init = init;

    function onListClick(e) {
        e.preventDefault();

        var self = $(this).parent();

        if (self.hasClass("expand")) {
            $list.addClass("mini");
            $list.removeClass("expand");
            return;
        }

        $list.addClass("mini");
        $list.removeClass("expand");
        self.addClass("expand");
        self.removeClass("mini");

        var scrollA = self.position().top - 75;

        //TweenMax.to ($("body,html"), 1, {})
        $("body,html").scrollTop(scrollA);

        self.find("ol > li > div").css({ display: "none" });
        self.find("ol > li:first-child > div").css({ display: "none" });

        //console.log("onListClick");
    }

    function listItemClick(e) {
        e.preventDefault();
        //console.log("listItemClick");
        var self = $(this).parent().parent();
        self.parent().find("li > div").css({ display: "none" });

        self.find("> div").css({ display: "block" })
    }
}

$(document).ready(function () {
    $faq = new FAQ();
    $faq.init();

});
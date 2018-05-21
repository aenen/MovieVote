//var defaults = { validate: false, limit: 5, name: "foo" };
//var options = { validate: true, name: "bar", ass: "aaa" };

//// Merge defaults and options, without modifying defaults
//var settings = $.extend({}, defaults, options);

(function ($) {

    $.fn.paginationAjax = function (pageDataUrl, totalPages, options) {

        var thisElement = this;

        var defaultSettings = {
            dataElementSelector: "#pageData",
            urlParameters: {},
            beforeFunction: function () { },
            afterFunction: function () { },
            dontLoadActiveOrDisabledPage: true
        };
        var settings = $.extend({}, defaultSettings, options);

        create.call(this, 1, totalPages);


        function create(currentPage, totalPages) {

            $(this).empty();
            var container = $("<ul/>", { class: "pagination" });
            var pageElement = $("<a/>", { class: "page", 'data-page': 1 }).on("click", pageClick);

            for (var i = 1; i <= totalPages; i++) {
                var clonedPageElement = pageElement.clone(true).attr("data-page", i).text(i);
                container.append($("<li/>").append(clonedPageElement));
            }

            container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
            $(this).append(container);
        }

        function pageClick() {

            if (settings.dontLoadActiveOrDisabledPage) {
                if ($(this).parent().hasClass("active") || $(this).parent().hasClass("disabled"))
                    return false;
            }

            settings.beforeFunction();
            
            var page = $(this).attr("data-page");
            var self = this;
            var params = { page: page };
            $(settings.dataElementSelector).load(pageDataUrl + '?' + $.param(params), function () {
                $("ul.pagination li.active").removeClass("active");
                $(self).parent().addClass("active");

                settings.afterFunction();
            });
        }

    };

}(jQuery));
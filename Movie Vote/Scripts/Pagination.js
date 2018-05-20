//var defaults = { validate: false, limit: 5, name: "foo" };
//var options = { validate: true, name: "bar", ass: "aaa" };

//// Merge defaults and options, without modifying defaults
//var settings = $.extend({}, defaults, options);

(function ($) {
    

    $.fn.pagination = function (pageUrl, totalPages/*, urlParameters, option*/) {

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

            alert($(this).data("page"));
        }

        //this.filter("a").append(function () {
        //    return " (" + this.href + ")";
        //});

        //return this;

    };

}(jQuery));
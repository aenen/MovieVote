(function ($) {

    $.fn.paginationAjax = function (pageDataUrl, totalPages, options) {
        var thisElement = this;
        var defaultSettings = {
            dataElementSelector: "#pageData",
            urlParameters: {},

            beforeLoadPage: $.noop,
            afterLoadPageSuccess: $.noop,
            afterLoadPageError: $.noop,

            loadMoreButton: false,
            beforeLoadMore: $.noop,
            afterLoadMoreSuccess: $.noop,
            afterLoadMoreError: $.noop,

            dontLoadActiveOrDisabledPage: true,
            loadPageOnCreating: 0
        };
        var settings = $.extend({}, defaultSettings, options);

        create(1, totalPages);

        /**
         * @summary Створення елементів "пейджингу" (ul.pagination).
         *
         * @param {number} currentPage Відображається сторінка з цим номером.
         * @param {number} totalPages  Загальна кількість сторінок.
         */
        function create(currentPage, totalPages) {
            $(thisElement).empty();
            var container = $("<ul/>", { class: "pagination" });
            var pageElement = $("<a/>", { class: "page", 'data-page': 1 }).on("click", pageClick);

            for (var i = 1; i <= totalPages; i++) {
                var clonedPageElement = pageElement.clone(true).attr("data-page", i).text(i);
                container.append($("<li/>").append(clonedPageElement));
            }

            container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
            $(thisElement).append(container);

            if (settings.loadMoreButton) {
                $("<button/>", {
                    class: "btn btn-lg btn-primary",
                    id: "load-more",
                    text: "Завантажити ще"
                }).on("click", loadMoreClick).insertBefore(thisElement);
            }
        }

        /**
         * @summary Натиснення на елемент сторінки (ul.pagination li a.page).
         */
        function pageClick(e) {
            if (settings.dontLoadActiveOrDisabledPage) {
                if ($(this).parent().hasClass("active") || $(this).parent().hasClass("disabled")) {
                    return false;
                }
            }

            var page = $(this).data("page");
            var self = this;

            settings.beforeLoadPage();
            loadPage(page, false, function () {
                $("ul.pagination li.active").removeClass("active");
                $(self).parent().addClass("active");

                if (settings.loadMoreButton) {
                    if (page == totalPages) {
                        $("#load-more").hide();
                    } else {
                        $("#load-more").show();
                    }
                }

                settings.afterLoadPageSuccess();
            }, settings.afterLoadPageError);
        }

        /**
         * @summary Натиснення на кнопку "Завантажити ще" (#load-more).
         */
        function loadMoreClick(e) {
            if (settings.dontLoadActiveOrDisabledPage) {
                if ($(this).hasClass("active") || $(this).hasClass("disabled")) {
                    return false;
                }
            }

            var self = this;
            var page = $("ul.pagination > li.active > a").last().data("page") + 1;

            settings.beforeLoadMore();
            loadPage(page, true, function () {
                $("ul.pagination > li.active").next().addClass("active");

                if (page == totalPages) {
                    $(self).hide();
                }

                settings.afterLoadMoreSuccess();
            }, settings.afterLoadMoreError);
        }

        /**
         * @summary Завантажує вказану сторінку та вставляє дані в контейнер.
         *
         * @param {number}   page      Номер сторінки, яку необхідно завантажити.
         * @param {boolean}  append    false - очищає контейнер перед вставкою; true - додає данні в кінець контейнеру.
         * @param {function} onSuccess Функція, яка виконується при успішному завантаженні даних.
         * @param {function} onError   Функція, яка виконується при не успішному завантаженні даних.
         */
        function loadPage(page, append, onSuccess = $.noop, onError = $.noop) {            
            var params = $.extend({ page: page }, settings.urlParameters);
            $.ajax({
                type: "GET",
                url: pageDataUrl + '?' + $.param(params),
                success: function (dataHtml) {
                    if (!append) {
                        $(settings.dataElementSelector).empty();
                    }
                    $(settings.dataElementSelector).append(dataHtml);

                    onSuccess();
                },
                error: () => onError()
            });
        }
    };

}(jQuery));
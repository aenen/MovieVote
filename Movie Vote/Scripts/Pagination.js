(function ($) {

    $.fn.paginationAjax = function (pageDataUrl, totalPages, options) {
        var thisElement = this;
        var defaultSettings = getDefaultSettings();
        var settings = $.extend({}, defaultSettings, options);
        var style = getDefaultStyles();

        style[settings.paginationStyle].create(1, totalPages);



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
                style[settings.paginationStyle].afterLoadPage(page);
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
                style[settings.paginationStyle].afterLoadMore(page);
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

        /**
        * @summary Повертає об'єкт зі стандартними налаштуваннями.
        */
        function getDefaultSettings() {
            return {
                dataElementSelector: "#pageData", // Елемент, в який завантажуються дані сторінки.
                urlParameters: {},                // Додаткові параметри сторінки, яка завантажується.

                beforeLoadPage: $.noop,       // Метод виконується перед завантаженням обраної сторінки.
                afterLoadPageSuccess: $.noop, // Метод виконується після успішного завантаженням обраної сторінки.
                afterLoadPageError: $.noop,   // Метод виконується після не успішного завантаженням обраної сторінки.

                loadMoreButton: false,        // true - відображається кнопка "Завантажити ще", яка завантажує наступну сторінку.
                beforeLoadMore: $.noop,       // Метод виконується перед завантаженням наступної сторінки.
                afterLoadMoreSuccess: $.noop, // Метод виконується після успішного завантаженням наступної сторінки.
                afterLoadMoreError: $.noop,   // Метод виконується після не успішного завантаженням наступної сторінки.

                dontLoadActiveOrDisabledPage: true, // true - не завантажує сторінки з класами "active" чи "disabled".
                paginationStyle: "allPages",        // "allPages", "allPagesShrink".
                paginationStyleFlexible: false,     // true - кількість сторінок підлаштовується під розмір контейнеру.
            };
        }

        /**
        * @summary Повертає об'єкт зі стандартними стилями.
        */
        function getDefaultStyles() {
            return {

                /**
                * @summary Стиль відображає всі існуючі сторінки без додаткових кнопок.
                */
                "allPages": {

                    /**
                     * @summary Створення елементів "пейджингу" (ul.pagination).
                     *
                     * @param {number} currentPage Відображається сторінка з цим номером.
                     * @param {number} totalPages  Загальна кількість сторінок.
                     */
                    "create": function (currentPage, totalPages) {

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
                    },

                    /**
                     * @summary Метод виконується після успішного завантаження обраної сторінки.
                     *
                     * @param {number} loadedPage Завантажена сторінка.
                     */
                    "afterLoadPage": function (loadedPage) {

                        var element = $("ul.pagination > li > a[data-page='" + loadedPage + "']");
                        $("ul.pagination > li.active").removeClass("active");
                        $(element).parent().addClass("active");

                        if (settings.loadMoreButton) {
                            if (loadedPage == totalPages) {
                                $("#load-more").hide();
                            } else {
                                $("#load-more").show();
                            }
                        }
                    },

                    /**
                     * @summary Метод виконується після успішного завантаження наступної сторінки (кнопка "Завантажити ще").
                     *
                     * @param {number} loadedPage Завантажена сторінка.
                     */
                    "afterLoadMore": function (loadedPage) {

                        $("ul.pagination > li.active").next().addClass("active");

                        if (loadedPage == totalPages) {
                            $("#load-more").hide();
                        }
                    }
                },



                /**
                * @summary Стиль відображає всі існуючі сторінки, ховаючи деякі з них в "dropdown".
                *
                * @description  Відображаються кнопки "вперед"/"назад" при необхідності;
                                4 найближчих сторінки;
                                сторінки, які не помістились знаходяться в "dropdown" (клікабельні кнопки "...").
                */
                "allPagesShrink": {

                    /**
                     * @summary Створення елементів "пейджингу" (ul.pagination).
                     *
                     * @param {number} currentPage Відображається сторінка з цим номером.
                     * @param {number} totalPages  Загальна кількість сторінок.
                     */
                    "create": function (currentPage, totalPages) {

                        $(thisElement).empty();
                        var visiblePages = 2;
                        var container = $("<ul/>", { class: "pagination" });
                        var pageElement = $("<a/>", { class: "page", 'data-page': 1 }).on("click", pageClick);
                        var dropdown = $("<li/>")
                            .append($("<div/>", { class: "dropup btn-group", style: "display:block" })
                                .append($("<button/>", { class: "btn btn-default dropdown-toggle", type: "button", 'data-toggle': "dropdown", text: "..." })));

                        if (currentPage > 1) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage - 1).addClass("page-prev").text("<"))
                                .appendTo(container);

                            if (currentPage - visiblePages > 1) {
                                createDropdown(1, currentPage - visiblePages);
                            }
                        }

                        var pageFrom = (currentPage - visiblePages > 0) ? currentPage - visiblePages : 1;
                        var pageTo = (currentPage + visiblePages < totalPages) ? currentPage + visiblePages : totalPages;
                        for (var i = pageFrom; i <= pageTo; i++) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", i).text(i))
                                .appendTo(container);
                        }

                        if (currentPage + visiblePages < totalPages) {
                            createDropdown(currentPage + visiblePages + 1, totalPages + 1);
                        }

                        if (currentPage < totalPages) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage + 1).addClass("page-next").text(">"))
                                .appendTo(container);
                        }

                        container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
                        container.appendTo(thisElement);


                        function createDropdown(from, to) {
                            var hiddenElementsList = $("<ul/>", { class: "dropdown-menu" });
                            for (var i = from; i < to; i++) {
                                hiddenElementsList
                                    .append($("<li/>")
                                        .append(pageElement.clone(true).attr("data-page", i).text(i)));
                            }

                            dropdown.clone(true).appendTo(container).find("div.dropup").append(hiddenElementsList);
                        }
                    },

                    /**
                     * @summary Метод виконується після успішного завантаження обраної сторінки.
                     *
                     * @param {number} loadedPage Завантажена сторінка.
                     */
                    "afterLoadPage": function (loadedPage) {

                        style[settings.paginationStyle].create(loadedPage, totalPages);
                    },

                    /**
                     * @summary Метод виконується після успішного завантаження наступної сторінки (кнопка "Завантажити ще").
                     *
                     * @param {number} loadedPage Завантажена сторінка.
                     */
                    "afterLoadMore": function (loadedPage) {

                    }
                }
            };
        }
    };

}(jQuery));
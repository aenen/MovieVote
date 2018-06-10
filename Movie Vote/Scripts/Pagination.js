(function ($) {

    $.fn.pagination = function (pageUrl, totalPages, options) {
        var thisElement = this;
        var defaultSettings = getDefaultSettings();
        var settings = $.extend({}, defaultSettings, options);
        var style = getDefaultStyles();

        style[settings.paginationStyle].create(settings.currentPage, totalPages);

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
                        var container = $("<ul/>", { class: "pagination" }).css("display", "block");
                        var pageElement = $("<a/>", { class: "page", 'data-page': 1 });

                        for (var i = 1; i <= totalPages; i++) {
                            var params = $.extend({ page: i }, settings.urlParameters);
                            var clonedPageElement = pageElement.clone(true).attr({ "data-page": i, href: pageUrl + "?" + $.param(params) }).text(i);
                            container.append($("<li/>").append(clonedPageElement));
                        }

                        container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
                        $(thisElement).append(container);
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
                        if (totalPages < 2) {
                            return false;
                        }

                        // Шаблони елементів та контейнер:
                        var container = $("<ul/>", { class: "pagination" }).css("display", "block");
                        var pageElement = $("<a/>", { class: "page", 'data-page': 1 }).on("click", pageClick);
                        var dropdown = $("<li/>")
                            .append($("<div/>", { class: "dropup btn-group", style: "display:block" })
                                .append($("<button/>", { class: "btn btn-default dropdown-toggle", type: "button", 'data-toggle': "dropdown", text: "..." })));

                        // Данні по сторінкам:
                        var visiblePages = settings.visiblePagesCount;
                        var visiblePagesLeft = totalPages;
                        var visiblePagesRight = totalPages;

                        if (visiblePages >= totalPages) {
                            visiblePages = totalPages;
                        } else {
                            if (visiblePages % 2 == 0) {
                                visiblePagesLeft = visiblePages / 2 - 1;
                                visiblePagesRight = visiblePages / 2;
                            } else {
                                visiblePagesLeft = visiblePagesRight = parseInt(visiblePages / 2);
                            }
                        }
                        var pageFrom = (currentPage - visiblePagesLeft > 0) ? currentPage - visiblePagesLeft : 1;
                        var pageTo = (currentPage + visiblePagesRight < totalPages) ? currentPage + visiblePagesRight : totalPages;
                        if (visiblePages < totalPages) {
                            pageTo = (currentPage - pageFrom < visiblePagesLeft) ? pageTo + (visiblePagesLeft - currentPage + 1) : pageTo;
                            pageFrom = (pageTo - currentPage < visiblePagesRight) ? pageFrom - (visiblePagesRight - (pageTo - currentPage)) : pageFrom;
                        }

                        // Якщо обрана сторінка не перша - створю кнопку "назад"
                        if (currentPage > 1) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage - 1).addClass("page-nav page-prev").text("<"))
                                .appendTo(container);
                        }

                        // Створюю дропдаун для попередніх сторінок, яких забагато
                        createDropdown(1, pageFrom);

                        // Створюю найближчі видимі кнопки сторінок
                        for (var i = pageFrom; i <= pageTo; i++) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", i).text(i))
                                .appendTo(container);
                        }

                        // Створюю дропдаун для наступних сторінок, яких забагато
                        createDropdown(pageTo + 1, totalPages + 1);

                        // Якщо обрана сторінка не остання - створюю кнопку "вперед"
                        if (currentPage < totalPages) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage + 1).addClass("page-nav page-next").text(">"))
                                .appendTo(container);
                        }

                        // Виділяю обрану сторінку як активну та додаю контейнер в елемент пейджингу
                        container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
                        container.appendTo(thisElement);

                        /**
                         * @summary Створює дродаун зі сторінками. 
                         *
                         * @param {number} from Починаючи з цієї сторінки.
                         * @param {number} to   Закінчуючи цією сторінкою не включно (i < to)
                         */
                        function createDropdown(from, to) {
                            var hiddenElementsList = $("<ul/>", { class: "dropdown-menu" });
                            for (var i = from; i < to; i++) {
                                hiddenElementsList
                                    .append($("<li/>")
                                        .append(pageElement.clone(true).attr("data-page", i).text(i)));
                            }

                            var clonedDropdown = dropdown.clone(true);
                            clonedDropdown.appendTo(container).find("div.dropup").append(hiddenElementsList);
                            if (!clonedDropdown.find(hiddenElementsList).children("li").length) {
                                clonedDropdown.hide();
                            }

                        }
                    }
                }
            };
        }


        /**
        * @summary Повертає об'єкт зі стандартними налаштуваннями.
        */
        function getDefaultSettings() {
            return {
                currentPage:1,
                urlParameters: {},                  // Додаткові параметри сторінки, яка завантажується.
                dontLoadActiveOrDisabledPage: true, // true - не завантажує сторінки з класами "active" чи "disabled".
                paginationStyle: "allPages",        // "allPages", "allPagesShrink".
                paginationStyleFlexible: false,     // true - кількість сторінок підлаштовується під розмір контейнеру.
                visiblePagesCount: 5,               // Кількість сторінок, які відображаються (стилі: "allPagesShrink").
            };
        }
    }

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
                visiblePagesCount: 5,               // Кількість сторінок, які відображаються (стилі: "allPagesShrink").
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
                        var container = $("<ul/>", { class: "pagination" }).css("display", "block");
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
                        if (totalPages < 2) {
                            return false;
                        }

                        // Шаблони елементів та контейнер:
                        var container = $("<ul/>", { class: "pagination" }).css("display", "block");
                        var pageElement = $("<a/>", { class: "page", 'data-page': 1 }).on("click", pageClick);
                        var dropdown = $("<li/>")
                            .append($("<div/>", { class: "dropup btn-group", style: "display:block" })
                                .append($("<button/>", { class: "btn btn-default dropdown-toggle", type: "button", 'data-toggle': "dropdown", text: "..." })));

                        // Данні по сторінкам:
                        var visiblePages = settings.visiblePagesCount;
                        var visiblePagesLeft = totalPages;
                        var visiblePagesRight = totalPages;

                        if (visiblePages >= totalPages) {
                            visiblePages = totalPages;
                        } else {
                            if (visiblePages % 2 == 0) {
                                visiblePagesLeft = visiblePages / 2 - 1;
                                visiblePagesRight = visiblePages / 2;
                            } else {
                                visiblePagesLeft = visiblePagesRight = parseInt(visiblePages / 2);
                            }
                        }
                        var pageFrom = (currentPage - visiblePagesLeft > 0) ? currentPage - visiblePagesLeft : 1;
                        var pageTo = (currentPage + visiblePagesRight < totalPages) ? currentPage + visiblePagesRight : totalPages;
                        if (visiblePages < totalPages) {
                            pageTo = (currentPage - pageFrom < visiblePagesLeft) ? pageTo + (visiblePagesLeft - currentPage + 1) : pageTo;
                            pageFrom = (pageTo - currentPage < visiblePagesRight) ? pageFrom - (visiblePagesRight - (pageTo - currentPage)) : pageFrom;
                        }

                        // Якщо обрана сторінка не перша - створю кнопку "назад"
                        if (currentPage > 1) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage - 1).addClass("page-nav page-prev").text("<"))
                                .appendTo(container);
                        }

                        // Створюю дропдаун для попередніх сторінок, яких забагато
                        createDropdown(1, pageFrom);

                        // Створюю найближчі видимі кнопки сторінок
                        for (var i = pageFrom; i <= pageTo; i++) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", i).text(i))
                                .appendTo(container);
                        }

                        // Створюю дропдаун для наступних сторінок, яких забагато
                        createDropdown(pageTo + 1, totalPages + 1);

                        // Якщо обрана сторінка не остання - створюю кнопку "вперед"
                        if (currentPage < totalPages) {
                            $("<li/>")
                                .append(pageElement.clone(true).attr("data-page", currentPage + 1).addClass("page-nav page-next").text(">"))
                                .appendTo(container);
                        }

                        // Виділяю обрану сторінку як активну та додаю контейнер в елемент пейджингу
                        container.find("a[data-page='" + currentPage + "']").parent("li").addClass("active");
                        container.appendTo(thisElement);

                        if (settings.loadMoreButton && currentPage !== totalPages) {
                            $("<button/>", {
                                class: "btn btn-lg btn-primary",
                                id: "load-more",
                                text: "Завантажити ще"
                            }).on("click", loadMoreClick).insertBefore($(thisElement).children("ul.pagination"));
                        }

                        /**
                         * @summary Створює дродаун зі сторінками. 
                         *
                         * @param {number} from Починаючи з цієї сторінки.
                         * @param {number} to   Закінчуючи цією сторінкою не включно (i < to)
                         */
                        function createDropdown(from, to) {
                            var hiddenElementsList = $("<ul/>", { class: "dropdown-menu" });
                            for (var i = from; i < to; i++) {
                                hiddenElementsList
                                    .append($("<li/>")
                                        .append(pageElement.clone(true).attr("data-page", i).text(i)));
                            }

                            var clonedDropdown = dropdown.clone(true);
                            clonedDropdown.appendTo(container).find("div.dropup").append(hiddenElementsList);
                            if (!clonedDropdown.find(hiddenElementsList).children("li").length) {
                                clonedDropdown.hide();
                            }

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
                        var visiblePages = settings.visiblePagesCount;
                        var visiblePagesLeft = totalPages;
                        if (visiblePages >= totalPages) {
                            visiblePages = totalPages;
                        } else {
                            if (visiblePages % 2 == 0) {
                                visiblePagesLeft = visiblePages / 2 - 1;
                            } else {
                                visiblePagesLeft = visiblePagesRight = parseInt(visiblePages / 2);
                            }
                        }

                        var liElements = $("ul.pagination > li > a.page:not(.page-nav)").parent("li");

                        if (loadedPage > visiblePagesLeft + 1) {
                            var nextDrop = $("ul.pagination li:has(div.dropup)").last();
                            nextDrop.find("ul > li").first().insertAfter(liElements.last());
                            liElements = $("ul.pagination > li > a.page:not(.page-nav)").parent("li");

                            if (!nextDrop.find("ul.dropdown-menu li").length) {
                                nextDrop.hide();
                            }
                            if (liElements.length > visiblePages) {
                                $("ul.pagination li:has(div.dropup)").first().show().find("ul").append(liElements.first());
                            }

                        }

                        $("ul.pagination > li > a:not(.page-nav)[data-page='" + loadedPage + "']").parent("li").addClass("active");
                        $("ul.pagination > li a.page-next").attr("data-page", loadedPage + 1);

                        if (loadedPage == totalPages) {
                            $("#load-more").hide();
                            $("ul.pagination > li a.page-next").parent("li").hide();
                        }
                    }
                }
            };
        }
    };

}(jQuery));
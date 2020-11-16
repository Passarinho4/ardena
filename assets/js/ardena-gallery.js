$(document).ready(function () {

    function prepareFullSizeLink(obj) {
        return "https://res.cloudinary.com/ardenatg/image/upload/v" + obj.version + "/" + obj.public_id + "." + obj.format;
    }

    function preparePreviewLink(obj) {
        return "http://res.cloudinary.com/ardenatg/image/upload/c_scale,w_450/v" + obj.version + "/" + obj.public_id + "." + obj.format;
    }

    function prepareId(category) {
        return category.toLowerCase().split(' ').join('');
    }

    function initGallery() {
        $('.gallery').each(function () {

            var $this = $(this),
                $tabs = $this.find('.tabs a'),
                $media = $this.find('.media');

            $tabs.on('click', function (e) {

                var $this = $(this),
                    className = $this.data('tag');

                // Prevent default.
                e.preventDefault();

                // Remove active class from all tabs.
                $tabs.removeClass('active');

                // Reapply active class to current tab.
                $this.addClass('active');

                // Hide media that do not have the same class as the clicked tab.
/*
                $media
                    .fadeOut(0)
                    .each(function () {

                        var $this = $(this);

                        if ($this.hasClass(tag))
                            $this
                                .fadeOut()
                                .delay(0)
                                .queue(function (next) {
                                    $this.fadeIn();
                                    next();
                                });

                    });
*/
                var gallery = document.getElementById("gallery");
                gallery.removeChild(document.getElementById("content"));
                var content = document.createElement("DIV");
                content.className = "content";
                content.id = "content";
                while(content.firstChild) {
                    content.removeChild(content.firstChild);
                }

                photosTags.forEach(function(tag) {
                    console.log(className);
                    if(tag.className.indexOf(className) !== -1) {
                        content.appendChild(tag);
                    }
                });

                gallery.appendChild(content);

                $('.content').poptrox({
                    usePopupNav: true,
                    usePopupCaption: true
                });

            });

        });
    }

    var categories = ["Akcesoria kominkowe",
        "Akcesoria ogrodowe",
        "Balustrady",
        "Baseny",
        "Daszki",
        "Meble nietypowe",
        "Ogrodzenia",
        "Różne",
        "Zegary i lampy"];

    function createTabFor(name, i) {
        var tabsWrapper = document.getElementById("tabs");
        var tabWrapper = document.createElement("LI");
        var tab = document.createElement("A");
        tab.className += "button";
        tab.dataset.tag = prepareId(name);
        tab.innerHTML = name;

        tabWrapper.appendChild(tab);
        tabsWrapper.appendChild(tabWrapper);
    }

    for (var i = 0; i < categories.length; i++) {
        createTabFor(categories[i], i);
    }

    function sortByName(a, b) {
        var dateA = a.created_at === undefined ? a.updated_at : a.created_at;
        var dateB = b.created_at === undefined ? b.updated_at : b.created_at;
        return -dateA.localeCompare(dateB)
    }

    function containsAll(needles, haystack) {
        for (var i = 0, len = needles.length; i < len; i++) {
            if ($.inArray(needles[i], haystack) == -1) return false;
        }
        return true;
    }

    function generateGallery(linksWithCategories) {

        for (var i = 0; i < linksWithCategories.length; i++) {
            var element = linksWithCategories[i];

            var div = document.createElement("DIV");
            div.className += "media all";

            for (var j = 0; j < element.categories.length; j++) {
                div.className += (" " + element.categories[j]);

            }

            var a = document.createElement("A");
            a.href = element.full;

            var img = document.createElement("IMG");
            img.src = element.preview;
            img.title = element.order_number;

            a.appendChild(img);
            div.appendChild(a);

            document.getElementById("content").appendChild(div);
            photosTags.push(div);

        }
        initGallery();
        $('.content').poptrox({
            usePopupNav: true,
            usePopupCaption: true
        });
    }

    var linksWithCategories = [];
    var doneCategories = [];
    var orderNumber = 0;
    var photosTags = [];

    for (var j = 0; j < categories.length; j++) {

        $.getJSON("http://res.cloudinary.com/ardenatg/image/list/" + categories[j] + ".json",
            function (z) {
                return function (data) {
                    for (var k = 0; k < data.resources.length; k++) {
                        if (linksWithCategories.filter(function (t) {
                                return t.name === data.resources[k].public_id
                            }).length === 0) {
                            var key = {
                                created_at: data.resources[k].created_at,
                                updated_at: data.resources[k].updated_at,
                                name: data.resources[k].public_id,
                                categories: [prepareId(categories[z])],
                                preview: preparePreviewLink(data.resources[k]),
                                full: prepareFullSizeLink(data.resources[k])
                            };
                            linksWithCategories.push(key)
                        } else {
                            var key = linksWithCategories.filter(function (t) {
                                return t.name === data.resources[k].public_id
                            })[0];
                            key.categories.push(prepareId(categories[z]));
                        }
                    }
                    doneCategories.push(categories[z]);

                    if (containsAll(categories, doneCategories)) {
                        var sorted = linksWithCategories.sort(sortByName)
                            .map(function (e) {
                                orderNumber = orderNumber + 1;
                                e.order_number = orderNumber;
                                return e;
                            });
                        generateGallery(sorted);
                    }
                }
            }(j));
    }
});

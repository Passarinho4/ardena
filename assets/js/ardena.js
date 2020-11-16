$( document ).ready(function() {

    function prepareFullSizeLink(obj) {
        return "https://res.cloudinary.com/ardenatg/image/upload/v" + obj.version + "/" + obj.public_id + "." + obj.format;
    }

    function preparePreviewLink(obj) {
        return "https://res.cloudinary.com/ardenatg/image/upload/c_scale,w_450/v" + obj.version + "/" + obj.public_id + "." + obj.format;
    }

    function prepareId(category) {
        return category.toLowerCase().split(' ').join('');
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

    for (var i = 0; i < 8; i++) {
        $.getJSON("https://res.cloudinary.com/ardenatg/image/list/" + categories[i] + ".json",
            function(j) {
            return function(data) {

                function canInitGallery() {
                    var photos = document.getElementsByClassName("photo-link");
                    for(var i = 0; i<photos.length; i++) {
                        if(photos[i].href === "http://ardena.com.pl/a") {
                            return false;
                        }
                    }
                    return true;
                }

                var head = data.resources.sort(function (a, b) {
                    var dateA = a.created_at === undefined ? a.updated_at : a.created_at;
                    var dateB = b.created_at === undefined ? b.updated_at : b.created_at;
                    return - dateA.localeCompare(dateB)
                })[0];

                var link = preparePreviewLink(head);
                var aTag = document.getElementById(prepareId(categories[j]));
                aTag.getElementsByTagName("IMG")[0].src = link;
                aTag.href = prepareFullSizeLink(head);
                if(canInitGallery()) {
                    $('.content').poptrox({usePopupNav:true});
                }
            }}(i));
    }
});

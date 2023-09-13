ymaps.ready(init);

function init() {
    var suggestView1 = new ymaps.SuggestView('suggest-address');
}

$(document).ready(function () {

    $('#suggest-address').change(function () {
        console.log($(this).val())
        var myGeocoder = ymaps.geocode($(this).val(),
            // {
            //     boundedBy: myMap.getBounds(),
            //     strictBounds: true
            // }
        );
        myGeocoder.then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates(),
                bounds = firstGeoObject.properties.get('boundedBy');
            console.log(coords)

        });
        console.log($(this).val())
    })
})



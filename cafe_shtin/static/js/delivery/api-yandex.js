ymaps.ready(init);

function init() {
    var suggestView1 = new ymaps.SuggestView('new_suggest-address');
}

$(document).ready(function () {

    // $('#suggest-address').change( async function () {
    //     let myGeocoder = ymaps.geocode($(this).val(),
    //         // {
    //         //     boundedBy: myMap.getBounds(),
    //         //     strictBounds: true
    //         // }
    //     );
    //     let is_good_address = await DefineAddress(myGeocoder)
    //     console.log(is_good_address)
    //
    // })

    function DefineAddress(myGeocoder) {
        return myGeocoder.then(function (res) {
            let select_address = res.geoObjects.get(0),
                coords = select_address.geometry.getCoordinates(),
                bounds = select_address.properties.get('boundedBy');
            let address = {}
            address['is_correct'] = CheckCorrectAddress(select_address.properties.get('metaDataProperty.GeocoderMetaData.precision'))
            address['in_zone_delivery'] = CheckZoneDelivery(coords)
            return address
        });

        function CheckCorrectAddress(type_address) {
            if (type_address === "exact") {
                return [true, 'Корректный адрес']
            } else {
                return [false, 'Уточните адрес']
            }

        }
        function CheckZoneDelivery(coords) {
            return true
        }
    }
})



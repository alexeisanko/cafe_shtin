$(window).ready(function () {
    ymaps.ready(init);

    function init() {
        // Создаем выпадающую панель с поисковыми подсказками и прикрепляем ее к HTML-элементу по его id.
        var suggestView1 = new ymaps.SuggestView('suggest-address');
    }

    if (sessionStorage.getItem('is_open_order') === 'True') {
        sessionStorage.clear()
        $.get($('#modal-order').attr('href'), function (html) {
            $(html).appendTo('body').modal();
            MakeMap()
        });
    }

    $(document).on('change', '#checked-type-delivery', function (event) {
        let old_value = $('#select-type-delivery')
        console.log($('#checked-type-delivery'))
        if (old_value.text().trim() === 'Доставка') {
            old_value.text('Самовывоз')
            $('#checked-type-delivery').attr('value', 'Самовывоз')
            $('.info-about-shop').css('display', 'inline')
            $('.address__title').text('Забрать можно тут:')
            $('.address__change .address__radio').css('display', 'none')
            $('.address__new').css('display', 'none')
        } else {
            old_value.text('Доставка')
            $('#checked-type-delivery').attr('value', 'Доставка')
            $('.info-about-shop').css('display', 'none')
            $('.address__change .address__radio').css('display', 'inline')
            $('.address__title').text('Выбрать адрес')
        }
    });

    $(document).on("change", 'input:radio[name="address"]', function (event) {
        if ($(this).attr('id') === "address-new") {
            $('.address__new').css('display', 'block');
        } else {
            $('.address__new').css('display', 'none');
        }
    });

    $(document).on("change", 'input:radio[name="payment"]', function (event) {
        if ($(this).attr('id') === "online") {
            $('.payment__balance').css('display', 'none');
            $('.payment__info').css('display', 'block');
        } else if ($(this).attr('id') === "cash") {
            $('.payment__info').css('display', 'none');
            $('.payment__balance').css('display', 'block');
        } else {
            $('.payment__info').css('display', 'none');
            $('.payment__balance').css('display', 'none');
        }
    });

    $(document).on("click", '#make-order', function () {
        let order_data = new Order()
        let validate = order_data.checkData()
        if (validate === true) {
            const url = $(this).attr('url')
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                data: order_data,
                success: function (data) {
                    alert('Заказ оформлен. Так как связь с престо отсутствует, то мы его создать в престо не можем')
                    location.replace(data.next_url)
                }
            })
        }
    });

    $('#modal-order').click(function (event) {
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(this.href, function (html) {
            $(html).appendTo('body').modal();
            MakeMap()
        });

    });
})

function MakeMap() {
    ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map('map', {
            center: [30.264981955459618, 59.9567962610097],
            zoom: 9,
            controls: ['geolocationControl', 'searchControl']
        })
        var suggestView1 = new ymaps.SuggestView('suggest-address')
        var deliveryZones = ymaps.geoQuery(data_geojson).addToMap(myMap)
        $('#suggest-address').on('change', function (e) {
            var request = $('#suggest-address').val();
            ymaps.geocode(request).then(function (res) {
                var obj = res.geoObjects.get(0), error, hint;
                if (obj) {
                    // Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
                    switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
                        case 'exact':
                            break;
                        case 'number':
                        case 'near':
                        case 'range':
                            error = 'Неточный адрес, требуется уточнение';
                            hint = 'Уточните номер дома';
                            break;
                        case 'street':
                            error = 'Неполный адрес, требуется уточнение';
                            hint = 'Уточните номер дома';
                            break;
                        case 'other':
                        default:
                            error = 'Неточный адрес, требуется уточнение';
                            hint = 'Уточните адрес';
                    }
                } else {
                    error = 'Адрес не найден';
                    hint = 'Уточните адрес';
                }


                // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
                if (error) {
                    showError(error);
                    showMessage(hint);
                } else {
                    ChechZone(obj);
                }
            }, function (e) {
                console.log(e)
            })
        });

        function showError(message) {
            $('.check-new-address').attr('value', 'false')
            $('.check-new-address').attr('message', message)
        }

        function showMessage(message) {

        }

    function ChechZone(obj) {
        // Сохраняем координаты переданного объекта.
        let coords = obj.geometry.getCoordinates()
        coords = [coords[1], coords[0]]
        // Находим полигон, в который входят переданные координаты.
        let polygon = deliveryZones.searchContaining(coords).get(0)
        console.log(coords)
        console.log(polygon)
        if (polygon) {
            console.log('Попало')
            $('.check-new-address').attr('value', 'true')
        } else {
            console.log('Не попало')
            $('.check-new-address').attr('value', 'false')
            $('.check-new-address').attr('message', 'К сожалению мы пока не доставляем на этот адрес')
        }
    }
}

    let data_geojson = {
  "type": "FeatureCollection",
  "metadata": {
    "name": "delivery",
    "creator": "Yandex Map Constructor"
  },
  "features": [
    {
      "type": "Feature",
      "id": 0,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              30.317557572666534,
              59.926709209445455
            ],
            [
              30.31853845407954,
              59.908747560199146
            ],
            [
              30.321055173222035,
              59.908938009542545
            ],
            [
              30.340903519932148,
              59.91628143603289
            ],
            [
              30.34536671573281,
              59.91628143603289
            ],
            [
              30.35171818668041,
              59.915290195578685
            ],
            [
              30.358960151020604,
              59.91422350144856
            ],
            [
              30.363372384850113,
              59.91401608470413
            ],
            [
              30.369533418957324,
              59.914293537976185
            ],
            [
              30.37464570933971,
              59.91517167570822
            ],
            [
              30.392961632061247,
              59.91834604836555
            ],
            [
              30.39731933906929,
              59.919484054040396
            ],
            [
              30.398184775654276,
              59.9200198692472
            ],
            [
              30.393667935673072,
              59.922497560421434
            ],
            [
              30.389172553364254,
              59.928723286809166
            ],
            [
              30.390685319248792,
              59.932223396685586
            ],
            [
              30.396736382786283,
              59.93795200760245
            ],
            [
              30.39802384311343,
              59.94080517457784
            ],
            [
              30.398098944965877,
              59.94271073757233
            ],
            [
              30.400298356358253,
              59.94926632680774
            ],
            [
              30.399311303440733,
              59.95175797069334
            ],
            [
              30.397208451572986,
              59.953366945394
            ],
            [
              30.39354455405859,
              59.95496238971217
            ],
            [
              30.38979482585575,
              59.9562564456284
            ],
            [
              30.38710188800474,
              59.956434004442656
            ],
            [
              30.38559189304071,
              59.95623160851031
            ],
            [
              30.38412481342097,
              59.9557063724889
            ],
            [
              30.37209260120287,
              59.95124962471725
            ],
            [
              30.363305833449683,
              59.94974430066047
            ],
            [
              30.349025752654,
              59.95013177685424
            ],
            [
              30.345925119032987,
              59.949453690528266
            ],
            [
              30.341064956298194,
              59.948937043993276
            ],
            [
              30.331859614958994,
              59.94685961278085
            ],
            [
              30.33683217855989,
              59.93892322881185
            ],
            [
              30.335067033115635,
              59.93401100208173
            ],
            [
              30.317557572666534,
              59.926709209445455
            ]
          ]
        ]
      },
      "properties": {
        "description": "<div style=\"margin-bottom: 10px;\"><strong>Стоимость доставки: 500 р.</strong></div>\nм. КУ, Маршала Новикова 1 корпус 3</br>тел: +7(123)456-789</br>Часы работы: с 09-00 до 02-00</br>Служба доставки: +7(123)456-789",
        "fill": "#ed4543",
        "fill-opacity": 0.5,
        "stroke": "#b3b3b3",
        "stroke-width": "0",
        "stroke-opacity": 0
      }
    },
    {
      "type": "Feature",
      "id": 1,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              30.264981955459618,
              59.9567962610097
            ],
            [
              30.199646026065437,
              59.968023448258606
            ],
            [
              30.169090300967973,
              59.95080722529315
            ],
            [
              30.205997497012916,
              59.90936544563101
            ],
            [
              30.31854298727787,
              59.908729629378556
            ],
            [
              30.31755056994245,
              59.92671635778719
            ],
            [
              30.335070759227836,
              59.93400738050088
            ],
            [
              30.336846381595894,
              59.93891741426239
            ],
            [
              30.331862837246344,
              59.946856988818254
            ],
            [
              30.293615877798302,
              59.94700499658315
            ],
            [
              30.264981955459618,
              59.9567962610097
            ]
          ]
        ]
      },
      "properties": {
        "description": "<div style=\"margin-bottom: 10px;\"><strong>Стоимость доставки: 400 р.</strong></div>\nм. ОБ, Итальянская, д. 4</br>тел: +7(123)456-789</br>Часы работы: с 09-00 до 02-00</br>Служба доставки: +7(123)456-789",
        "fill": "#b51eff",
        "fill-opacity": 0.5,
        "stroke": "#b3b3b3",
        "stroke-width": "0",
        "stroke-opacity": 0
      }
    },
    {
      "type": "Feature",
      "id": 2,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              30.331857919739864,
              59.9468556967079
            ],
            [
              30.341084718751066,
              59.948946582544735
            ],
            [
              30.345918059395903,
              59.94945784723438
            ],
            [
              30.349024057435095,
              59.950135933461446
            ],
            [
              30.363304138230347,
              59.94974307563543
            ],
            [
              30.37208032612708,
              59.95125259269921
            ],
            [
              30.385574850015093,
              59.956232065300675
            ],
            [
              30.387098344735556,
              59.9564392173057
            ],
            [
              30.389802011422514,
              59.95625896822289
            ],
            [
              30.393567832879437,
              59.95496222199212
            ],
            [
              30.39722100155763,
              59.95336408710427
            ],
            [
              30.399323853425273,
              59.951755112255405
            ],
            [
              30.400310906342714,
              59.94926346813624
            ],
            [
              30.398111494950417,
              59.94273479220603
            ],
            [
              30.398047121934024,
              59.94079693197237
            ],
            [
              30.396763633197057,
              59.937951021273946
            ],
            [
              30.390697300272862,
              59.932224968122135
            ],
            [
              30.38918478985355,
              59.92871417601343
            ],
            [
              30.391899185376563,
              59.924987496898986
            ],
            [
              30.420985059934033,
              59.93079274799345
            ],
            [
              30.435619192319283,
              59.93346346737091
            ],
            [
              30.442485647397394,
              59.93499257245471
            ],
            [
              30.445489721494084,
              59.936392395379656
            ],
            [
              30.45093997021234,
              59.93789983069446
            ],
            [
              30.4782341291479,
              59.944897736946885
            ],
            [
              30.541319685178124,
              59.94623255377958
            ],
            [
              30.55711253185781,
              59.96241829775388
            ],
            [
              30.550246076779697,
              59.97240128977449
            ],
            [
              30.522780256467193,
              59.98152103953561
            ],
            [
              30.501150922971096,
              59.98427367628628
            ],
            [
              30.48192484875235,
              59.994422039546485
            ],
            [
              30.477118330197673,
              60.01195930333351
            ],
            [
              30.46578867931872,
              60.02158363824368
            ],
            [
              30.491194563107765,
              60.06228408109402
            ],
            [
              30.43626292248278,
              60.07927063274563
            ],
            [
              30.365538435178056,
              60.095048248449004
            ],
            [
              30.26254160900617,
              60.10190571826372
            ],
            [
              30.166067915158507,
              60.0751534867464
            ],
            [
              29.95011790295141,
              60.038934706821934
            ],
            [
              29.962477522092037,
              60.01109985092908
            ],
            [
              30.011724782523764,
              59.9909448999639
            ],
            [
              30.199672532615285,
              59.968018224624764
            ],
            [
              30.264984322127837,
              59.95679641593396
            ],
            [
              30.29361958557071,
              59.947005151458676
            ],
            [
              30.331857919739864,
              59.9468556967079
            ]
          ]
        ]
      },
      "properties": {
        "description": "<div style=\"margin-bottom: 10px;\"><strong>Стоимость доставки: 200 р.</strong></div>\nм. ГП, Ул. Тисовая, 4</br>тел. +7(123)456-789</br>Часы работы: пн, вт, ср, чт, вс с 09:00 до 00:00 пт и сб с 09:00 до 02:00</br>Служба доставки: +7(123)456-789",
        "fill": "#56db40",
        "fill-opacity": 0.5,
        "stroke": "#b3b3b3",
        "stroke-width": "0",
        "stroke-opacity": 0
      }
    },
    {
      "type": "Feature",
      "id": 3,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              30.39188845654023,
              59.92497672537026
            ],
            [
              30.39366407890809,
              59.92249921990695
            ],
            [
              30.398186283307165,
              59.920018835586696
            ],
            [
              30.397324385562865,
              59.919479579892105
            ],
            [
              30.392968478122633,
              59.91834568641537
            ],
            [
              30.36956888667663,
              59.91428651398849
            ],
            [
              30.363410534778456,
              59.91400097944435
            ],
            [
              30.358979525485854,
              59.914205702562214
            ],
            [
              30.345364632526156,
              59.91626902534273
            ],
            [
              30.34091216556145,
              59.916274412431086
            ],
            [
              30.32107454768721,
              59.90891481949039
            ],
            [
              30.318553271213226,
              59.908726228614185
            ],
            [
              30.20600778094817,
              59.909329715580654
            ],
            [
              30.12131434909393,
              59.86495487622657
            ],
            [
              30.011451067843932,
              59.86426425113543
            ],
            [
              29.949652972140804,
              59.88980779816408
            ],
            [
              29.79996425143767,
              59.91671076431287
            ],
            [
              29.76563197604705,
              59.93532308713607
            ],
            [
              29.67362147800017,
              59.94152486691147
            ],
            [
              29.65576869479705,
              59.907055805288635
            ],
            [
              29.679114642062665,
              59.88359631539802
            ],
            [
              29.76700526706267,
              59.86357361165538
            ],
            [
              29.793097796359557,
              59.857357208798135
            ],
            [
              29.831549944797043,
              59.81588472664123
            ],
            [
              29.90433436862518,
              59.80965938322088
            ],
            [
              29.971625628390797,
              59.82003430743956
            ],
            [
              30.10758143893768,
              59.81519307943185
            ],
            [
              30.15427333346893,
              59.796513159668955
            ],
            [
              30.272376360812665,
              59.83386249918776
            ],
            [
              30.325934710422054,
              59.80758400946622
            ],
            [
              30.33005458346892,
              59.772282814787644
            ],
            [
              30.390479388156425,
              59.75288582455442
            ],
            [
              30.494849505343932,
              59.78959200546058
            ],
            [
              30.51132899753143,
              59.85459398892704
            ],
            [
              30.531928362765797,
              59.87047935897711
            ],
            [
              30.526435198703307,
              59.89463814605622
            ],
            [
              30.540854754367267,
              59.945830973760465
            ],
            [
              30.478026690402388,
              59.944883678389736
            ],
            [
              30.445507588305833,
              59.936383717008
            ],
            [
              30.44249278537309,
              59.93498389368851
            ],
            [
              30.39188845654023,
              59.92497672537026
            ]
          ]
        ]
      },
      "properties": {
        "description": "<div style=\"margin-bottom: 10px;\"><strong>Стоимость доставки: 300 р.</strong></div>\nм. ШХ, Бейкер-стрит, дом 221-б</br>тел. +7(987)654-321</br>Часы работы: с 09:00 до 00:00</br>Служба доставки: +7(987)654-321\n",
        "fill": "#ffd21e",
        "fill-opacity": 0.5,
        "stroke": "#b3b3b3",
        "stroke-width": "0",
        "stroke-opacity": 0
      }
    }
  ]
}
}

class Order {
    constructor() {
        this.data = {
            address: $('input:radio[name="address"]:checked').val(),
            type_delivery: $('#checked-type-delivery').attr('value'),
            type_payment: $('input:radio[name="payment"]:checked').val(),
            change: $('.change').val(),
            new_address: [],
        }
        if (this.data.address === "new-address") {
            this.data.new_address.push($('.new_street_home').val())
            this.data.new_address.push($('.new_entrance').val())
            this.data.new_address.push($('.new_floor').val())
            this.data.new_address.push($('.new_apartment').val())
        }
        this.data.new_address = this.data.new_address.join(', ')
    }

    checkData() {
        if (this.data.address === undefined) {
            alert('Выберите адрес')
            return false
        } else if (this.data.type_payment === undefined) {
            alert('Выберите тип оплаты')
            return false
        } else if (this.data.address === "new-address" && $('.check-new-address').attr('value') === 'false') {
            alert($('.check-new-address').attr('message'))
            return false
        } else if (this.data.address === "new-address" && $('.check-new-address').attr('value') === undefined) {
            alert('Введите новый адрес')
            return false
        }
        return true
    }
}



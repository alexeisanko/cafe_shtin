$(window).ready(function () {
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

$('#suggest-address').on('change', async function (e) {
    var request = $('#suggest-address').val();
    let url = new URL('check_address', document.location.origin);
    url.searchParams.set('address', request)

    let response = await fetch(url);
    let data = await response.json(); // читаем ответ в формате JSON
})

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



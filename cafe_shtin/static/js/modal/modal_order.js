$(document).ready(function () {

    $('.modal_order').click(function () {
        MicroModal.show('modal_order');
    })


    $('.form-switch i').click(function (){
        if ($('#select-type-delivery').text() === 'Доставка') {
            $('#select-type-delivery').text('Самовывоз')
            $('.address__title').text('Адрес самовывоза')
            $('.info-about-shop').css('display', 'flex')
            $('.info-about-shop').children('span').text('г. Киров, ул. Кооперации, д.2')
            $('.address__change .address__radio').css('display', 'none')
            $('.address__new').css('display', 'none')
        } else {
            $('#select-type-delivery').text('Доставка')
            $('.address__title').text('Выберите адрес')
            $('.info-about-shop').css('display', 'none')
            $('.address__change .address__radio').css('display', 'flex')
        }
    })

    $('.address__change .address__radio input').click(function (){
        if ($(this).attr('id') === 'address-new') {
            $('.address__new').css('display', 'block')
        } else  {
            $('.address__new').css('display', 'none')
        }
    })

    $('.payment__type .address__radio input').click(function (){
        if ($(this).attr('id') === 'online') {
            $('.payment__balance').css('display', 'none')
        } else if ($(this).attr('id') === 'cart') {
            $('.payment__balance').css('display', 'none')
        } else if ($(this).attr('id') === 'cash') {
            $('.payment__balance').css('display', 'flex')

        }
    })


    if (sessionStorage.getItem('is_open_order') === 'True') {
        sessionStorage.clear()
        MicroModal.show('modal_order');
    }
})



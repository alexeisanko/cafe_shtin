window.addEventListener("load", function () {

    const modal_order = document.querySelector(".modal_order");
    const select_type_delivery = document.querySelector(".type-delivery i");

    modal_order.addEventListener("click", function () {
        MicroModal.show('modal_order');
    })

    select_type_delivery.addEventListener("click", function () {
        if (document.getElementById("select-type-delivery").text === 'Доставка') {
            document.getElementById("select-type-delivery").text = 'Самовывоз'
            document.querySelector(".address__title").text = 'Адрес самовывоза'
            document.querySelector(".info-about-shop").style.display = 'flex'
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



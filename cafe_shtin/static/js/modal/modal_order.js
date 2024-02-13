window.addEventListener("load", function () {

    const modal_order = document.querySelector(".modal_order");
    console.log(modal_order)
    const select_type_delivery = document.querySelector(".type-delivery input");
    const select_type_address = document.querySelectorAll(".address__change .address__radio input");
    const select_type_paymant = document.querySelectorAll(".payment__type .address__radio input");

    modal_order.addEventListener("click", function () {
        MicroModal.show('modal_order');
    })

    select_type_delivery.addEventListener("click", function () {
        if (document.getElementById("select-type-delivery").innerHTML === 'Доставка') {
            document.getElementById("select-type-delivery").innerHTML = 'Самовывоз'
            document.querySelector(".address__title").innerHTML = 'Адрес самовывоза'
            document.querySelector(".info-about-shop").style.display = 'flex'
            document.querySelectorAll(".address__change .address__radio").forEach(function (item) {
                item.style.display = 'none'
            })
            select_type_address.forEach(function (item) {
                item.checked = false
            })
            document.querySelector(".address__new").style.display = 'none'

        } else {
            document.getElementById("select-type-delivery").innerHTML = 'Доставка'
            document.querySelector(".address__title").innerHTML = 'Выберите адрес'
            document.querySelector(".info-about-shop").style.display = 'none'
            document.querySelectorAll(".address__change .address__radio").forEach(function (item) {
                item.style.display = 'flex'
            })
        }
    })

    select_type_address.forEach(function (item) {
        item.addEventListener("click", function () {
            if (this.id === 'address-new') {
                document.querySelector(".address__new").style.display = 'block'
            } else {
                document.querySelector(".address__new").style.display = 'none'
            }
        })
    })

    select_type_paymant.forEach(function (item) {
        item.addEventListener("click", function () {
            if (this.id === 'online') {
                document.querySelector(".payment__balance").style.display = 'none'
            } else if (this.id === 'cart') {
                document.querySelector(".payment__balance").style.display = 'none'
            } else if (this.id === 'cash') {
                document.querySelector(".payment__balance").style.display = 'flex'
            }
        })
    })

    if (sessionStorage.getItem('is_open_order') === 'True') {
        sessionStorage.clear()
        MicroModal.show('modal_order');
    }
})

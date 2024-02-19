window.addEventListener("load", function () {

    const btn_make_order = document.getElementById("make-order")

    btn_make_order.addEventListener("click", function () {
        let type_payment = null
        let type_delivery = document.getElementById("select-type-delivery").innerHTML
        let use_cashback = document.querySelector('.ball .form-switch').classList.contains('active')
        let address = {}
        let additional_info = {}


        // Проверка выбора платежа
        if (document.querySelector("[name='payment']:checked")) {
            type_payment = document.querySelector("[name='payment']:checked").value
            if (type_payment === 'cash') {
                additional_info['change'] = document.getElementById("change").value
            }
        } else {
            alert('Не выбран способ оплаты')
            return
        }

        // Проверка выбора доставки
        if (type_delivery === 'Самовывоз') {
            type_delivery = 'pickup'
        } else if (type_delivery === 'Доставка') {
            type_delivery = 'delivery'

            // Проверка выбранного адреса в случае доставки
            if (document.querySelector("[name='address']:checked")) {
                if (document.querySelector("[name='address']:checked").value === 'new-address') {
                    if (document.getElementById("new_suggest-address").dataset["jsonAddress"]) {
                        console.log(document.getElementById("new_suggest-address").dataset["jsonAddress"])
                        address['is_new'] = true
                        address['id'] = null
                        address['new_address'] = {
                            "full_address": document.getElementById("new_suggest-address").value,
                            "json_address": document.getElementById("new_suggest-address").dataset["jsonAddress"],
                            "entrance": document.getElementById("new_entrance").value,
                            "floor": document.getElementById("new_floor").value,
                            "apartment": document.getElementById("new_apartment").value
                        }
                    } else {
                        alert('Не корректный новый адрес доставки')
                        return
                    }
                } else {
                    address['is_new'] = false
                    address['id'] = document.querySelector("[name='address']:checked").value
                }
            } else {
                alert('Не выбран адрес доставки')
                return
            }
        }


        let data_request = {
            'type_payment': type_payment,
            'type_delivery': type_delivery,
            'use_cashback': use_cashback,
            'address': address,
            'additional_info': additional_info

        }
        SendRequest('/create_order/', data_request, CreateOrder, document.querySelector("[name='csrfmiddlewaretoken']").value, 'POST')

    })
})

function CreateOrder(data) {
    console.log(data)

}

window.addEventListener("load", function () {

    const btn_make_order = document.getElementById("make-order")

    btn_make_order.addEventListener("click", function () {
        let type_payment = null
        let type_delivery = document.getElementById("select-type-delivery").innerHTML
        let address = null
        if (document.querySelector("[name='payment']:checked")) {
            type_payment = document.querySelector("[name='payment']:checked").value
        } else {
            alert('Не выбран способ оплаты')
            return
        }
        if (document.querySelector("[name='address']:checked")) {
            if (document.querySelector("[name='address']:checked").value === 'address-new') {

            } else {
                address = document.querySelector("[name='address']:checked").value
            }
        } else {
            alert('Не выбран способ оплаты')
            return
        }

    })
})

$('#new_suggest-address').on('change', async function (e) {
    var request = $('#new_suggest-address').val();
    let url = new URL('check_address', document.location.origin);
    url.searchParams.set('address', request)

    let response = await fetch(url);
    let data = await response.json(); // читаем ответ в формате JSON
})

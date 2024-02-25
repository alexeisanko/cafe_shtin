window.addEventListener("load", function () {
    const change_balance_product = document.querySelectorAll('.count__plus, .count__minus, .more__btn')
    const delete_product = document.querySelectorAll('.item__del')
    const use_cashback = document.querySelector(".use-cashback i");

    change_balance_product.forEach(function (item) {
        item.addEventListener("click", function () {
            let quantity = this.dataset.quantity
            let product = this.dataset.product_id
            let addition = this.dataset.addition_id
            if (product !== 'undefined') {
                SendRequest("/change_basket/", {'product_id': product, 'quantity': quantity}, UpdateProductHTML)
            } else if (addition !== 'undefined') {
                SendRequest("/change_additions_in_basket/", {
                    'addition_id': addition,
                    'quantity': quantity
                }, UpdateAdditionHTML)
            }

        })
    })

    delete_product.forEach(function (item) {
        item.addEventListener("click", function () {
            const product_id = this.dataset.product_id
            const product = document.getElementById(`product_${product_id}`)
            const text = product.children[1].children[1].children[1].children[1].children[1].textContent
            const quantity = parseInt(text.match(/\d+/))
            console.log(quantity)
            SendRequest("/change_basket/", {'product_id': product_id, 'quantity': -quantity}, UpdateProductHTML)
        })
    })

    use_cashback.addEventListener("click", function () {

        if (document.querySelector('.use-cashback').classList.contains('active')) {
            document.querySelector('.use-cashback').classList.remove('active')
            document.querySelector('.without-cashback').style.display = 'flex'
            document.querySelector('.with-cashback').style.display = 'none'
        } else {
            document.querySelector('.use-cashback').classList.add('active')
            document.querySelector('.without-cashback').style.display = 'none'
            document.querySelector('.with-cashback').style.display = 'flex'
        }
    })

    function UpdateProductMedia(data) {
        const product = document.getElementById(`product_${data.product_id}`)
        product.children[1].children[1].children[1].children[0].innerHTML = `${data.total_price_product} ₽`
        product.children[1].children[1].children[1].children[1].children[1].innerHTML = `${data.quantity} шт`
        if (data.quantity == 0) {
            product.style.display = 'none';
        }
    }

    function UpdateBasketMedia(data) {
        if (data.total_count_product === 0) {
            document.querySelector('.basket__media').style.display = 'none';
        } else {
            document.querySelector('.basket__media').style.display = 'flex';
        }
        document.querySelector('.basket__price').innerHTML = `${data.total_price_order} ₽`
        document.querySelector('.without-cashback').innerHTML = data.total_price_order
        document.querySelector('.with-cashback').innerHTML = data.total_price_with_cashback
        document.querySelector('.basket__media').innerHTML = data.total_count_product
        document.querySelector('.cashback__num').innerHTML = data.total_cashback
    }

    function UpdateProductHTML(data) {
        UpdateProductMedia(data)
        UpdateBasketMedia(data)
    }

    function UpdateAdditionMedia(data) {
        const addition = document.getElementById(`addition_${data.addition_id}`)
        if (data.quantity === 0) {
            addition.children[3].style.display = 'flex';
            addition.children[4].style.display = 'none';
        } else {
            addition.children[3].style.display = 'none';
            addition.children[4].style.display = 'flex';
            addition.children[4].children[1].innerHTML = `${data.quantity} шт`
        }
    }

    function UpdateAdditionHTML(data) {
        UpdateAdditionMedia(data)
        UpdateBasketMedia(data)
    }

})

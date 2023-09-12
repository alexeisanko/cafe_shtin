$(document).ready(function () {

    // Change product in basket
    $('.item__count .count .count__plus').click(function () {
        let $product = $(this).parent('div').parent('div').parent('div').parent('div').parent('div')
        UpdateBasketProduct($product, quantity = 1)
    });

    $('.item__count .count .count__minus').click(function () {
        let $product = $(this).parent('div').parent('div').parent('div').parent('div').parent('div')
        UpdateBasketProduct($product, quantity = -1)
    });

    $('.item__del').click(function () {
        let $product = $(this).parent('div')
        let text = $product.children('.order__info').children('.order__cost').children('.item__count').children('.count').children('.count__text').text()
        let quantity = parseInt(text.match(/\d+/))
        UpdateBasketProduct($product, quantity = -quantity)
    });

    function UpdateProductMedia($product, data) {
        $product.children('.order__info').children('.order__cost').children('.item__count').children('.count').children('.count__text').text(`${data.quantity} шт`)
        $product.children('.order__info').children('.order__cost').children('.item__count').children('.item__endcost').text(`${data.total_price_product} ₽`)
        if (data.quantity == 0) {
            $product.css('display', 'none');
        }
    }

    function UpdateBasketMedia(data) {
        if (data.total_count_product === 0) {
            $('.basket__media').css('display', 'none')
        } else {
            $('.basket__media').css('display', 'flex')
        }
        $('.basket__price').text(`${data.total_price_order} ₽`);
        $('.summary__price').text(data.total_price_order)
        $('.basket__media').text(data.total_count_product)
        $('.cashback__num').text(data.total_cashback)
    }

    function UpdateProductHTML($product, data) {
        UpdateProductMedia($product, data)
        UpdateBasketMedia(data)
    }

    function GetProductURL(product_id, quantity) {
        let url = new URL('http://127.0.0.1:8000/change_basket/');
        url.searchParams.set('product_id', product_id)
        url.searchParams.set('quantity', quantity)
        return url
    }

    function UpdateBasketProduct($product, quantity) {
        let product_id = Number($product.attr('id').slice($product.attr('id').indexOf('_') + 1))
        let url = GetProductURL(product_id, quantity)
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                UpdateProductHTML($product, data)
            },
            error: function (data) {
                alert('Не удалось изменить продукт')
            }
        });
    }


    // Change additions in product
    $('.more__btn').click(function () {
        let $addition = $(this).parent('div')
        UpdateBasketAddition($addition, 1)

    })

    $('.addition_plus').click(function () {
        let $addition = $(this).parent('div').parent('div')
        UpdateBasketAddition($addition, 1)

    })

    $('.addition_minus').click(function () {
        let $addition = $(this).parent('div').parent('div')
        UpdateBasketAddition($addition, -1)
    })

    function UpdateAdditionMedia($addition, data) {
        if (data.quantity === 0) {
            $addition.children('.more__btn').css('display', 'flex');
            $addition.children('.count').css('display', 'none');
        } else {
            $addition.children('.more__btn').css('display', 'none');
            $addition.children('.count').css('display', 'flex');
            $addition.children('.count').children('.count__text').text(`${data.quantity} шт`)
        }
    }

    function UpdateAdditionHTML($addition, data) {
        UpdateAdditionMedia($addition, data)
        UpdateBasketMedia(data)
    }

    function GetAdditionURL(addition_id, quantity) {
        let url = new URL('http://127.0.0.1:8000/change_additions_in_basket/');
        url.searchParams.set('addition_id', addition_id)
        url.searchParams.set('quantity', quantity)
        return url
    }

    function UpdateBasketAddition($addition, quantity) {
        let addition_id = Number($addition.attr('id').slice($addition.attr('id').indexOf('_') + 1))
        let url = GetAdditionURL(addition_id, quantity)
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                UpdateAdditionHTML($addition, data)
            },
            error: function (data) {
                alert('Не удалось изменить продукт')
            }
        });
    }
})

$(document).ready(function () {

    // Animations for scroll categories
    $('.category:first').addClass('category--active')
    let indent = ($('.header').height()) + 20
    let category_coord = []
    for (let category of $('.change-category')) {
        category_coord.unshift({coord: $(category).offset(), name: category.id})
    }

    $(".categories").on("click", "a", function (event) {
        event.preventDefault();
        let id = $(this).attr('href'),
            top = $(id).offset().top;
        $('.category').removeClass('category--active')
        $(this).parent().addClass('category--active')
        $('body,html').animate({scrollTop: (top - indent)}, 1000);
    });

    $(window).scroll(function () {
        let scroll = $(window).scrollTop()
        for (let category in category_coord) {
            if (scroll + $('.catalog__item:first').height() / 1.5 > category_coord[category].coord.top) {
                $('.category').removeClass('category--active')
                $(`a[href^="#${category_coord[category].name}"]`).parent().addClass('category--active')
                break
            }
        }
    })

    // Change product in cart
    $('.item__btn').click(function () {
        let $product = $(this).parent('div')
        UpdateBasket($product = $product, quantity = 1)
    });

    $('.item__add').click(function () {
        let $product = $(this).parent('div').parent('div').parent('div')
        UpdateBasket($product = $product, quantity = 1)
    });

    $('.item__remove').click(function () {
        let $product = $(this).parent('div').parent('div').parent('div')
        UpdateBasket($product = $product, quantity = -1)
    });

    $('.count__plus').click(function () {
        const text = $(this).siblings('.count__text').text()
        var count = parseInt(text.match(/\d+/))
        $(this).siblings('.count__text').text(count + 1 + ' шт')
    });

    $('.count__minus').click(function () {
        const text = $(this).siblings('.count__text').text()
        var count = parseInt(text.match(/\d+/))
        if (count - 1 === 0) {
            $(this).siblings('.count__text').text(1 + ' шт')
        } else {
            $(this).siblings('.count__text').text(count - 1 + ' шт')
        }
    });

    $('.count__btn').click(function () {
        let product_id = Number($(this).attr('id').slice($(this).attr('id').indexOf('_') + 1))
        let $product = $(`#product_${product_id}`)
        let quantity_media = $(this).siblings('.modal__count').children('.count__text').text()
        let quantity = Number(quantity_media.slice(0, quantity_media.indexOf(' ')))
        UpdateBasket($product = $product, quantity = quantity)
        MicroModal.close('modal_detail_product')
    });

    function UpdateProductMedia($product, data) {
        $product.children('.item__hide').children('.item__cost').text(`${data.total_price_product} ₽`)
        $product.children('.item__hide').children('.item__count').children('.item__count').text(`${data.quantity} шт`)
        if (data.quantity === 0) {
            $product.children('.item__btn').css('display', 'flex');
            $product.children('.item__hide').css('display', 'none');
        } else {
            $product.children('.item__btn').css('display', 'none');
            $product.children('.item__hide').css('display', 'flex');
        }
    }

    function UpdateBasketMedia(data) {
        if (data.total_count_product === 0) {
            $('.basket__media').css('display', 'none')
        } else {
            $('.basket__media').css('display', 'flex')
        }
        $('.basket__price').text(`${data.total_price_order} ₽`);
        $('.basket__media').text(data.total_count_product)

    }

    function UpdateHTML($product, data) {
        UpdateProductMedia($product, data)
        UpdateBasketMedia(data)
    }

    function GetURL(product_id, quantity) {
        let url = new URL('http://127.0.0.1:8000/change_basket/');
        url.searchParams.set('product_id', product_id)
        url.searchParams.set('quantity', quantity)
        return url
    }

    function UpdateBasket($product, quantity) {
        let product_id = Number($product.attr('id').slice($product.attr('id').indexOf('_') + 1))
        let url = GetURL(product_id, quantity)
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                console.log(data)
                UpdateHTML($product, data)
            },
            error: function (data) {
                alert('Не удалось добавить продукт')
            }
        });
    }
})





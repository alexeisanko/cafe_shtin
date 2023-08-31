$(document).ready(function () {

    $('.category:first').addClass('category--active')
    let indent = ($('.header').height()) + 20
    let category_coord = []
    for (let category of $('.change-category')) {
        category_coord.unshift({coord: $(category).offset(), name: category.id})
    }


    $('.item__btn').click(function () {
        $(this).siblings('.item__hide').css('display', 'flex');
        $(this).css('display', 'none');
        const dish_id = $(this).attr('id')
        const api = $(this).attr('api')
        $.ajax({
            type: 'POST',
            url: api,
            dataType: 'json',
            data: {
                'dish_id': dish_id
            },
            success: function (data) {
                $('#countdish_' + data.id).text(data.quantity);
                $('#costdish_' + data.id).text(data.total_price_dishes);
                $('.basket__price').text(data.total_price_order);
                $('.basket__media').css('display', 'flex')
                $('.basket__media').text(data.total_count_dishes)

            },
            error: function (data) {
                console.log(data)
            }
        });
    });

    $('.item__add').click(function () {
        const dish_id = $(this).siblings('.item__count').attr('id')
        $.ajax({
            type: 'POST',
            url: 'basket/add_dish/',
            dataType: 'json',
            data: {
                'dish_id': dish_id
            },
            success: function (data) {
                $('#countdish_' + data.id).text(data.quantity);
                $('#costdish_' + data.id).text(data.total_price_dishes);
                $('.basket__price').text(data.total_price_order);
                $('.basket__media').css('display', 'flex')
                $('.basket__media').text(data.total_count_dishes)
            },
        });
    });

    $('.item__remove').click(function () {
        const dish_id = $(this).siblings('.item__count').attr('id')
        $.ajax({
            type: 'POST',
            url: 'basket/sub_dish/',
            dataType: 'json',
            data: {
                'dish_id': dish_id
            },
            success: function (data) {
                if (data.quantity == '0 шт') {
                    $('#btndish_' + data.id).css('display', 'flex');
                    $('#btndish_' + data.id).siblings('.item__hide').css('display', 'none');
                } else {
                    $('#countdish_' + data.id).text(data.quantity);
                    $('#costdish_' + data.id).text(data.total_price_dishes);
                }
                $('.basket__price').text(data.total_price_order);
                if (data.total_count_dishes === 0) {
                    $('.basket__media').css('display', 'none')
                }
                $('.basket__media').text(data.total_count_dishes)
            },
        });
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
        const dish_id = $(this).attr('id')
        const api = $(this).attr('api')
        const count = $(this).siblings('.modal__count').children('.count__text').text()
        $.ajax({
            type: 'POST',
            url: api,
            dataType: 'json',
            data: {
                'dish_id': dish_id,
                'count': count
            },
            success: function (data) {
                $('#modal' + data.id).removeClass('md-show');
                $('#countdish_' + data.id).text(data.quantity);
                $('#costdish_' + data.id).text(data.total_price_dishes);
                $('.basket__price').text(data.total_price_order);
                $('#btndish_' + data.id).siblings('.item__hide').css('display', 'flex');
                $('#btndish_' + data.id).css('display', 'none');
                $('.basket__media').text(data.total_count_dishes)
            },
        });
    });

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
})




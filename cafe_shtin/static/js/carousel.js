// window.onscroll = (function() {
//     var lastScrollTop = 0;
//     return function() {
//             var st = window.scrollY || document.documentElement.scrollTop;
//             if (st > lastScrollTop) { // скролл вниз
//                 document.querySelector('header').style.background = '#646464';
//             } else if (st < lastScrollTop) { // скролл вверх
//                 if (document.querySelector('header').getBoundingClientRect().top == document.querySelector('body').getBoundingClientRect().top) {
//                     document.querySelector('header').style.background = '#fff';
//                 }
//             }
//             lastScrollTop = st;
//         }
// })();

$('#carousel-additions').owlCarousel({
    center: false,
    mouseDrag: true,
    touchDrag: true,
    items: 5,
    margin: 20,
    responsive: {
        1000: {
            items: 5,
            nav: false,
            loop: false
        },
        960: {
            items: 4,
            nav: false
        },
        720: {
            items: 3,
            nav: false
        },
        480: {
            items: 2,
            nav: false
        },
        0: {
            items: 1,
            nav: true,
            loop: true
        }
    }
});

var owl = $('#carousel-additions');
$('.owl-next').click(function() {
    owl.trigger('next.owl.carousel');
})
$('.owl-prev').click(function() {
    owl.trigger('prev.owl.carousel', [300]);
})

$('#carousel-promo').owlCarousel({
    mouseDrag: true,
    touchDrag: true,
    nav: false,
    dots: false,
    loop: true,
    margin: 45,
    autoplay: true,
    autoHeight: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: false,

    responsive: {
        0: {
            items: 2,

        },
        800: {
            items: 4,

        },
    }
});



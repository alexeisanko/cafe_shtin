let ModalEffects = (function () {
    function init() {
        let overlay = document.querySelector('.md-overlay');
        [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {
            let modal = document.querySelector('#' + el.getAttribute('data-modal')),
                close = modal.querySelector('.md-close');
            function removeModal(hasPerspective) {
                classie.remove(modal, 'md-show');
                if (hasPerspective) {
                    classie.remove(document.documentElement, 'md-perspective');
                }
            }
            function removeModalHandler() {
                removeModal(classie.has(el, 'md-setperspective'));
            }
            el.addEventListener('click', function (ev) {
                classie.add(modal, 'md-show');
                home.modal()
                // Сюда код для
                overlay.removeEventListener('click', removeModalHandler);
                overlay.addEventListener('click', removeModalHandler);
                if (classie.has(el, 'md-setperspective')) {
                    setTimeout(function () {
                        classie.add(document.documentElement, 'md-perspective');
                    }, 25);
                }
            });
            close.addEventListener('click', function (ev) {
                ev.stopPropagation();
                removeModalHandler();
            });
        });
    }

    init();
})();
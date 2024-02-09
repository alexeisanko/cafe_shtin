const modals_detail_product = document.querySelectorAll(".modal_detail_product");

modals_detail_product.forEach(function (modal) {
    modal.addEventListener("click", function () {
        MicroModal.show('modal_detail_product');
        let select_element = this.parentElement.parentElement.id
        let product_id = Number(select_element.slice(select_element.indexOf('_') + 1))
        SendRequest(`get_info_product/${product_id}/`, null, UpdateInfoProduct)
    })
})


function UpdateInfoProduct(data) {
    let modal = document.getElementById('modal_detail_product')
    modal.querySelector('img').setAttribute('src', data.image)
    modal.querySelector('img').setAttribute('alt', data.name)
    modal.querySelector('.modal__name').innerHTML = `${data.name}`
    modal.querySelector('.modal__cost').innerHTML = `${data.price} ₽`
    modal.querySelector('.modal__text').innerHTML = `${data.description}`
    if (modal.querySelector('.count__btn')) {
        modal.querySelector('.count__btn').id = `modalproduct_${data.id}`
    }
}

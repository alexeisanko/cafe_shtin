$('.modal_detail_product').click(function () {
    MicroModal.show('modal_detail_product');
    let select_element = this.parentElement.parentElement.id
    let product_id = Number(select_element.slice(select_element.indexOf('_') + 1))
    SendRequest('get_info_product', Object.entries({product_id: product_id}), UpdateInfoProduct)
})

function UpdateInfoProduct(data) {
    let modal = document.getElementById('modal_detail_product')
    modal.querySelector('img').setAttribute('src', data.image)
    modal.querySelector('img').setAttribute('alt', data.name)
    modal.querySelector('.modal__name').innerHTML = `${data.name}`
    modal.querySelector('.modal__cost').innerHTML = `${data.cost} ₽`
    modal.querySelector('.modal__text').innerHTML = `${data.description}`
    modal.querySelector('.count__btn').id = `modalproduct_${data.id}`
}

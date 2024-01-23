$('.modal_detail_product').click(function () {
    MicroModal.show('modal_detail_product');
    let select_element = this.parentElement.parentElement.id
    let product_id = Number(select_element.slice(select_element.indexOf('_') + 1))
    UpdateInfoProduct(product_id)
})

async function UpdateInfoProduct (product_id){
    let url = new URL('get_info_product', document.location.origin);
    url.searchParams.set('product_id', product_id)
    let response = await fetch(url);
    let data = await response.json(); // читаем ответ в формате JSON
    let modal = document.getElementById('modal_detail_product')
    modal.querySelector('img').setAttribute('src', data.image)
    modal.querySelector('img').setAttribute('alt', data.name)
    modal.querySelector('.modal__name').innerHTML = `${data.name}`
    modal.querySelector('.modal__cost').innerHTML = `${data.cost} ₽`
    modal.querySelector('.modal__text').innerHTML = `${data.description}`
    modal.querySelector('.count__btn').id = `modalproduct_${product_id}`
}

// let button = document.querySelector('.modal_detail_product');
// button.addEventListener('click', function(){
//     MicroModal.show('modal_detail_product');
//     let select_element = this.parentElement.parentElement.id
//     let product_id = Number(select_element.slice(select_element.indexOf('_') + 1))
//     UpdateInfoProduct(product_id)
// })

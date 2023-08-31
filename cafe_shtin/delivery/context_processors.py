from cafe_shtin.delivery.cart import Cart


def cart(request):
    return {'cart': Cart(request)}

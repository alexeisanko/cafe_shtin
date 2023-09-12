from django import template

register = template.Library()


@register.filter
def get_info_cart(cart, product):
    return cart.cart[product]

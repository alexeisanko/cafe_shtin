from typing import Any, Dict
import json

from django.views.generic import TemplateView, DetailView
from django.http import HttpRequest, JsonResponse

from cafe_shtin.delivery.utilities import get_actual_menu, is_open
from cafe_shtin.delivery.models import Product, Addition
from cafe_shtin.delivery.cart import Cart


class HomeView(TemplateView):
    template_name = 'pages/home.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        menu = get_actual_menu(min_count=10)
        context['menu'] = menu
        context['is_open']: bool = is_open()
        return context


home_view = HomeView.as_view()


class BasketView(TemplateView):
    template_name = 'pages/basket.html'


basket_view = BasketView.as_view()


class AboutView(TemplateView):
    pass


about_view = AboutView.as_view()


class DetailProductView(DetailView):
    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> JsonResponse:
        product_id = request.GET['product_id']
        product: Product = Product.objects.get(id=product_id)
        data = {'image': product.image.url,
                'name': product.name,
                'cost': product.price,
                'description': product.description
                }
        return JsonResponse(data)


detail_product_view = DetailProductView.as_view()


class ChangeBasket(DetailView):

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> JsonResponse:
        product_id = request.GET['product_id']
        product = Product.objects.get(id=product_id)
        quantity = int(request.GET['quantity'])
        cart = Cart(request=request)
        cart.change(product=product, quantity=quantity)
        if cart.cart.get(product_id, False):
            data = {
                'quantity': cart.cart[product_id]['quantity'],
                'total_price_product': cart.cart[product_id]['total'],
                'total_count_product': cart.get_total_count_products(),
                'total_price_order': cart.get_total_price(),
                'total_cashback': cart.get_received_cashback()
            }
        else:
            data = {
                'quantity': 0,
                'total_price_product': 0,
                'total_count_product': cart.get_total_count_products(),
                'total_price_order': cart.get_total_price(),
                'total_cashback': cart.get_received_cashback()
            }
        return JsonResponse(data)


change_basket = ChangeBasket.as_view()


class ChangeBasketAdditions(DetailView):
    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> JsonResponse:
        addition_id = request.GET['addition_id']
        addition = Addition.objects.get(id=addition_id)
        quantity = int(request.GET['quantity'])
        cart = Cart(request=request)
        cart.change_addition(addition=addition, quantity=quantity)
        if cart.cart_additions.get(addition_id, False):
            data = {
                'quantity': cart.cart_additions[addition_id]['quantity'],
                'total_price_product': cart.cart_additions[addition_id]['total'],
                'total_count_product': cart.get_total_count_products(),
                'total_price_order': cart.get_total_price(),
                'total_cashback': cart.get_received_cashback()
            }
        else:
            data = {
                'quantity': cart.cart_additions[addition_id]['quantity'],
                'total_price_product': cart.cart_additions[addition_id]['total'],
                'total_count_product': cart.get_total_count_products(),
                'total_price_order': cart.get_total_price(),
                'total_cashback': cart.get_received_cashback()
            }
        return JsonResponse(data)


change_additions_in_basket = ChangeBasketAdditions.as_view()

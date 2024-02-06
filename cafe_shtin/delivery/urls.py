from django.urls import path

from cafe_shtin.delivery.views import home_view, basket_view, about_view, detail_product_view, change_basket, change_additions_in_basket
from cafe_shtin.delivery.api.views import CheckAddress
app_name = "delivery"

urlpatterns = [
    path("", view=home_view, name="home"),
    path("basket/", view=basket_view, name="basket"),
    path("about/", view=about_view, name="about"),
    path('get_info_product/', view=detail_product_view, name="info_product"),
    path('change_basket/', view=change_basket, name="change_basket"),
    path('change_additions_in_basket/', view=change_additions_in_basket, name="change_additions_in_basket")
]

# API URLS
urlpatterns += [
    path("check_address/", view=CheckAddress.as_view(), name="check_address"),
]

from django.urls import path

from cafe_shtin.delivery.views import home_view, basket_view, about_view

app_name = "delivery"

urlpatterns = [
    path("", view=home_view, name="home"),
    path("basket/", view=basket_view, name="basket"),
    path("about/", view=about_view, name="about"),
]

from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from cafe_shtin.users.api.views import CheckUser
from cafe_shtin.delivery.api.views import CheckAddress

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", CheckUser)
router.register("products", CheckAddress)


app_name = "api"
urlpatterns = router.urls

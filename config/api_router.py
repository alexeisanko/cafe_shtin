from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from cafe_shtin.users.api.views import CheckUser

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", CheckUser)


app_name = "api"
urlpatterns = router.urls

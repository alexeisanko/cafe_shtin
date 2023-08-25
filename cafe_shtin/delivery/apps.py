from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class DeliveryConfig(AppConfig):
    name = "cafe_shtin.delivery"
    verbose_name = _("Доставка")

    def ready(self):
        try:
            import cafe_shtin.delivery.signals  # noqa F401
        except ImportError:
            pass

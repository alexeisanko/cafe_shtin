from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SbisPrestoConfig(AppConfig):
    name = "cafe_shtin.sbis_presto"
    verbose_name = _("SBISPresto")

    def ready(self):
        try:
            import cafe_shtin.sbis_presto.signals  # noqa F401
        except ImportError:
            pass

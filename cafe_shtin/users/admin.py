from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("phone", "cashback")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
    list_display = ["username", "phone", "cashback", "is_superuser"]
    search_fields = ["username", "phone"]

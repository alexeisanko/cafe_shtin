from django.urls import path

from cafe_shtin.users.views import (
    profile_user_view,
    user_login_view,
user_logout_view
)

from cafe_shtin.users.api.views import (
    CheckUser
)

app_name = "users"
urlpatterns = [
    path("profile/", view=profile_user_view, name="profile"),
    path("confirm_login/", view=user_login_view, name="confirm_login"),
    path('logout', view=user_logout_view, name='logout')
]

# API URLS
urlpatterns += [
    path("check_user/", view=CheckUser.as_view(), name="check_user"),
]

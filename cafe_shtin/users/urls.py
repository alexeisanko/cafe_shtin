from django.urls import path

from cafe_shtin.users.views import (
    profile_user_view,
    user_login_view

)

app_name = "users"
urlpatterns = [
    path("profile/", view=profile_user_view, name="profile"),
    path("login/", view=user_login_view, name="login"),
]

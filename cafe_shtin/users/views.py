from typing import Any

from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth import login, authenticate
from django.views.generic import DetailView
from django.http import HttpRequest, JsonResponse
from rest_framework.response import Response

from cafe_shtin.users.api.serializers import LoginSerializer, CheckUserSerializer
from cafe_shtin.sbis_presto.presto import CardUser

User = get_user_model()


class ProfileUserView(LoginRequiredMixin, DetailView):
    template_name = "users/profile.html"
    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


profile_user_view = ProfileUserView.as_view()


class UserLoginView(LoginView):
    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Response:
        serializer = CheckUserSerializer(data=request.GET)
        if serializer.is_valid():
            pass
        print(serializer.errors)
        return JsonResponse(serializer.errors)

    def post(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Response:
        serializer = LoginSerializer(data=request.POST)
        if serializer.is_valid():
            data = serializer.data
            if data['method'] == 'verify_phone':
                uniq_id = self._get_uniq_code(phone=data['phone'],
                                              name=data['name'],
                                              birthday=data['birthday'])
                serializer.uniq_id = uniq_id
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            if data['method'] == 'confirm_phone':
                is_user = self._confirm_phone(phone=data['phone'],
                                              name=data['name'],
                                              birthday=data['birthday'],
                                              uniq_id=data['birthday'],
                                              code=data['birthday'])
                if is_user:
                    user = login(request)
        return Response(serializer.errors)

    def _get_uniq_code(self, phone, name, birthday):
        user = CardUser(phone=phone, name=name, birthday=birthday)
        uniq_id = user.verify_phone()
        return uniq_id

    def _confirm_phone(self, phone, name, birthday, uniq_id, code):
        user = CardUser(phone=phone, name=name, birthday=birthday)
        get_or_create_user = user.get_or_create_user(uniq_id=uniq_id, code_user=code)
        return get_or_create_user


user_login_view = UserLoginView.as_view()

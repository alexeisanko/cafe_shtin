from typing import Any, Dict
import json
import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import login
from django.views.generic import TemplateView
from django.http import HttpRequest, JsonResponse
from django.conf import settings

from cafe_shtin.users.api.serializers import LoginSerializer
from cafe_shtin.users.models import AddressUser
from cafe_shtin.sbis_presto.presto import CardUser, SbisUser, SbisPresto
from cafe_shtin.delivery.models import Orders

User = get_user_model()


class ProfileUserView(LoginRequiredMixin, TemplateView):
    template_name = "pages/profile.html"

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['addresses'] = AddressUser.objects.filter(user=self.request.user)
        context['orderes'] = Orders.objects.filter(user=self.request.user)
        context['cashback'] = SbisPresto().get_balance_cashback(self.request.user.uuid)
        return context


profile_user_view = ProfileUserView.as_view()


class UserLoginView(LoginView):
    def post(self, request: HttpRequest, *args: Any, **kwargs: Any) -> JsonResponse:
        request_data = json.loads(request.body)
        serializer = LoginSerializer(data=request_data)
        if serializer.is_valid():
            data = serializer.validated_data
            user, status = self._confirm_phone(phone=data['phone'],
                                               name=data['username'],
                                               birthday=data['birthday'],
                                               uniq_id=data['uniq_id'],
                                               code=data['code_user'])
            if user:
                # user = authenticate(request, phone=user.phone, password=None)
                login(request, user)
                user.cashback = SbisPresto().get_balance_cashback(user.uuid)
            return JsonResponse(status)
        return JsonResponse(serializer.errors)

    @staticmethod
    def _confirm_phone(phone, name, birthday, uniq_id, code):
        if settings.CONNECT_SBIS:
            user = CardUser(phone=phone, name=name, birthday=birthday)
            status = user.get_or_create_user(uniq_id=uniq_id, code_user=code)
        else:
            status = {'status': 'passed', 'message': 'ок'}
        if status['status'] == 'passed':
            user_info = SbisUser().get_user_crm(phone=phone)
            user, created = User.objects.get_or_create(phone=phone, defaults={"username": user_info['username'],
                                                                              'birthday': user_info['birthday'],
                                                                              'uuid': user_info['uuid'],
                                                                              })
            return user, status
        else:
            return None, status


user_login_view = UserLoginView.as_view()


class UserLogoutView(LoginRequiredMixin, LogoutView):
    pass


user_logout_view = UserLogoutView.as_view()

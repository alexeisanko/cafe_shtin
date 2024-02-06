from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from cafe_shtin.users.api.serializers import LoginSerializer
from cafe_shtin.sbis_presto.presto import SbisUser, CardUser
from cafe_shtin.users.models import User
from .serializers import CheckUserSerializer
from cafe_shtin.utils.normalize_data import normalization_phone


class CheckUser(APIView):
    """
    Проверяет наличия пользователя в системе
    """

    def get(self, request, format=None):
        phone = request.GET['phone']
        is_good_phone = normalization_phone(phone=phone)
        if is_good_phone['passed']:
            phone = is_good_phone['phone']
        else:
            return Response({'error': is_good_phone['error']})
        if settings.CONNECT_SBIS:
            sbis_user = SbisUser()
            check_user = sbis_user.get_user_crm(phone=phone)
        else:
            try:
                user = User.objects.get(phone=phone)
            except ObjectDoesNotExist:
                check_user = {
                    "is_user": False,
                    'phone': phone,
                }
            else:
                check_user = {
                    "is_user": True,
                    'birthday': user.birthday,
                    'phone': phone,
                    'username': user.username,
                    'uuid': user.uuid
                }

        serializer = CheckUserSerializer(check_user)
        return Response(serializer.data)


class GetCode(APIView):
    """
    Отправляет код подтверждения на телефон
    """

    def post(self, request, format=None):
        data = request.data
        phone = data['phone']
        is_good_phone = normalization_phone(phone=phone)
        if is_good_phone['passed']:
            phone = is_good_phone['phone']
        else:
            return Response({'error': is_good_phone['error']})
        if settings.CONNECT_SBIS:
            uniq_id = self._get_uniq_code(phone=phone)
            return Response({'uniq_id': uniq_id})
        else:
            return Response({'error': 'Подключите SBIS'})


    @staticmethod
    def _get_uniq_code(phone):
        user = CardUser(phone=phone)
        uniq_id = user.verify_phone()
        return uniq_id

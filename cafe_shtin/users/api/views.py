from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from cafe_shtin.sbis_presto.presto import SbisUser
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

from rest_framework.views import APIView
from rest_framework.response import Response

from cafe_shtin.sbis_presto.presto import SbisUser
from .serializers import CheckUserSerializer


class CheckUser(APIView):
    """
    Проверяет наличия пользователя в системе
    """
    def get(self, request, format=None):
        phone = request.GET['phone']
        sbis_user = SbisUser()
        check_user = sbis_user.get_user_crm(phone=phone)
        serializer = CheckUserSerializer(check_user)
        return Response(serializer.data)

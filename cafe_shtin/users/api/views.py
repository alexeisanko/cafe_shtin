from rest_framework.views import APIView
from rest_framework.response import Response

from cafe_shtin.users.api.serializers import CheckUserSerializer, SendCodeSerializer
from cafe_shtin.sbis_presto.presto import SbisUser, CardUser


class CheckUser(APIView):
    """
    Проверяет наличия пользователя в системе
    """

    def get(self, request, format=None):
        serializer = CheckUserSerializer(data=request.query_params)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            sbis_user = SbisUser()
            check_user = sbis_user.get_user_crm(phone=phone)
            serializer = CheckUserSerializer(check_user)
            return Response(serializer.data)
        return Response(serializer.errors)


class SendCodeToPhone(APIView):
    """
    Отправляет код подтверждения на телефон
    """

    def post(self, request, format=None):
        serializer = SendCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            user = CardUser(phone=phone)
            uniq_id = user.verify_phone()
            return Response({
                'phone': phone,
                'uniq_id': uniq_id})
        return Response(serializer.errors)


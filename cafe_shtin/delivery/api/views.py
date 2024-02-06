from rest_framework.views import APIView
from rest_framework.response import Response
from cafe_shtin.sbis_presto.presto import SbisOrder


class CheckAddress(APIView):
    """Проверка корректности введенного адреса, проверка зоны доставки, и преобразование адреса в формат SBIS"""

    @staticmethod
    def get(request, format=None):
        input_address = request.GET['address']
        normalized_address = SbisOrder.normalized_address(address=input_address)
        return Response(normalized_address)

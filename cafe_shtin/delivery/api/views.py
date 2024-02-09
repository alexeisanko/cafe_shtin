from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response

from cafe_shtin.sbis_presto.presto import SbisOrder
from cafe_shtin.delivery.models import Product
from cafe_shtin.delivery.api.serializers import ProductSerializer

class CheckAddress(APIView):
    """Проверка корректности введенного адреса, проверка зоны доставки, и преобразование адреса в формат SBIS"""

    @staticmethod
    def get(request, format=None):
        input_address = request.GET['address']
        normalized_address = SbisOrder.normalized_address(address=input_address)
        return Response(normalized_address)


class ProductDetail(APIView):

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)


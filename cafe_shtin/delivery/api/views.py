from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response

from cafe_shtin.sbis_presto.presto import SbisOrder
from cafe_shtin.delivery.models import Product
from cafe_shtin.delivery.api.serializers import ProductSerializer, CheckRequestCreateOrderSerializer, AddressSerializer
from cafe_shtin.users.models import AddressUser

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


class CreateOrder(APIView):

    def get_object(self, pk):
        try:
            return AddressUser.objects.get(pk=pk)
        except AddressUser.DoesNotExist:
            raise Http404


    def post(self,request, format=None):
        serializer = CheckRequestCreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Получение адреса
            if data['address']['is_new']:
                new_address = AddressSerializer(data={'full_address': data['address']['new_address']['full_address'],
                                                'json_address': data['address']['new_address']['json_address'],
                                                'entrance': data['address']['new_address']['entrance'],
                                                'floor': data['address']['new_address']['floor'],
                                                'apartment': data['address']['new_address']['apartment']})
                if new_address.is_valid():
                    new_address.save()
                else:
                    return Response(new_address.errors)
                address = new_address.data
            else:
                address = AddressSerializer(self.get_object(data['address']['id'])).data

            # Получение общей информации о заказе
            type_payment = data['type_payment']
            type_delivery = data['type_delivery']
            use_cashback = data['use_cashback']
            additional_info = data['additional_info']
            order = SbisOrder(request.user, request.session['cart'], address, type_payment, type_delivery)
            return Response(data)
        return Response(serializer.errors)

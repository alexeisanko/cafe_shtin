from rest_framework import serializers
from cafe_shtin.delivery.models import Product
from cafe_shtin.users.models import AddressUser


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'weight', 'price', 'description', 'calorie', 'fats', 'protein', 'carbohydrates', 'image']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddressUser
        fields = ['full_address', 'json_address', 'entrance', 'floor', 'apartment']


class CheckRequestCreateOrderSerializer(serializers.Serializer):
    type_payment = serializers.ChoiceField(required=True, choices=[('online', 'online'), ('cash', 'cash'), ('card', 'card')])
    type_delivery = serializers.ChoiceField(required=True, choices=[('delivery', 'delivery'), ('pickup', 'pickup')])
    use_cashback = serializers.BooleanField(required=True)
    address = serializers.JSONField(required=True)
    additional_info = serializers.JSONField(required=False)

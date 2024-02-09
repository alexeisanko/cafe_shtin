from rest_framework import serializers
from cafe_shtin.delivery.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'weight', 'price', 'description', 'calorie', 'fats', 'protein', 'carbohydrates', 'image']

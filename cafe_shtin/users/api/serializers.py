from rest_framework import serializers


class CheckUserSerializer(serializers.Serializer):
    is_user = serializers.BooleanField(default=False)
    phone = serializers.CharField()


class LoginSerializer(serializers.Serializer):
    is_user = serializers.BooleanField()
    phone = serializers.CharField()
    name = serializers.CharField()
    birthday = serializers.DateField()
    uniq_id = serializers.CharField(required=False)
    code_user = serializers.IntegerField(min_value=1000, max_value=9999, required=False)

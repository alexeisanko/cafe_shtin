from rest_framework import serializers


class CheckUserSerializer(serializers.Serializer):
    is_user = serializers.BooleanField(default=False)
    phone = serializers.CharField(required=True)
    username = serializers.CharField(required=False)
    birthday = serializers.DateField(required=False)
    uuid = serializers.UUIDField(required=False)


class LoginSerializer(serializers.Serializer):
    is_user = serializers.BooleanField()
    phone = serializers.CharField()
    username = serializers.CharField()
    birthday = serializers.DateField()
    uniq_id = serializers.CharField(required=False)
    code_user = serializers.IntegerField(min_value=1000, max_value=9999, required=False)
    method = serializers.CharField()

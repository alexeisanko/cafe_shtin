from rest_framework import serializers


class CheckUserSerializer(serializers.Serializer):
    is_user = serializers.BooleanField(read_only=True, default=False)
    phone = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True, required=False)
    birthday = serializers.DateField(read_only=True, required=False)


class LoginSerializer(serializers.Serializer):
    method = serializers.CharField()
    is_user = serializers.BooleanField()
    phone = serializers.CharField()
    name = serializers.CharField()
    birthday = serializers.DateField()
    uniq_id = serializers.CharField(required=False)
    code_user = serializers.IntegerField(min_value=1000, max_value=9999, required=False)

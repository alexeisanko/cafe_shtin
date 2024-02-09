import re

from rest_framework import serializers
from rest_framework.exceptions import ValidationError


def validate_phone(phone):
    regexp = re.compile(r"(\+7|8)?\s?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})")
    if not regexp.fullmatch(phone):
        raise ValidationError('Некорректный формат номера телефона')


def normalize_phone(phone):
    regexp = re.compile(r"(\+7|8)?\s?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})")
    return regexp.sub(r'+7\2\3\4\5', phone)


class CheckUserSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True, validators=[validate_phone])
    is_user = serializers.BooleanField(required=False)
    username = serializers.CharField(required=False)
    birthday = serializers.DateField(required=False)
    uuid = serializers.UUIDField(required=False)
    # phone_format_sbis = serializers.SerializerMethodField()
    #
    # def get_phone_format_sbis(self, obj):
    #     return normalize_phone(obj['phone'])


class SendCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[validate_phone])


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(validators=[validate_phone])
    username = serializers.CharField()
    birthday = serializers.DateField()
    uniq_id = serializers.CharField()
    code_user = serializers.IntegerField(min_value=1000, max_value=9999)


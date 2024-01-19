import re


def normalization_phone(phone: str) -> dict:
    """Приведение номера телефона в формат СБИС (+79999999999)"""
    regexp = re.compile(r"(\+7|8)?\s?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})")
    if regexp.fullmatch(phone):
        return {'passed': True, 'phone': regexp.sub(r'+7\2\3\4\5', phone)}
    else:
        return {'passed': False, 'error': 'Неверный формат номера телефона'}

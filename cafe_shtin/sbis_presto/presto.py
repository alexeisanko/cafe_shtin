import json
import logging
import time
from typing import Optional
from datetime import datetime, date

import requests
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from cafe_shtin.delivery.models import Product, Category

logger = logging.getLogger(__name__)


class SbisPresto:

    def __init__(self):
        self.headers = {"X-SBISAccessToken": settings.SBISACCESSTOKEN}
        self.shops = self.__get_shops()
        self.menu = self.__get_menu()

    def __get_shops(self) -> int:
        if settings.SHOP_ID:
            return settings.SHOP_ID
        parameters = {
            'withPhones': 'true',
            'withPrices': 'true',
            'product': 'delivery'
        }
        url = 'https://api.sbis.ru/retail/point/list?'
        response = requests.get(url, params=parameters, headers=self.headers).json()
        shops = [{'id': x['id'], 'name': x['name']} for x in response['salesPoints']]
        return shops[0]['id']

    def __get_menu(self) -> int:
        if settings.MENU_ID:
            return settings.MENU_ID
        parameters = {
            'pointId': self.shops,
            'actualDate': f'{datetime.now().strftime("%Y-%m-%d")}',
        }
        url = 'https://api.sbis.ru/retail/nomenclature/price-list?'
        response = requests.get(url, params=parameters, headers=self.headers).json()['priceLists']
        for menu in response:
            if 'доставка' in menu['name'].lower():
                return menu['id']
        logger.error(f'Не найденo нужное меню. Взято из {response[0]["name"]}')
        return response[0]['id']

    def _get_list_dishes(self, shop_id: int, menu_id: int, stop_dish: str = 'false', balance: str = 'false'):
        parameters = {
            'pointId': shop_id,
            'priceListId': menu_id,
            'withBalance': balance,
            'noStopList': stop_dish,
        }
        url = 'https://api.sbis.ru/retail/nomenclature/list?'
        response = requests.get(url, params=parameters, headers=self.headers).json()
        categories = [{'id': x['hierarchicalId'], 'name': x['name']} for x in response['nomenclatures'] if
                      x['attributes'] is None]
        if balance == 'true':
            dishes = [{'uuid': x['externalId'],
                       'balance': x['balance'],
                       'name': x['name'],
                       } for x in response['nomenclatures'] if x['attributes'] is not None]
        else:
            dishes = [{'uuid': x['externalId'],
                       'name': x['name'],
                       'category_id': x['hierarchicalParent'],
                       'price': x['cost'],
                       'image_code': x.get('images'[0], None),
                       'description': x['description'],
                       'weight': x['attributes'].get('outQuantity', None),
                       'calorie': x['attributes']['calorie'],
                       'fats': x['attributes']['fat'],
                       'protein': x['attributes']['protein'],
                       'carbohydrates': x['attributes']['carbohydrate'],
                       # 'balance': x['balance'],
                       } for x in response['nomenclatures'] if x['attributes'] is not None]
        return categories, dishes

    def _save_image(self, dish: dict, obj: Product):
        logger.info(f'Начало сохранения фото блюда: {dish["name"]}')
        start = time.time()
        url = 'https://api.sbis.ru/retail/'
        if dish["image_code"]:
            image = requests.get(f'{url}{dish["image_code"]}', headers=self.headers).content
            image_url = f"media/product/{dish['name']}.jpg"
            with open(image_url, "wb") as file:
                file.write(image)
            obj.image = image_url
            obj.image_code = dish["image_code"]
            obj.save()
            logger.info(f'Загрузка фото блюд заняло {(time.time() - start):0.2f} сек.')
        else:
            logger.warning(f'у {dish["name"]} нет изображения')
            return

    def update_catalog_site(self):
        categories, dishes = self._get_list_dishes(shop_id=settings.SHOP_ID,
                                                   menu_id=settings.MENU_ID,
                                                   stop_dish='false',
                                                   balance='false')

        logger.info('Актуализация категорий')
        for category in categories:
            obj, created = Category.objects.update_or_create(sbis_id=category['id'],
                                                             defaults={'name': category['name']})
        logger.info('Актуализация блюд')
        for dish in dishes:
            if dish['weight'] is None:
                dish['weight'] = 100
                logger.warning(f'В СБИС Нет веса блюда {dish["name"]}')
            if dish['description'] is None:
                dish['description'] = ''
                logger.warning(f'В СБИС Нет описания блюда {dish["name"]}')
            try:
                obj, created = Product.objects.update_or_create(uuid=dish['uuid'],
                                                                defaults={
                                                                    'name': dish['name'],
                                                                    'category': Category.objects.get(
                                                                        sbis_id=dish['category_id']),
                                                                    'price': dish['price'],
                                                                    'description': dish['description'],
                                                                    'calorie': dish['calorie'],
                                                                    'fats': dish['fats'],
                                                                    'protein': dish['protein'],
                                                                    'carbohydrates': dish['carbohydrates'],
                                                                    'weight': dish['weight'],
                                                                }
                                                                )
                if obj.image_code != dish['image_code']:
                    self._save_image(dish, obj)
            except ObjectDoesNotExist:
                logger.warning(f'Неудачная попытка добавить блюдо {dish["name"]}\n.'
                               f'Невозможно добавить блюдо с категорией id={dish["category_id"]}\n'
                               f'Блюдо пропущенно, преход к следующему блюду')
            except IntegrityError as e:
                logger.warning(f'Неудачная попытка добавить блюдо {dish["name"]}.\n'
                               f'Проверьте правильность внесения блюда в сбис престо!')
                logger.warning(e)
            except KeyError:
                logger.warning(f'Неудачная попытка добавить блюдо {dish["name"]}\n.'
                               f'В сбис престо не заполнено какое то поле (скорее всего вес)')
            else:
                logger.info(f'блюдо {dish["name"]} обновлено')

    def update_count_dishes_in_shop(self):
        Product.objects.all().update(available=False)
        categories, dishes = self._get_list_dishes(shop_id=settings.SHOP_ID,
                                                   menu_id=settings.MENU_ID,
                                                   stop_dish='true',
                                                   balance='true')
        for dish in dishes:
            try:
                Product.objects.filter(uuid=dish['uuid']).update(balance=dish['balance'], available=True)
            except ObjectDoesNotExist:
                logger.warning(f'Ошибка добавления количества блюд для {dish["name"]}\n'
                               f'Проверьте баланс в сбис престо у {dish["name"]}\n'
                               f'Возможно еще не прошла актуализация каталога блюд на сайте')
            else:
                logger.info(f'Количество блюд для id = {dish["name"]} обновлено')

    def get_balance_cashback(self, user_uuid: str):
        url = f'https://api.sbis.ru/retail/customer/{user_uuid}/bonus-balance'
        parameters = {
            'pointId': self.shops
        }
        response = requests.get(url, params=parameters, headers=self.headers).json()
        return response['bonusBalance'] if response['bonusBalance'] is not None else 0


class SbisOrder:
    headers = {"X-SBISAccessToken": settings.SBISACCESSTOKEN,
               'Content-Type': 'application/json'}

    def __init__(self, user, nomenclatures, address, payment, is_pickup):
        self.shop_id = settings.SHOP_ID
        self.user = user
        self.nomenclatures = nomenclatures
        self.address = address
        self.payment = payment
        self.is_pickup = is_pickup

    def make_order(self):
        url = "https://api.sbis.ru/retail/order/create"
        payload = {
            "product": "delivery",  # Обязательно delivery
            "pointId": self.shop_id,  # Точка продаж shop обязательна
            "comment": "Проба пера",
            "customer": {
                "externalId": self.user.uuid,
                "name": self.user.first_name,  # Обязательно
                "phone": self.user.phone_number  # Обязательно
            },
            "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # Время на которое создается заказ. Обязательно
            "nomenclatures": self.nomenclatures,
            "delivery": {
                "addressFull": "г. Киров, ул. Советская, д. 166",  # Обязательно при доставкеself.address,
                'addressJSON': '{"City": "г. Киров", "Street": "ул. Советская", "HouseNum": "д. 166", "Entrance": "3", "Floor": "87", "AptNum": "47", "Address": "г. Киров, ул. Советская, д. 166, кв. 87"}',
                # Попробывать без него
                "paymentType": self.payment,  # Обязательно, варианты: «card», «online», «cash»
                "persons": 4,
                "isPickup": self.is_pickup  # False - доставка, True - самовызов
            }
        }
        payload_json = json.dumps(payload)
        response = requests.request("POST", url, headers=self.headers, data=payload_json)
        return response.json()

    def _get_orders_user(self):
        pass

    @classmethod
    def normalized_address(cls, address):
        normalized_address = cls._check_correct_address(address)
        if not normalized_address['status']:
            return {'status': False,
                    'data': None,
                    'error': normalized_address['error']}
        check_zone = cls._check_delivery_zone(normalized_address['address_json'])
        if check_zone:
            return {'status': True,
                    'data': {
                        'address_full': normalized_address['address_full'],
                        'address_json': normalized_address['address_json']
                    },
                    'error': None}
        else:
            return {'status': False,
                    'data': None,
                    'error': ['Некорректная зона доставки']}

    @classmethod
    def _check_correct_address(cls, address):
        url = f'https://api.sbis.ru/retail/delivery/suggested-address'
        parameters = {
            'enteredAddress': address
        }
        response = requests.get(url, params=parameters, headers=cls.headers).json()
        address_full, address_json = response['addresses'][0]['addressFull'], json.loads(response['addresses'][0]['addressJSON'])
        if address_json['HouseNum']:
            return {'status': True, 'address_full': address_full, 'address_json': address_json, 'error': None}
        else:
            return {'status': False, 'address_full': address_full, 'address_json': address_json,
                    'error': ['Некорректный адрес доставки']}

    @classmethod
    def _check_delivery_zone(cls, address):
        url = f'https://api.sbis.ru/retail/delivery/cost'
        parameters = {
            'pointId': settings.SHOP_ID,
            'address': json.dumps(address, ensure_ascii=False)
        }
        response = requests.get(url, params=parameters, headers=cls.headers).json()
        if response['district']:
            return True
        else:
            return False


class SbisUser:
    def __init__(self):
        self.headers = {
            "Host": "online.sbis.ru",
            "Content-Type": "application/json-rpc; charset=utf-8",
            "Accept": "application/json-rpc",
        }
        self.sid = self.__login_sbis()

    def __login_sbis(self) -> str:
        return self.__invoke(
            "СБИС.Аутентифицировать",
            {"Параметр": {"Логин": settings.SBIS_LOGIN, "Пароль": settings.SBIS_PASSWORD}},
            None,
        )["result"]

    def __invoke(self, method: str, params: dict, auth_sid) -> dict:
        """
            Вызов метода
            """
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "protocol": 2,
            "id": 0,
        }

        if auth_sid:
            self.headers["X-SBISSessionID"] = auth_sid
            url = "https://online.sbis.ru/service/"
        else:
            url = "https://online.sbis.ru/auth/service/"

        response = requests.post(url, headers=self.headers, data=json.dumps(payload)).json()
        return response

    def get_user_crm(self, phone: str) -> dict:
        params = {
            "client_data": {
                "d": {
                    'ContactData': {'d': [[phone, 'mobile_phone', None]],
                                    's': [{'n': 'Value', 't': 'Строка'},
                                          {'n': 'Type', 't': 'Строка'},
                                          {'n': 'Priority', 't': 'Строка'}]},
                },
                "s": {
                    'ContactData': 'Выборка',
                },
            },
            "options": None
        }
        user_crm = self.__invoke("CRMClients"
                                 ".GetCustomerByParams", params, self.sid)['result']['d']
        if user_crm:
            return {
                "is_user": True,
                'birthday': user_crm['BirthDay'],
                'phone': phone,
                'uuid': user_crm['UUID'],
                'username': f"{user_crm['LastName'] if user_crm['LastName'] else ''} {user_crm['FirstName'] if user_crm['FirstName'] else ''} {user_crm['SecondName'] if user_crm['SecondName'] else ''}",
            }
        return {
            "is_user": False,
            'phone': phone,
        }


class CardUser:
    def __init__(self, phone: str, name: Optional[str] = None, birthday: Optional[date] = None,
                 gender: Optional[int] = None):
        self.phone = phone
        self.name = name
        self.birthday = birthday
        self.gender = gender
        self.headers = {'Content-Type': 'application/json',
                        'Cookie': 'CpsUserId=034d5129-2037-4ddb-8af8-63b894d90a5a; s3csu=daab; s3su=00a28c6f-00a2a4ae; s3tok-daab=; sid=00a28c6f-00a2a4ae-000d-1111111111111111'
                        }
        self.card_type_uuid = settings.CARD_TYPE_UUID

    def verify_phone(self) -> dict:
        url = "https://sabyget.ru/discount-cards/service/?x_version=23.5104-16"
        payload = json.dumps({
            "jsonrpc": "2.0",
            "protocol": 6,
            "method": "Questionary.VerifyPhone",
            "params": {
                "CardTypeUUID": self.card_type_uuid,
                "PhoneNumber": self.phone
            },
            "id": 1
        })

        response = requests.request("POST", url, headers=self.headers, data=payload).json()
        uniq_id = response['result']
        return uniq_id

    def get_or_create_user(self, uniq_id: str, code_user: int) -> dict:
        url = "https://sabyget.ru/discount-cards/service/?x_version=23.2155-19"
        payload = json.dumps({
            "jsonrpc": "2.0",
            "protocol": 6,
            "method": "Questionary.CreateCard",
            "params": {
                "CardTypeUUID": self.card_type_uuid,
                "Data": {
                    "d": [
                        self.card_type_uuid,
                        self.phone,
                        uniq_id,
                        code_user,
                        {
                            "d": [
                                self.name,
                                None,
                                datetime.strftime(self.birthday, '%Y-%m-%d'),
                                self.gender
                            ],
                            "s": [
                                {
                                    "t": "Строка",
                                    "n": "FIO"
                                },
                                {
                                    "t": "Строка",
                                    "n": "Email"
                                },
                                {
                                    "t": "Дата",
                                    "n": "BirthDay"
                                },
                                {
                                    "t": "Число целое",
                                    "n": "Gender"
                                }
                            ],
                            "_type": "record",
                            "f": 1
                        },
                        True,
                        True,
                        "discount-cards.gpay.channel:c3e0dd77-972c-4466-ac27-998a6fd3db32_10658990",
                        "discount-cards.card-image.channel:e3c33203-4165-4d2e-a9b1-3ccf61076950_10658990",
                        None
                    ],
                    "s": [
                        {
                            "t": "UUID",
                            "n": "CardTypeUUID"
                        },
                        {
                            "t": "Строка",
                            "n": "PhoneNumber"
                        },
                        {
                            "t": "Строка",
                            "n": "SMSTicket"
                        },
                        {
                            "t": "Строка",
                            "n": "SMSCode"
                        },
                        {
                            "t": "Запись",
                            "n": "ClientData"
                        },
                        {
                            "t": "Логическое",
                            "n": "WithWalletQR"
                        },
                        {
                            "t": "Логическое",
                            "n": "WithGPayQR"
                        },
                        {
                            "t": "Строка",
                            "n": "EventChannelGPay"
                        },
                        {
                            "t": "Строка",
                            "n": "EventChannelCardImage"
                        },
                        {
                            "t": "Число целое",
                            "n": "PreferredPass"
                        }
                    ],
                    "_type": "record",
                    "f": 0
                }
            },
            "id": 1
        })
        response = requests.post(url, data=payload, headers=self.headers)
        if response.json().get('error', False):
            return {'status': 'passed', 'message': response.json()['error']['message']}
        elif response.json().get('result', False):
            return {'status': 'passed', 'message': 'ок'}
        else:
            return {'status': 'error', 'message': 'Внутрення ошибка сервера'}


if __name__ == '__main__':
    presto = SbisPresto()
    presto.update_catalog_site()

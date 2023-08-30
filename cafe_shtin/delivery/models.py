from django.db import models


class Category(models.Model):
    """Свойства определенной категории блюд"""
    name = models.CharField(max_length=30, verbose_name='Категория блюда', unique=True)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        ordering = ('id',)
        verbose_name = 'Тип блюда'
        verbose_name_plural = 'Тип блюд'


class Product(models.Model):
    """Класс описывающий свойства блюда"""

    name = models.CharField(max_length=25, verbose_name='Наименование блюда')
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        verbose_name='Категория',
    )
    count = models.IntegerField(verbose_name='Доступное количество', default=0)
    weight = models.IntegerField(verbose_name='Вес')
    price = models.IntegerField(verbose_name='Цена')
    description = models.TextField(verbose_name='Описание')
    fats = models.IntegerField(verbose_name='Жиры', null=True)
    protein = models.IntegerField(verbose_name='Белки', null=True)
    carbohydrates = models.IntegerField(verbose_name='Углеводы', null=True)
    image = models.CharField(verbose_name='Сылка на изображение', max_length=150)
    uuid = models.CharField(verbose_name='UUID блюда', null=True, blank=True, max_length=40)
    price_list_id = models.IntegerField(verbose_name='Идентификатор прайс-листа', blank=True)

    def __str__(self):
        return f'{self.name} ({self.category_id})'

    class Meta:
        verbose_name = 'Блюдо'
        verbose_name_plural = 'Блюда'


class Additive(models.Model):
    name = models.CharField(max_length=25, verbose_name='Название допника')
    price = models.IntegerField(verbose_name='Цена')
    image = models.CharField(verbose_name='Сылка на изображение', max_length=150)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        ordering = ('name',)
        verbose_name = 'Дополнение'
        verbose_name_plural = 'Дополнения'


class AdditiveToDish(models.Model):
    addition = models.ForeignKey(Additive,
                                 on_delete=models.PROTECT,
                                 verbose_name='Дополнение',
                                 )
    dish = models.ForeignKey(Product,
                             on_delete=models.CASCADE,
                             verbose_name='Блюдо в которое входит дополнение',
                             )

    def __str__(self):
        return f'{self.dish.name} ({self.addition.name})'

    class Meta:
        ordering = ('addition',)
        verbose_name = 'Дополнение для блюда'
        verbose_name_plural = 'Дополнения для блюда'


class Orders(models.Model):
    """ Хранит в себе все сделанные заказы пользователями"""

    numbers_order = models.IntegerField(verbose_name='Номер заказа')
    date_order = models.DateTimeField(verbose_name="Время заказа", auto_now_add=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, verbose_name='Покупатель')
    is_paid = models.BooleanField(verbose_name='Заказ оплачен?', default=False)
    payment_type_choice = [
        ('site', 'На сайте'),
        ('card', 'Картой при получении'),
        ('cash', 'Наличными при получении')
    ]
    payment_type = models.CharField(verbose_name='Тип оплаты',
                                    choices=payment_type_choice,
                                    default=payment_type_choice[0][0], max_length=20)
    address = models.ForeignKey('users.AddressUser', on_delete=models.CASCADE, verbose_name='Адрес доставки')
    status = models.CharField(verbose_name='Статус заказа', max_length=20, null=True, default=None)

    def __str__(self):
        return f'Заказ №{self.numbers_order} от {self.date_order}'

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'


class ItemsOrder(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, verbose_name='Заказ')
    dish = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='Блюдо')
    count = models.IntegerField(verbose_name='Количество')

    def __str__(self):
        return f"{self.dish.name} - {self.count}"

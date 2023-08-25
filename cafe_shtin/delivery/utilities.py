from datetime import datetime
from cafe_shtin.delivery.models import Category, Product


def get_actual_menu(min_count=0) -> tuple:
    breakfast = {}
    menu = {}
    categories = Category.objects.all()
    for category in categories:
        products = Product.objects.filter(category=category).filter(count__gte=min_count)
        if category != 'Завтраки':
            menu[category.name] = [
                {'id': product.id,
                 'name': product.name,
                 'image': product.image,
                 'price': product.price,
                 'weight': product.weight} for product in products
            ]
        else:
            breakfast[category.name] = [
                {'id': product.id,
                 'name': product.name,
                 'image': product.image,
                 'price': product.price,
                 'weight': product.weight} for product in products
            ]
    return breakfast, menu


def is_breakfast_time() -> bool:
    time_now = datetime.now()
    if 8 < time_now.hour < 12:
        return True
    return False


def is_open() -> bool:
    time_now = datetime.now()
    if 8 < time_now.hour < 24:
        return True
    return False

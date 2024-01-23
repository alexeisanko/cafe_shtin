from datetime import datetime
from cafe_shtin.delivery.models import Category, Product


def get_actual_menu(min_balance=0) -> dict:
    menu = {}
    categories = Category.objects.all()
    breakfast = is_breakfast_time()
    for category in categories:
        products = Product.objects.filter(category=category).filter(balance__gte=min_balance)
        if not products:
            continue
        if category.name != 'Завтраки' or (category.name == 'Завтраки' and breakfast):
            menu[category.name] = [
                {'id': str(product.id),
                 'name': product.name,
                 'image': product.image.url,
                 'price': product.price,
                 'weight': product.weight} for product in products
            ]
    return menu


def is_breakfast_time() -> bool:
    time_now = datetime.now()
    if 6 < time_now.hour < 12:
        return True
    return False


def is_open() -> bool:
    time_now = datetime.now()
    if 6 < time_now.hour < 24:
        return True
    return False

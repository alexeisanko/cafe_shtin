from django.http.request import HttpRequest
from cafe_shtin.delivery.models import Product, Addition


class Cart:
    def __init__(self, request: HttpRequest):
        self.session = request.session
        cart = self.session.get('cart')
        if not cart:
            cart = self.session['cart'] = {}
        self.cart = cart

    def add(self, product: Product, quantity=1):
        if product.id not in self.cart:
            additions = Addition.objects.filter(additiontodish__product__id=product.id)
            additions = {f'a_{addition.id}': {
                'quantity': 0,
                'name': addition.name,
                'price': addition.price,
                'image': addition.image,
                'total': 0,
            } for addition in additions if f'a_{addition.id}' not in self.cart}
            self.cart.update(additions)
            self.cart[product.id] = {'quantity': 0,
                                     'price': product.price,
                                     'image': product.image,
                                     'name': product.name,
                                     'weight': product.weight,
                                     'total': quantity * product.price,
                                     }
        self.cart[product.id]['quantity'] += quantity
        self.cart[product.id]['total'] = self.cart[product.id]['quantity'] * self.cart[product.id]['price']
        self.save()

    def sub(self, product: Product, quantity=1):
        if product.id not in self.cart:
            return
        self.cart[product.id]['quantity'] -= quantity
        if self.cart[product.id]['quantity'] <= 0:
            self.remove(product)
        self.cart[product.id]['total'] = self.cart[product.id]['quantity'] * self.cart[product.id]['price']
        self.save()

    def add_addition(self, addition: Addition, quantity=1):
        addition_id = f'a_{addition.id}'
        self.cart[addition_id]['quantity'] += quantity
        self.cart[addition_id]['total'] = self.cart[addition_id]['quantity'] * self.cart[addition_id]['price']
        self.save()

    def sub_addition(self, addition: Addition, quantity=1):
        addition_id = f'a_{addition.id}'
        if addition_id not in self.cart:
            return
        self.cart[addition_id]['quantity'] -= quantity
        self.cart[addition_id]['total'] = self.cart[addition_id]['quantity'] * self.cart[addition_id]['price']
        self.save()

    def save(self):
        self.session['cart'] = self.cart
        self.session.modified = True

    def remove(self, product: Product):
        if product.id in self.cart:
            del self.cart[product.id]
            if not any([True for x in self.cart.keys() if x.isdigit()]):
                self.clear()
            else:
                self.save()

    def clear(self):
        del self.session['cart']
        self.session.modified = True

    def __iter__(self):
        dish_ids = self.cart.keys()
        dishes = Product.objects.filter(id__in=dish_ids)
        for dish in dishes:
            self.cart[dish.id]['product'] = dish

        for item in self.cart.values():
            item['price'] = item['price']
            item['total_price'] = item['price'] * item['quantity']
            yield item

    def __len__(self):
        return sum(item['quantity'] for item in self.cart.values())

    def get_total_price(self):
        return sum(item['price'] * item['quantity'] for item in
                   self.cart.values())

    def get_received_cashback(self):
        return int(self.get_total_price() * 0.05)

    def get_total_count_products(self):
        return sum(item['quantity'] for item in self.cart.values())

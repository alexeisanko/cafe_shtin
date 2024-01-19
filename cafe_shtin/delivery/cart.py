from django.http.request import HttpRequest
from cafe_shtin.delivery.models import Product, Addition


class Cart:
    def __init__(self, request: HttpRequest):
        self.session = request.session
        cart = self.session.get('cart')
        cart_additions = self.session.get('cart_additions')
        if not cart:
            cart = self.session['cart'] = {}
            cart_additions = self.session['cart_additions'] = {}
        self.cart = cart
        self.cart_additions = cart_additions
        self.user = request.user

    def change(self, product: Product, quantity=1):
        product_id = str(product.id)
        if quantity > 0:
            if product_id not in self.cart:
                additions = Addition.objects.filter(additiontoproduct__product=product)
                additions = {str(addition.id): {
                    'quantity': 0,
                    'name': addition.name,
                    'price': addition.price,
                    'image': addition.image.url,
                    'total': 0,
                } for addition in additions if str(addition.id) not in self.cart_additions}
                self.cart_additions.update(additions)
                self.cart[product_id] = {'quantity': 0,
                                         'price': product.price,
                                         'image': product.image.url,
                                         'name': product.name,
                                         'weight': product.weight,
                                         'total': quantity * product.price,
                                         }
            self.cart[product_id]['quantity'] += quantity
            self.cart[product_id]['total'] = self.cart[product_id]['quantity'] * self.cart[product_id]['price']
            self.save()
        else:
            if product_id not in self.cart:
                return
            self.cart[product_id]['quantity'] += quantity
            if self.cart[product_id]['quantity'] <= 0:
                self.remove(product)
            else:
                self.cart[product_id]['total'] = self.cart[product_id]['quantity'] * self.cart[product_id]['price']
            self.save()

    def change_addition(self, addition: Addition, quantity=1):
        addition_id = str(addition.id)
        if quantity > 0:
            self.cart_additions[addition_id]['quantity'] += quantity
            self.cart_additions[addition_id]['total'] = self.cart_additions[addition_id]['quantity'] * \
                                                        self.cart_additions[addition_id]['price']
            self.save()
        else:
            if addition_id not in self.cart_additions:
                return
            self.cart_additions[addition_id]['quantity'] += quantity
            self.cart_additions[addition_id]['total'] = self.cart_additions[addition_id]['quantity'] * self.cart_additions[addition_id][
                'price']
            self.save()

    def save(self):
        self.session['cart'] = self.cart
        self.session['cart_additions'] = self.cart_additions
        self.session.modified = True

    def remove(self, product: Product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            if not any([True for x in self.cart.keys() if x.isdigit()]):
                self.clear()
            else:
                self.save()

    def clear(self):
        del self.session['cart']
        del self.session['cart_additions']
        self.session.modified = True

    # def __iter__(self):
    #     dish_ids = self.cart.keys()
    #     dishes = Product.objects.filter(id__in=dish_ids)
    #     for dish in dishes:
    #         self.cart[dish.id]['product'] = dish
    #
    #     for item in self.cart.values():
    #         item['price'] = item['price']
    #         item['total_price'] = item['price'] * item['quantity']
    #         yield item

    def __len__(self):
        return sum(item['quantity'] for item in self.cart.values())

    def get_total_price(self):
        total_product = sum(item['price'] * item['quantity'] for item in self.cart.values())
        total_addition = sum(item['price'] * item['quantity'] for item in self.cart_additions.values())
        return total_addition + total_product

    def get_received_cashback(self):
        return int(self.get_total_price() * 0.05)

    def get_total_count_products(self):
        return sum(item['quantity'] for item in self.cart.values())

    def get_total_price_with_cashback(self):
        total = self.get_total_price()
        max_sale = int(total * 0.3)
        cashback = self.user.cashback if self.user.id else 0
        current_sale = cashback if cashback < max_sale else max_sale
        return total - current_sale

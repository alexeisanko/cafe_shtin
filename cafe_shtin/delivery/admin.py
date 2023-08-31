from django.contrib import admin
from . import models


class AdditionAdmin(admin.ModelAdmin):
    list_display = ('name',)


class AdditionDishInline(admin.TabularInline):
    model = models.AdditionToDish
    raw_id_fields = ['addition_id']


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_id', 'price')
    search_fields = ('name', 'category_id', 'price')
    inlines = (AdditionDishInline,)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


admin.site.register(models.Addition, AdditionAdmin)
admin.site.register(models.Product, ProductAdmin)
admin.site.register(models.Category, CategoryAdmin)

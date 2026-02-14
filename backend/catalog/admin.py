from django.contrib import admin

from .models import Product, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "tag_list", "price", "created_at")
    search_fields = ("name",)

    def tag_list(self, obj):
        return ", ".join(obj.tags.values_list("name", flat=True))

    tag_list.short_description = "Tags"

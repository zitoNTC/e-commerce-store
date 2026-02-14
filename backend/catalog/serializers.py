from rest_framework import serializers

from .models import Product, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "created_at")
        read_only_fields = ("created_at",)


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        source="tags", many=True, queryset=Tag.objects.all(), required=False
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "tags",
            "tag_ids",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        if request is None:
            return obj.image.url
        return request.build_absolute_uri(obj.image.url)

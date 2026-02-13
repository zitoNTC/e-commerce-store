from rest_framework import serializers

from .models import Product, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name", "created_at")
        read_only_fields = ("created_at",)


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tag = TagSerializer(read_only=True)
    tag_id = serializers.PrimaryKeyRelatedField(
        source="tag", queryset=Tag.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "tag",
            "tag_id",
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

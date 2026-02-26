from pathlib import Path

from django.conf import settings
from django.core.files import File
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Product, Tag
from .seed_products import SEED_PRODUCTS
from .serializers import ProductSerializer, TagSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]

    @action(detail=False, methods=["post"], permission_classes=[IsAdminUser])
    def autoload(self, request):
        seed_dir = Path(settings.BASE_DIR) / "seed_data" / "products"
        created_count = 0
        updated_count = 0
        missing_images = []

        for item in SEED_PRODUCTS:
            product, created = Product.objects.update_or_create(
                name=item["name"],
                defaults={
                    "description": item["description"],
                    "price": item["price"],
                },
            )

            tag_names = item.get("tags", [])
            tags = []
            for tag_name in tag_names:
                tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
                tags.append(tag)
            product.tags.set(tags)

            image_name = item.get("image")
            if image_name:
                image_path = seed_dir / image_name
                if image_path.exists():
                    with image_path.open("rb") as image_file:
                        product.image.save(image_name, File(image_file), save=False)
                else:
                    missing_images.append(image_name)
            product.save()

            if created:
                created_count += 1
            else:
                updated_count += 1

        return Response(
            {
                "created": created_count,
                "updated": updated_count,
                "missing_images": missing_images,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["delete"], permission_classes=[IsAdminUser])
    def clear(self, request):
        deleted_count, _ = Product.objects.all().delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by("name")
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]

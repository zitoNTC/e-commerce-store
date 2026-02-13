from rest_framework.routers import DefaultRouter

from .views import ProductViewSet, TagViewSet

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("tags", TagViewSet, basename="tag")

urlpatterns = router.urls

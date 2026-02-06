from django.urls import path

from .views import CheckoutView, OrderDetailView, OrderListView

urlpatterns = [
    path("orders/", OrderListView.as_view(), name="orders"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/checkout/", CheckoutView.as_view(), name="checkout"),
]

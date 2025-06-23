from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("products/", views.product_list, name="product_list"),
    path("product/<slug:slug>", views.product_detail, name="product_detail"),
    path("add-to-cart/<int:product_id>", views.add_to_cart, name="add_to_cart"),
    path("cart/", views.cart_view, name="cart_view"),
    path("update/<int:cart_id>", views.update_cart, name="update_cart"),
    path(
        "remove-from-cart/<int:cart_id>",
        views.remove_from_cart,
        name="remove_from_cart",
    ),
    path("checkout/", views.checkout, name="checkout"),
    path("order/<int:order_id>", views.order_detail, name="order_detail"),
    path("orders/", views.order_history, name="order_history"),
    path("register/", views.register, name="register"),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.db.models import Q
from .models import Product, Category, Cart, Order, OrderItem
from .forms import OrderForm


def home(req):
    featured_products = Product.objects.filter(is_available=True)[:8]
    categories = Category.objects.all()
    context = {
        "featured_products": featured_products,
        "categories": categories,
    }

    return render(req, "store/home.html", context)


# --------------------- PRODUCT LIST ---------------------
def product_list(req):
    products = Product.objects.filter(is_available=True)
    categories = Category.objects.all()
    # --------------------- PRODUCT LIST -> CATEGORY SLUG  ---------------------
    category_slug = req.GET.get("category")
    if category_slug:
        products = products.filter(category__slug=category_slug)

    # --------------------- PRODUCT LIST -> SEARCH QUERY  ---------------------
    search_query = req.GET.get("search")
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query),
            Q(brand__icontains=search_query),
        )

    context = {
        "products": products,
        "categories": categories,
        "current_category": category_slug,
    }

    return render(req, "store/product_list.html", context)


# --------------------- PRODUCT DETAIL ---------------------
def product_detail(req, slug):
    product = get_object_or_404(Product, slug=slug, is_available=True)
    related_products = Product.objects.filter(
        category=product.category,
        is_available=True,
    ).exclude(id=product.id)[:4]

    context = {
        "product": product,
        "related_products": related_products,
    }

    return render(req, "store/product_detail.html", context)


# --------------------- ADD TO CART ---------------------
@login_required
def add_to_cart(req, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart_item, created = Cart.objects.get_or_create(
        user=req.user,
        product=product,
        defaults={"quantity": 1},
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    messages.success(req, f"{product.name} added to cart")
    return redirect("product_detail", slug=product.slug)


# --------------------- CART VIEW ---------------------
@login_required
def cart_view(req):
    cart_items = Cart.objects.filter(user=req.user)
    total = sum(item.total_price() for item in cart_items)

    context = {
        "cart_items": cart_items,
        "total": total,
    }

    return render(req, "store/cart.html", context)


# --------------------- UPDATE CART ---------------------
@login_required
def update_cart(req, cart_id):
    cart_item = get_object_or_404(Cart, id=cart_id, user=req.user)

    if req.method == "POST":
        quantity = int(req.POST.get("quantity", 1))
        cart_item.save()
    else:
        cart_item.delete()

    return redirect("cart_view")


# --------------------- REMOVE FROM CART ---------------------
@login_required
def remove_from_cart(req, cart_id):

    cart_item = get_object_or_404(Cart, id=cart_id, user=req.user)
    cart_item.delete()

    messages.success(req, "Item removed from cart!")
    return redirect("cart_view")


# --------------------- CHECKOUT ---------------------
@login_required
def checkout(req):
    cart_items = Cart.objects.filter(user=req.user)
    if not cart_items:
        messages.error(req, "Your cart is empty!")
        return redirect("cart_view")

    total = sum(item.total_price() for item in cart_items)

    if req.method == "POST":
        form = OrderForm(req.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = req.user
            order.total_amount = total
            order.save()

            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price,
                )

            cart_items.delete()
            messages.success(req, f"Order #{order.id} placed successfully!")
            return redirect("order_detail", order_id=order.id)
    else:
        form = OrderForm()

        context = {
            "form": form,
            "cart_items": cart_items,
            "order": order,
        }

    return render(req, "store/checkout.html", context)


# --------------------- ORDER DETAIL ---------------------
@login_required
def order_detail(req, order_id):
    order = get_object_or_404(Order, id=order_id, user=req.user)
    order_items = OrderItem.objects.filter(order=order)

    context = {
        "order": order,
        "order_items": order_items,
    }

    return render(req, "store/order_detail.html", context)


# --------------------- ORDER HISTORY ---------------------
@login_required
def order_history(req):
    orders = Order.objects.filter(user=req.user).order_by("-created_at")

    context = {"orders": orders}

    return render(req, "store/order_history.html", context)


# --------------------- REGISTER ---------------------
def register(req):
    if req.method == "POST":
        form = UserCreationForm(req.POST)

        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get("username")
            messages.success(req, f"Account created for {username}!")
            return redirect("login")
    else:
        form = UserCreationForm()

    return render(req, "registration/register.html", {"form": form})

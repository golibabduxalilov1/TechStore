from django import forms
from .models import Order


class OrderForm(object):

    class Meta:
        model = Order
        fields = ["shipping_address", "phone"]
        widgets = (
            {
                "shipping_address": forms.Textarea(
                    attrs={
                        "class": "form-control",
                        "rows": 3,
                        "placeholder": "Enter your full address",
                    }
                ),
                "phone": forms.TextInput(
                    attrs={
                        "class": "form-control",
                        "placeholder": "Enter your phone number",
                    }
                ),
            },
        )

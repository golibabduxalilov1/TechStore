# Generated by Django 5.2.3 on 2025-06-19 21:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cart',
            old_name='creared_at',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='category',
            old_name='created_add',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='created_add',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='orderitem',
            old_name='produc',
            new_name='product',
        ),
        migrations.AlterField(
            model_name='order',
            name='phone',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_address',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store.order'),
        ),
    ]

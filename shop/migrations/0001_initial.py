# Generated by Django 5.0.3 on 2024-03-26 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prodcut_name', models.CharField(max_length=50)),
                ('product_desc', models.CharField(max_length=300)),
                ('publish_date_time', models.DateTimeField()),
            ],
        ),
    ]
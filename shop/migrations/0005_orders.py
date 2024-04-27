# Generated by Django 5.0.3 on 2024-03-31 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_rename_publish_date_time_contact_msg_date_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orders',
            fields=[
                ('order_id', models.AutoField(primary_key=True, serialize=False)),
                ('items_json', models.CharField(max_length=9000)),
                ('name', models.CharField(max_length=90)),
                ('email', models.CharField(max_length=80)),
                ('address', models.CharField(max_length=500)),
                ('city', models.CharField(max_length=30)),
                ('state', models.CharField(max_length=30)),
                ('zip_code', models.CharField(max_length=15)),
            ],
        ),
    ]

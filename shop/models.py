from django.db import models


class Product(models.Model):
    product_id = models.AutoField
    prodcut_name = models.CharField(max_length=50)
    category = models.CharField(max_length=70, default="")
    sub_category = models.CharField(max_length=70, default="")
    price = models.IntegerField(default=0)
    product_desc = models.CharField(max_length=300)
    publish_date_time = models.DateTimeField()
    image = models.ImageField(upload_to="shop/images", default="")

    def __str__(self):
        return self.prodcut_name


class Contact(models.Model):
    msg_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=70, default="")
    phone = models.CharField(max_length=70, default="")
    desc = models.CharField(max_length=700)
    msg_date_time = models.DateTimeField()

    def __str__(self):
        return self.name


class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    order_amount = models.IntegerField(default=0)
    items_json = models.CharField(max_length=9000)
    name = models.CharField(max_length=90)
    email = models.CharField(max_length=80)
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=30, default="")
    phone = models.CharField(max_length=15, default="")
    state = models.CharField(max_length=30, default="")
    zip_code = models.CharField(max_length=15)
    order_date_time = models.DateTimeField(default="2024-03-31 15:45:30+0530")

    def __str__(self):
        return self.name


class OrderUpdate(models.Model):
    update_id = models.AutoField(primary_key=True)
    order_id = models.IntegerField(default="")
    update_desc = models.CharField(max_length=5000)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.order_id)+ ". " + self.update_desc[0:7] + "..."

from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Product, Contact, Orders, OrderUpdate
from math import ceil
import json
from django.http import JsonResponse


def index(request):
    allprods = []
    catprods = Product.objects.values("category", "id")
    cats = {item["category"] for item in catprods}

    for cat in cats:
        products = Product.objects.filter(category=cat)
        n = len(products)
        slides = (n // 5) + ceil((n / 5) - (n // 5))
        allprods.append([products, range(1, slides), slides])

    params = {"allprods": allprods}
    return render(request, "shop/index.html", params)


def about(request):
    return render(request, "shop/about.html")


def contact(request):
    form_submitted = False
    if request.method == "POST":
        name = request.POST.get("name", "")
        email = request.POST.get("email", "")
        phone = request.POST.get("phone", "")
        desc = request.POST.get("desc", "")
        cur_time = timezone.now()
        consumer_contact = Contact(
            name=name, email=email, phone=phone, desc=desc, msg_date_time=cur_time
        )
        consumer_contact.save()
        form_submitted = True

    return render(request, "shop/contact.html", {"form_submitted": form_submitted})


def tracker(request):
    if request.method == "POST":
        body = json.loads(request.body)
        order_id = body.get("order_id")
        email = body.get("email")
        try:
            order = Orders.objects.filter(order_id=order_id, email=email)
            if len(order) > 0:
                update = OrderUpdate.objects.filter(order_id=order_id)
                updates = []
                for item in update:
                    updates.append({"text": item.update_desc, "time": item.timestamp})
                return JsonResponse(updates, safe=False)
            else:
                return JsonResponse(
                    {"error": "Order not found"}
                )  # Return JSON error response
        except Exception as e:
            return JsonResponse({"error": str(e)})
    return render(request, "shop/tracker.html")


def SerachMatch(query, item):    
    word_list = query.split(" ")
    for word in word_list:
        if (
        word in (item.prodcut_name).lower()
        or word in (item.category).lower()
        or word in (item.sub_category).lower()
        or word in (item.product_desc).lower()
        ):
            return True

    return False


def search(request):
    query = request.GET.get("search")
    allprods = []
    if len(query.rstrip()) > 3:
        catprods = Product.objects.values("category", "id")
        cats = {item["category"] for item in catprods}

        for cat in cats:
            products_temp = Product.objects.filter(category=cat)
            prod = [item for item in products_temp if SerachMatch(query, item)]
            n = len(prod)
            slides = (n // 5) + ceil((n / 5) - (n // 5))
            if n > 0:
                allprods.append([prod, range(1, slides), slides])

        params = {"allprods": allprods, "query": query}

    if len(allprods) < 1:
        params = {"msg": "Sorry, no results found"}
    return render(request, "shop/search.html", params)


def products(request, myid):
    product = get_object_or_404(Product, id=myid)
    return render(request, "shop/products.html", {"product": product})


def checkout(request):
    order_place = False
    id = 0
    if request.method == "POST":
        items_json = request.POST.get("item_json", "")
        order_amount = request.POST.get("order_amount", "")
        name = request.POST.get("name", "")
        email = request.POST.get("email", "")
        address = (
            request.POST.get("address", "") + " " + request.POST.get("address2", "")
        )
        city = request.POST.get("city", "")
        state = request.POST.get("state", "")
        zip_code = request.POST.get("zip_code", "")
        phone = request.POST.get("phone", "")
        order_date_time = timezone.now()
        print(order_date_time)
        new_order = Orders(
            items_json=items_json,
            order_amount=order_amount,
            name=name,
            email=email,
            address=address,
            city=city,
            state=state,
            zip_code=zip_code,
            phone=phone,
            order_date_time=order_date_time,
        )
        new_order.save()
        id = new_order.order_id
        order_update = OrderUpdate(order_id=id, update_desc="The Order has been Placed")
        order_update.save()
        order_place = True

    return render(
        request, "shop/checkout.html", {"order_place": order_place, "order_id": id}
    )


def orders(request):
    all_orders = Orders.objects.all()

    all_order_list = []
    for order in all_orders:
        try:
            cart = json.loads(order.items_json)
        except:
            cart = {}
        order_details = {}

        day_cart = []
        for item in cart:
            item_dict = {}
            product_id = item.split("_")[2]
            products = Product.objects.filter(id=product_id)
            product_name = ""
            product_price = ""
            for product in products:
                product_name = product.prodcut_name
                product_price = product.price

            item_dict["product_id"] = product_id
            item_dict["product_name"] = product_name
            item_dict["product_price"] = product_price
            item_dict["product_quantity"] = cart[item]
            day_cart.append(item_dict)

        order_details["order_id"] = order.order_id
        order_details["customer_name"] = order.name
        order_details["customer_phone"] = order.phone
        order_details["customer_email"] = order.email
        order_details["customer_pin_code"] = order.zip_code
        order_details["paid_amount"] = order.order_amount
        order_details["order_cart"] = day_cart

        all_order_list.append(order_details)

    params = {"orders": all_order_list[::-1]}
    return render(request, "shop/orders.html", params)

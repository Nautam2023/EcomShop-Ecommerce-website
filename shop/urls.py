from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="ShopHome"),
    path("about/", views.about, name="AboutUs"),
    path("contact/", views.contact, name="ContactUs"),
    path("tracker/", views.tracker, name="TrackerStatus"),
    path("search/", views.search, name="Search"),
    path("products/<int:myid>/", views.products, name="Products"),
    path("checkout/", views.checkout, name="Checkout"),
    path("orders/", views.orders, name="Orders"),
]
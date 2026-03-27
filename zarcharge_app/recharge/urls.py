# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello, name='hello'),
    path('countries/', views.countries, name='countries'),
    path('sync-operators/', views.sync_operators, name='sync-operators'),
    path('operators/', views.list_operators, name='operators'),
    path('transactions/', views.create_transaction, name='transactions'),
]
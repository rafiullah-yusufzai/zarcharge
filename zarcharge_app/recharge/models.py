from django.db import models

class Operator(models.Model):
    provider_code = models.CharField(max_length=50)
    sku_code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    receive_value = models.DecimalField(max_digits=10, decimal_places=2)
    receive_currency = models.CharField(max_length=10)
    send_value = models.DecimalField(max_digits=10, decimal_places=2)
    send_currency = models.CharField(max_length=10)
    commission_rate = models.FloatField()
    region_code = models.CharField(max_length=10)
    validity = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

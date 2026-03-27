from rest_framework.response import Response
from rest_framework.decorators import api_view
from .services.ding import DingClient
from .models import Operator

@api_view(['GET'])
def hello(request):
    return Response({"message": "API working 🎉"})


@api_view(['GET'])
def countries(request):
    client = DingClient()
    data = client.get_countries()
    return Response(data)


@api_view(['GET'])
def sync_operators(request):
    client = DingClient()
    data = client.get_products()

    items = data.get("Items", [])

    saved = 0

    for item in items:
        if "Mobile" not in item.get("Benefits", []):
            continue

        Operator.objects.update_or_create(
            sku_code=item["SkuCode"],
            defaults={
                "provider_code": item["ProviderCode"],
                "name": item["DefaultDisplayText"],
                "receive_value": item["Maximum"]["ReceiveValue"],
                "receive_currency": item["Maximum"]["ReceiveCurrencyIso"],
                "send_value": item["Maximum"]["SendValue"],
                "send_currency": item["Maximum"]["SendCurrencyIso"],
                "commission_rate": item["CommissionRate"],
                "region_code": item["RegionCode"],
                "validity": item.get("ValidityPeriodIso", "")
            }
        )
        saved += 1

    return Response({"saved": saved})


from rest_framework.serializers import ModelSerializer


class OperatorSerializer(ModelSerializer):
    class Meta:
        model = Operator
        fields = "__all__"


@api_view(['GET'])
def list_operators(request):
    operators = Operator.objects.all()
    serializer = OperatorSerializer(operators, many=True)
    return Response(serializer.data)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def create_transaction(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Process the transaction
            # This is where you'd integrate with your top-up provider
            return JsonResponse({
                'status': 'success',
                'transaction_id': '123456',
                'message': 'Top-up successful'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
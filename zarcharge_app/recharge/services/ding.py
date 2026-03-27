import requests
from django.conf import settings

BASE_URL = "https://api.dingconnect.com/api/V1/"

class DingClient:
    def __init__(self):
        self.headers = {
            "api_key": settings.DING_API_KEY,        
        }


    def get_countries(self):
        url = BASE_URL + "GetCountries"
        response = requests.get(url, headers=self.headers)
        return response.json()

    def get_products(self):
        url = BASE_URL + "GetProducts"

        params = {
            "countryIsos": "AF"
        }

        response = requests.get(url, headers=self.headers, params=params)
        return response.json()


    
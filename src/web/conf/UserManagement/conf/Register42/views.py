from django.http import JsonResponse
import requests
import os
import json

def register_42(request, format=None):
    hostname = request.get_host()
    redirect_uri = f"https://{hostname}/api/register-42/"
    
    body = {
        "grant_type": "authorization_code",
        "client_id": os.getenv("client_id"),
        "client_secret": os.getenv("client_secret"),
        "code": request.query_params["code"],
        "redirect_uri": redirect_uri
    }
    headers = {"Content-Type": "application/json; charset=utf-8"}
    r = requests.post('https://api.intra.42.fr/oauth/token', headers=headers, json=body)
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get('https://api.intra.42.fr/v2/me', headers=headers, json=body)
    if r.status_code != 200:
        return JsonResponse({"error": "Invalid access token"}, status=400)
    else:
        user = r.json()
        return JsonResponse(user, status=200)
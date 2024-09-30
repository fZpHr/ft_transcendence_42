from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
import requests
import os
import logging

logger = logging.getLogger('print')

def register_42(request):
    hostname = request.get_host()
    redirect_uri = f"https://{hostname}/users/register-42/"
    
    code = request.GET.get("code")
    if code is None:
        logger.info(f'Redirecting to 42 OAuth2')
        return HttpResponseRedirect(f"https://api.intra.42.fr/oauth/authorize?client_id={os.getenv('client_id')}&redirect_uri={redirect_uri}&response_type=code")
    logger.info(f'code: {code}')
    logger.info(f'redirect_uri: {redirect_uri}')
    body = {
        "grant_type": "authorization_code",
        "client_id": os.getenv("client_id"),
        "client_secret": os.getenv("client_secret"),
        "code": code,
        "redirect_uri": redirect_uri
    }
    logger.info(f'body: {body}')
    headers = {"Content-Type": "application/json; charset=utf-8"}
    r = requests.post('https://api.intra.42.fr/oauth/token', headers=headers, json=body)
    
    if r.status_code != 200:
        logger.error(f'Failed to get access token: {r.status_code} {r.text}')
        return JsonResponse({"error": "Failed to get access token"}, status=400)
    
    response_json = r.json()
    if "access_token" not in response_json:
        logger.error(f'Access token not found in response: {response_json}')
        return JsonResponse({"error": "Access token not found"}, status=400)
    
    token = response_json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    
    if r.status_code != 200:
        logger.error(f'Failed to get user info: {r.status_code} {r.text}')
        return JsonResponse({"error": "Invalid access token"}, status=400)

    response = redirect('https://localhost/')
    
    response.set_cookie('token_user42', token, httponly=True)
    
    return response

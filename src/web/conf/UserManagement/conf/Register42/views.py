import logging
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
import requests
import os
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger('print')

def get_token(code, redirect_uri):
    logger.info(f'code: {code}, redirect_uri: {redirect_uri}')
    body = {
        "grant_type": "authorization_code",
        "client_id": os.getenv("client_id"),
        "client_secret": os.getenv("client_secret"),
        "code": code,
        "redirect_uri": redirect_uri
    }  
    headers = {"Content-Type": "application/json; charset=utf-8"}
    r = requests.post('https://api.intra.42.fr/oauth/token', headers=headers, json=body)
    return r , redirect_uri

def try_all_redirect_uris(code):
    redirect_uris = [
        "https://1A1.42angouleme.fr:42424/users/register-42/",
        "https://1A2.42angouleme.fr:42424/users/register-42/",
        "https://1A3.42angouleme.fr:42424/users/register-42/",
        "https://1A4.42angouleme.fr:42424/users/register-42/",
        "https://1A5.42angouleme.fr:42424/users/register-42/",
        "https://1A6.42angouleme.fr:42424/users/register-42/",
        "https://1A7.42angouleme.fr:42424/users/register-42/",
        "https://1B1.42angouleme.fr:42424/users/register-42/",
        "https://1B2.42angouleme.fr:42424/users/register-42/",
        "https://1B3.42angouleme.fr:42424/users/register-42/",
        "https://1B4.42angouleme.fr:42424/users/register-42/",
        "https://1B5.42angouleme.fr:42424/users/register-42/",
        "https://1B6.42angouleme.fr:42424/users/register-42/",
        "https://1B7.42angouleme.fr:42424/users/register-42/",
        "https://1C1.42angouleme.fr:42424/users/register-42/",
        "https://1C2.42angouleme.fr:42424/users/register-42/",
        "https://1C3.42angouleme.fr:42424/users/register-42/",
        "https://1C4.42angouleme.fr:42424/users/register-42/",
        "https://1C5.42angouleme.fr:42424/users/register-42/",
        "https://1C6.42angouleme.fr:42424/users/register-42/",
        "https://1C7.42angouleme.fr:42424/users/register-42/",
        "https://1D1.42angouleme.fr:42424/users/register-42/",
        "https://1D2.42angouleme.fr:42424/users/register-42/",
        "https://1D3.42angouleme.fr:42424/users/register-42/",
        "https://1D4.42angouleme.fr:42424/users/register-42/",
        "https://1D5.42angouleme.fr:42424/users/register-42/",
        "https://1D6.42angouleme.fr:42424/users/register-42/",
        "https://1D7.42angouleme.fr:42424/users/register-42/",
        "https://1E1.42angouleme.fr:42424/users/register-42/",
        "https://1E2.42angouleme.fr:42424/users/register-42/",
        "https://1E3.42angouleme.fr:42424/users/register-42/",
        "https://1E4.42angouleme.fr:42424/users/register-42/",
        "https://1E5.42angouleme.fr:42424/users/register-42/",
        "https://1E6.42angouleme.fr:42424/users/register-42/",
        "https://1E7.42angouleme.fr:42424/users/register-42/",
        "https://1F1.42angouleme.fr:42424/users/register-42/",
        "https://1F2.42angouleme.fr:42424/users/register-42/",
        "https://1F3.42angouleme.fr:42424/users/register-42/",
        "https://1F4.42angouleme.fr:42424/users/register-42/",
        "https://1F5.42angouleme.fr:42424/users/register-42/",
        "https://1F6.42angouleme.fr:42424/users/register-42/",
        "https://1F7.42angouleme.fr:42424/users/register-42/",
        "https://1G1.42angouleme.fr:42424/users/register-42/",
        "https://1G2.42angouleme.fr:42424/users/register-42/",
        "https://1G3.42angouleme.fr:42424/users/register-42/",
        "https://1G4.42angouleme.fr:42424/users/register-42/",
        "https://1G5.42angouleme.fr:42424/users/register-42/",
        "https://1G6.42angouleme.fr:42424/users/register-42/",
        "https://1G7.42angouleme.fr:42424/users/register-42/",
        "https://2A1.42angouleme.fr:42424/users/register-42/",
        "https://2A2.42angouleme.fr:42424/users/register-42/",
        "https://2A3.42angouleme.fr:42424/users/register-42/",
        "https://2A4.42angouleme.fr:42424/users/register-42/",
        "https://2A5.42angouleme.fr:42424/users/register-42/",
        "https://2A6.42angouleme.fr:42424/users/register-42/",
        "https://2A7.42angouleme.fr:42424/users/register-42/",
        "https://2B1.42angouleme.fr:42424/users/register-42/",
        "https://2B2.42angouleme.fr:42424/users/register-42/",
        "https://2B3.42angouleme.fr:42424/users/register-42/",
        "https://2B4.42angouleme.fr:42424/users/register-42/",
        "https://2B5.42angouleme.fr:42424/users/register-42/",
        "https://2B6.42angouleme.fr:42424/users/register-42/",
        "https://2B7.42angouleme.fr:42424/users/register-42/",
        "https://2C1.42angouleme.fr:42424/users/register-42/",
        "https://2C2.42angouleme.fr:42424/users/register-42/",
        "https://2C3.42angouleme.fr:42424/users/register-42/",
        "https://2C4.42angouleme.fr:42424/users/register-42/",
        "https://2C5.42angouleme.fr:42424/users/register-42/",
        "https://2C6.42angouleme.fr:42424/users/register-42/",
        "https://2C7.42angouleme.fr:42424/users/register-42/",
        "https://2D1.42angouleme.fr:42424/users/register-42/",
        "https://2D2.42angouleme.fr:42424/users/register-42/",
        "https://2D3.42angouleme.fr:42424/users/register-42/",
        "https://2D4.42angouleme.fr:42424/users/register-42/",
        "https://2D5.42angouleme.fr:42424/users/register-42/",
        "https://2D6.42angouleme.fr:42424/users/register-42/",
        "https://2D7.42angouleme.fr:42424/users/register-42/",
        "https://2E1.42angouleme.fr:42424/users/register-42/",
        "https://2E2.42angouleme.fr:42424/users/register-42/",
        "https://2E3.42angouleme.fr:42424/users/register-42/",
        "https://2E4.42angouleme.fr:42424/users/register-42/",
        "https://2E5.42angouleme.fr:42424/users/register-42/",
        "https://2E6.42angouleme.fr:42424/users/register-42/",
        "https://2E7.42angouleme.fr:42424/users/register-42/",
        "https://2F1.42angouleme.fr:42424/users/register-42/",
        "https://2F2.42angouleme.fr:42424/users/register-42/",
        "https://2F3.42angouleme.fr:42424/users/register-42/",
        "https://2F4.42angouleme.fr:42424/users/register-42/",
        "https://2F5.42angouleme.fr:42424/users/register-42/",
        "https://2F6.42angouleme.fr:42424/users/register-42/",
        "https://2F7.42angouleme.fr:42424/users/register-42/",
        "https://2G1.42angouleme.fr:42424/users/register-42/",
        "https://2G2.42angouleme.fr:42424/users/register-42/",
        "https://2G3.42angouleme.fr:42424/users/register-42/",
        "https://2G4.42angouleme.fr:42424/users/register-42/",
        "https://2G5.42angouleme.fr:42424/users/register-42/",
        "https://2G6.42angouleme.fr:42424/users/register-42/",
        "https://2g7.42angouleme.fr:42424/users/register-42/",
        "https://3A1.42angouleme.fr:42424/users/register-42/",
        "https://3A2.42angouleme.fr:42424/users/register-42/",
        "https://3A3.42angouleme.fr:42424/users/register-42/",
        "https://3A4.42angouleme.fr:42424/users/register-42/",
        "https://3A5.42angouleme.fr:42424/users/register-42/",
        "https://3A6.42angouleme.fr:42424/users/register-42/",
        "https://3A7.42angouleme.fr:42424/users/register-42/",
        "https://3B1.42angouleme.fr:42424/users/register-42/",
        "https://3B2.42angouleme.fr:42424/users/register-42/",
        "https://3B3.42angouleme.fr:42424/users/register-42/",
        "https://3B4.42angouleme.fr:42424/users/register-42/",
        "https://3B5.42angouleme.fr:42424/users/register-42/",
        "https://3B6.42angouleme.fr:42424/users/register-42/",
        "https://3B7.42angouleme.fr:42424/users/register-42/",
        "https://3C1.42angouleme.fr:42424/users/register-42/",
        "https://3C2.42angouleme.fr:42424/users/register-42/",
        "https://3C3.42angouleme.fr:42424/users/register-42/",
        "https://3C4.42angouleme.fr:42424/users/register-42/",
        "https://3C5.42angouleme.fr:42424/users/register-42/",
        "https://3C6.42angouleme.fr:42424/users/register-42/",
        "https://3C7.42angouleme.fr:42424/users/register-42/",
        "https://3D1.42angouleme.fr:42424/users/register-42/",
        "https://3D2.42angouleme.fr:42424/users/register-42/",
        "https://3D3.42angouleme.fr:42424/users/register-42/",
        "https://3D4.42angouleme.fr:42424/users/register-42/",
        "https://3D5.42angouleme.fr:42424/users/register-42/",
        "https://3D6.42angouleme.fr:42424/users/register-42/",
        "https://3D7.42angouleme.fr:42424/users/register-42/",
        "https://3E1.42angouleme.fr:42424/users/register-42/",
        "https://3E2.42angouleme.fr:42424/users/register-42/",
        "https://3E3.42angouleme.fr:42424/users/register-42/",
        "https://3E4.42angouleme.fr:42424/users/register-42/",
        "https://3E5.42angouleme.fr:42424/users/register-42/",
        "https://3E6.42angouleme.fr:42424/users/register-42/",
        "https://3E7.42angouleme.fr:42424/users/register-42/",
        "https://3F1.42angouleme.fr:42424/users/register-42/",
        "https://3F2.42angouleme.fr:42424/users/register-42/",
        "https://3F3.42angouleme.fr:42424/users/register-42/",
        "https://3F4.42angouleme.fr:42424/users/register-42/",
        "https://3F5.42angouleme.fr:42424/users/register-42/",
        "https://3F6.42angouleme.fr:42424/users/register-42/",
        "https://3F7.42angouleme.fr:42424/users/register-42/",
        "https://3G1.42angouleme.fr:42424/users/register-42/",
        "https://3G2.42angouleme.fr:42424/users/register-42/",
        "https://3G3.42angouleme.fr:42424/users/register-42/",
        "https://3G4.42angouleme.fr:42424/users/register-42/",
        "https://3G5.42angouleme.fr:42424/users/register-42/",
        "https://3G6.42angouleme.fr:42424/users/register-42/",
        "https://3G7.42angouleme.fr:42424/users/register-42/",
        "https://localhost:42424/users/register-42/",
        "https://localhost/users/register-42/",
    ]
    
    with ThreadPoolExecutor(max_workers=len(redirect_uris)) as executor:
        future_to_uri = {executor.submit(get_token, code, uri): uri for uri in redirect_uris}
        for future in as_completed(future_to_uri):
            response, redirect_uri = future.result()
            logger.info(f'response: {response}')
            if response.status_code == 200:
                return response, redirect_uri
    return None, None

def register_42(request):
    logger.info(f'request: {request}')
    code = request.GET.get("code")
    if code is None:
        redirect_uri = request.build_absolute_uri()
        return HttpResponseRedirect(f"https://api.intra.42.fr/oauth/authorize?client_id={os.getenv('client_id')}&redirect_uri={redirect_uri}&response_type=code")

    response, successful_redirect_uri = try_all_redirect_uris(code)
    if response is None:
        return JsonResponse({"error": "Failed to get access token for all redirect URIs"}, status=400)

    response_json = response.json()
    if "access_token" not in response_json:
        logger.error(f'Access token not found in response: {response_json}')
        return JsonResponse({"error": "Access token not found"}, status=400)
    
    token = response_json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    
    if r.status_code != 200:
        logger.error(f'Failed to get user info: {r.status_code} {r.text}')
        return JsonResponse({"error": "Invalid access token"}, status=400)
    
    user, created = User.objects.get_or_create(username=r.json()["login"])
    if created:
        user.set_unusable_password()
        user.save()
    
    login(request, user)

    response = redirect(successful_redirect_uri.replace('/users/register-42', ''))
    response.set_cookie('token', token)
    response.set_cookie('user42', r.json()["login"])
    response.set_cookie('connected', 'true')
    
    return response


def logout_view(request):
    logout(request)
    response = JsonResponse({'message': 'Logged out successfully'})
    response.delete_cookie('token')
    response.delete_cookie('user42')
    response.delete_cookie('connected')
    return response
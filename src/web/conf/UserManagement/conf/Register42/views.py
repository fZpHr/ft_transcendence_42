import logging
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
import requests
import os
from django.contrib.auth import login, logout
from concurrent.futures import ThreadPoolExecutor, as_completed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import User

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
        "https://1a1.42angouleme.fr:42424/users/register-42/",
        "https://1a2.42angouleme.fr:42424/users/register-42/",
        "https://1a3.42angouleme.fr:42424/users/register-42/",
        "https://1a4.42angouleme.fr:42424/users/register-42/",
        "https://1a5.42angouleme.fr:42424/users/register-42/",
        "https://1a6.42angouleme.fr:42424/users/register-42/",
        "https://1a7.42angouleme.fr:42424/users/register-42/",
        "https://1b1.42angouleme.fr:42424/users/register-42/",
        "https://1b2.42angouleme.fr:42424/users/register-42/",
        "https://1b3.42angouleme.fr:42424/users/register-42/",
        "https://1b4.42angouleme.fr:42424/users/register-42/",
        "https://1b5.42angouleme.fr:42424/users/register-42/",
        "https://1b6.42angouleme.fr:42424/users/register-42/",
        "https://1b7.42angouleme.fr:42424/users/register-42/",
        "https://1c1.42angouleme.fr:42424/users/register-42/",
        "https://1c2.42angouleme.fr:42424/users/register-42/",
        "https://1c3.42angouleme.fr:42424/users/register-42/",
        "https://1c4.42angouleme.fr:42424/users/register-42/",
        "https://1c5.42angouleme.fr:42424/users/register-42/",
        "https://1c6.42angouleme.fr:42424/users/register-42/",
        "https://1c7.42angouleme.fr:42424/users/register-42/",
        "https://1d1.42angouleme.fr:42424/users/register-42/",
        "https://1d2.42angouleme.fr:42424/users/register-42/",
        "https://1d3.42angouleme.fr:42424/users/register-42/",
        "https://1d4.42angouleme.fr:42424/users/register-42/",
        "https://1d5.42angouleme.fr:42424/users/register-42/",
        "https://1d6.42angouleme.fr:42424/users/register-42/",
        "https://1d7.42angouleme.fr:42424/users/register-42/",
        "https://1e1.42angouleme.fr:42424/users/register-42/",
        "https://1e2.42angouleme.fr:42424/users/register-42/",
        "https://1e3.42angouleme.fr:42424/users/register-42/",
        "https://1e4.42angouleme.fr:42424/users/register-42/",
        "https://1e5.42angouleme.fr:42424/users/register-42/",
        "https://1e6.42angouleme.fr:42424/users/register-42/",
        "https://1e7.42angouleme.fr:42424/users/register-42/",
        "https://1f1.42angouleme.fr:42424/users/register-42/",
        "https://1f2.42angouleme.fr:42424/users/register-42/",
        "https://1f3.42angouleme.fr:42424/users/register-42/",
        "https://1f4.42angouleme.fr:42424/users/register-42/",
        "https://1f5.42angouleme.fr:42424/users/register-42/",
        "https://1f6.42angouleme.fr:42424/users/register-42/",
        "https://1f7.42angouleme.fr:42424/users/register-42/",
        "https://1g1.42angouleme.fr:42424/users/register-42/",
        "https://1g2.42angouleme.fr:42424/users/register-42/",
        "https://1g3.42angouleme.fr:42424/users/register-42/",
        "https://1g4.42angouleme.fr:42424/users/register-42/",
        "https://1g5.42angouleme.fr:42424/users/register-42/",
        "https://1g6.42angouleme.fr:42424/users/register-42/",
        "https://1g7.42angouleme.fr:42424/users/register-42/",
        "https://2a1.42angouleme.fr:42424/users/register-42/",
        "https://2a2.42angouleme.fr:42424/users/register-42/",
        "https://2a3.42angouleme.fr:42424/users/register-42/",
        "https://2a4.42angouleme.fr:42424/users/register-42/",
        "https://2a5.42angouleme.fr:42424/users/register-42/",
        "https://2a6.42angouleme.fr:42424/users/register-42/",
        "https://2a7.42angouleme.fr:42424/users/register-42/",
        "https://2b1.42angouleme.fr:42424/users/register-42/",
        "https://2b2.42angouleme.fr:42424/users/register-42/",
        "https://2b3.42angouleme.fr:42424/users/register-42/",
        "https://2b4.42angouleme.fr:42424/users/register-42/",
        "https://2b5.42angouleme.fr:42424/users/register-42/",
        "https://2b6.42angouleme.fr:42424/users/register-42/",
        "https://2b7.42angouleme.fr:42424/users/register-42/",
        "https://2c1.42angouleme.fr:42424/users/register-42/",
        "https://2c2.42angouleme.fr:42424/users/register-42/",
        "https://2c3.42angouleme.fr:42424/users/register-42/",
        "https://2c4.42angouleme.fr:42424/users/register-42/",
        "https://2c5.42angouleme.fr:42424/users/register-42/",
        "https://2c6.42angouleme.fr:42424/users/register-42/",
        "https://2c7.42angouleme.fr:42424/users/register-42/",
        "https://2d1.42angouleme.fr:42424/users/register-42/",
        "https://2d2.42angouleme.fr:42424/users/register-42/",
        "https://2d3.42angouleme.fr:42424/users/register-42/",
        "https://2d4.42angouleme.fr:42424/users/register-42/",
        "https://2d5.42angouleme.fr:42424/users/register-42/",
        "https://2d6.42angouleme.fr:42424/users/register-42/",
        "https://2d7.42angouleme.fr:42424/users/register-42/",
        "https://2e1.42angouleme.fr:42424/users/register-42/",
        "https://2e2.42angouleme.fr:42424/users/register-42/",
        "https://2e3.42angouleme.fr:42424/users/register-42/",
        "https://2e4.42angouleme.fr:42424/users/register-42/",
        "https://2e5.42angouleme.fr:42424/users/register-42/",
        "https://2e6.42angouleme.fr:42424/users/register-42/",
        "https://2e7.42angouleme.fr:42424/users/register-42/",
        "https://2f1.42angouleme.fr:42424/users/register-42/",
        "https://2f2.42angouleme.fr:42424/users/register-42/",
        "https://2f3.42angouleme.fr:42424/users/register-42/",
        "https://2f4.42angouleme.fr:42424/users/register-42/",
        "https://2f5.42angouleme.fr:42424/users/register-42/",
        "https://2f6.42angouleme.fr:42424/users/register-42/",
        "https://2f7.42angouleme.fr:42424/users/register-42/",
        "https://2g1.42angouleme.fr:42424/users/register-42/",
        "https://2g2.42angouleme.fr:42424/users/register-42/",
        "https://2g3.42angouleme.fr:42424/users/register-42/",
        "https://2g4.42angouleme.fr:42424/users/register-42/",
        "https://2g5.42angouleme.fr:42424/users/register-42/",
        "https://2g6.42angouleme.fr:42424/users/register-42/",
        "https://2g7.42angouleme.fr:42424/users/register-42/",
        "https://3a1.42angouleme.fr:42424/users/register-42/",
        "https://3a2.42angouleme.fr:42424/users/register-42/",
        "https://3a3.42angouleme.fr:42424/users/register-42/",
        "https://3a4.42angouleme.fr:42424/users/register-42/",
        "https://3a5.42angouleme.fr:42424/users/register-42/",
        "https://3a6.42angouleme.fr:42424/users/register-42/",
        "https://3a7.42angouleme.fr:42424/users/register-42/",
        "https://3b1.42angouleme.fr:42424/users/register-42/",
        "https://3b2.42angouleme.fr:42424/users/register-42/",
        "https://3b3.42angouleme.fr:42424/users/register-42/",
        "https://3b4.42angouleme.fr:42424/users/register-42/",
        "https://3b5.42angouleme.fr:42424/users/register-42/",
        "https://3b6.42angouleme.fr:42424/users/register-42/",
        "https://3b7.42angouleme.fr:42424/users/register-42/",
        "https://3c1.42angouleme.fr:42424/users/register-42/",
        "https://3c2.42angouleme.fr:42424/users/register-42/",
        "https://3c3.42angouleme.fr:42424/users/register-42/",
        "https://3c4.42angouleme.fr:42424/users/register-42/",
        "https://3c5.42angouleme.fr:42424/users/register-42/",
        "https://3c6.42angouleme.fr:42424/users/register-42/",
        "https://3c7.42angouleme.fr:42424/users/register-42/",
        "https://3d1.42angouleme.fr:42424/users/register-42/",
        "https://3d2.42angouleme.fr:42424/users/register-42/",
        "https://3d3.42angouleme.fr:42424/users/register-42/",
        "https://3d4.42angouleme.fr:42424/users/register-42/",
        "https://3d5.42angouleme.fr:42424/users/register-42/",
        "https://3d6.42angouleme.fr:42424/users/register-42/",
        "https://3d7.42angouleme.fr:42424/users/register-42/",
        "https://3e1.42angouleme.fr:42424/users/register-42/",
        "https://3e2.42angouleme.fr:42424/users/register-42/",
        "https://3e3.42angouleme.fr:42424/users/register-42/",
        "https://3e4.42angouleme.fr:42424/users/register-42/",
        "https://3e5.42angouleme.fr:42424/users/register-42/",
        "https://3e6.42angouleme.fr:42424/users/register-42/",
        "https://3e7.42angouleme.fr:42424/users/register-42/",
        "https://3f1.42angouleme.fr:42424/users/register-42/",
        "https://3f2.42angouleme.fr:42424/users/register-42/",
        "https://3f3.42angouleme.fr:42424/users/register-42/",
        "https://3f4.42angouleme.fr:42424/users/register-42/",
        "https://3f5.42angouleme.fr:42424/users/register-42/",
        "https://3f6.42angouleme.fr:42424/users/register-42/",
        "https://3f7.42angouleme.fr:42424/users/register-42/",
        "https://3g1.42angouleme.fr:42424/users/register-42/",
        "https://3g2.42angouleme.fr:42424/users/register-42/",
        "https://3g3.42angouleme.fr:42424/users/register-42/",
        "https://3g4.42angouleme.fr:42424/users/register-42/",
        "https://3g5.42angouleme.fr:42424/users/register-42/",
        "https://3g6.42angouleme.fr:42424/users/register-42/",
        "https://3g7.42angouleme.fr:42424/users/register-42/",
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
        return JsonResponse({"error": "accept data or you can't access to the website"}, status=400)

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
    response.set_cookie('user42', r.json()["login"])
    response.set_cookie('connected', 'true')
    
    return response


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    response = JsonResponse({"message": "Logged out"})
    response.delete_cookie('token')
    response.delete_cookie('user42')
    response.delete_cookie('connected')
    return response
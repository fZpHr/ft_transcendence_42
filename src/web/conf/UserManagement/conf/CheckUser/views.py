from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import requests
import logging

logger = logging.getLogger('print')

@csrf_exempt
@require_POST
def check_user(request):
    token = request.COOKIES.get("token")
    if not token:
        return JsonResponse({'status': 'error'})
    logger.info('token: ' + token)
    
    headers = {
        'Authorization': 'Bearer ' + token,
    }
    r = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
    data = r.json()
    
    if data['login'] != request.COOKIES.get('user42'):
        return JsonResponse({'status': 'error'})
    if r.status_code == 200:
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error'})

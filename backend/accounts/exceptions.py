from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import exception_handler
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(exc, (InvalidToken, TokenError, AuthenticationFailed)):
        response.delete_cookie(settings.JWT_COOKIE_NAME, path="/")
        response.delete_cookie(settings.JWT_REFRESH_COOKIE_NAME, path="/")

    return response

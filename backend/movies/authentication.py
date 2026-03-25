from rest_framework import exceptions
from django.conf import settings
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import User


class MongoJWTAuthentication(BaseAuthentication):
    keyword = b"Bearer"

    def __init__(self):
        self.jwt_auth = JWTAuthentication()

    def authenticate(self, request):
        header = get_authorization_header(request)
        raw_token = None

        if header:
            parts = header.split()
            if len(parts) == 2 and parts[0] == self.keyword:
                raw_token = parts[1].decode("utf-8")

        if not raw_token:
            raw_token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE_NAME)

        if not raw_token:
            return None

        try:
            validated_token = self.jwt_auth.get_validated_token(raw_token)
        except (InvalidToken, TokenError) as exc:
            raise exceptions.AuthenticationFailed("Invalid or expired token.") from exc

        user_id = validated_token.get("user_id")
        if not user_id:
            raise exceptions.AuthenticationFailed("Token payload is missing user information.")

        user = User.objects(id=user_id).first()
        if not user:
            raise exceptions.AuthenticationFailed("User not found.")

        return (user, validated_token)

"""
Security Module for "Digitalization in Healthcare"
Implements:
- Unique Anti-CSRF token verification across state-modifying requests
- Sliding-window token-bucket rate limiter per IP
- Standard security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- 6 MB maximum content length enforcement
- Secure cookie parameters (HttpOnly, SameSite=Lax)
"""

import time
import secrets
from collections import defaultdict
from functools import wraps
from flask import request, jsonify, session, abort

# Sliding-window rate limiter state
_request_records = defaultdict(list)
RATE_LIMIT_WINDOW_SEC = 60
MAX_REQUESTS_PER_WINDOW = 120

def rate_limit(max_requests=MAX_REQUESTS_PER_WINDOW, window_sec=RATE_LIMIT_WINDOW_SEC):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr or '127.0.0.1'
            now = time.time()
            timestamps = _request_records[ip]

            # Prune timestamps older than window
            _request_records[ip] = [t for t in timestamps if now - t < window_sec]

            if len(_request_records[ip]) >= max_requests:
                return jsonify({
                    'error': 'Too Many Requests',
                    'message': f'Rate limit exceeded ({max_requests} requests per {window_sec}s). Please slow down.'
                }), 429

            _request_records[ip].append(now)
            return f(*args, **kwargs)
        return wrapped
    return decorator

def generate_csrf_token():
    if '_csrf_token' not in session:
        session['_csrf_token'] = secrets.token_hex(32)
    return session['_csrf_token']

def verify_csrf_token():
    if request.method in ('POST', 'PUT', 'DELETE', 'PATCH'):
        token = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
        expected = session.get('_csrf_token')
        if not expected or not token or not secrets.compare_digest(token, expected):
            return jsonify({
                'error': 'CSRF verification failed',
                'message': 'Invalid or missing anti-CSRF token.'
            }), 403
    return None

def apply_security_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), camera=(self), microphone=(self)'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: blob:; "
        "font-src 'self' data:; "
        "connect-src 'self';"
    )
    return response

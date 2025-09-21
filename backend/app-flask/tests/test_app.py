import pytest

import sys, os

# Ensure parent directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app import app

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_root(client):
    resp = client.get('/')
    assert resp.status_code == 200

def test_health(client):
    resp = client.get('/healthz')
    assert resp.status_code == 200
    assert resp.json.get('status') == 'ok'

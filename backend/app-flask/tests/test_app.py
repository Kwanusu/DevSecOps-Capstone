import pytest
from app.app import app

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

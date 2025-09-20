import requests
import random
import time

# Change this to your Flask service LoadBalancer or NodePort URL
BASE_URL = "http://<APP-SERVICE-IP>:5000"

# Normal endpoints
endpoints = ["/", "/healthz"]

# Error endpoints (simulate failures)
error_endpoints = ["/doesnotexist", "/fail"]  # you can add /fail route in Flask

def generate_traffic():
    while True:
        # 80% normal traffic, 20% error traffic
        if random.random() < 0.8:
            endpoint = random.choice(endpoints)
        else:
            endpoint = random.choice(error_endpoints)

        url = f"{BASE_URL}{endpoint}"
        try:
            response = requests.get(url, timeout=2)
            print(f"{time.strftime('%H:%M:%S')} -> {endpoint} [{response.status_code}]")
        except requests.exceptions.RequestException as e:
            print(f"{time.strftime('%H:%M:%S')} -> {endpoint} [ERROR: {e}]")
        
        # Random pause between requests (0.2–1s)
        time.sleep(random.uniform(0.2, 1.0))

if __name__ == "__main__":
    print(f"Generating traffic to {BASE_URL} ...")
    generate_traffic()

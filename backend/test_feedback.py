import requests

url = "http://localhost:8000/api/feedback"

# Test POST
data = {
    "name": "Test User",
    "email": "test@example.com",
    "rating": 5,
    "comments": "This new localtunnel sharing trick is awesome!"
}

print("Submitting feedback...")
res = requests.post(url, json=data)
print("POST Response:", res.status_code, res.json())

# Test GET
print("\nFetching all feedback...")
res = requests.get(url)
print("GET Response:", res.status_code)
feedbacks = res.json().get("feedbacks", [])
for f in feedbacks:
    print(f"- {f['name']} ({f['rating']} stars): {f['comments']}")

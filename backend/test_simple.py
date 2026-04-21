import urllib.request
import json

# Test if the backend is actually running with the new routes
try:
    response = urllib.request.urlopen('http://localhost:4001/')
    data = json.loads(response.read().decode())
    print(f"✅ Backend root: {data}")
except Exception as e:
    print(f"❌ Backend not accessible: {e}")

# Try to call PNG-to-JPG (will fail without file, but should get a response)
try:
    req = urllib.request.Request('http://localhost:4001/api/convert/png-to-jpg', method='POST')
    response = urllib.request.urlopen(req)
    print(f"✅ PNG-to-JPG endpoint exists!")
except urllib.error.HTTPError as e:
    # 422 = validation error (expected, no file provided)
    # 404 = endpoint doesn't exist (problem!)
    if e.code == 422:
        print(f"✅ PNG-to-JPG endpoint EXISTS (422 validation error expected)")
    elif e.code == 404:
        print(f"❌ PNG-to-JPG endpoint NOT FOUND - backend needs restart!")
    else:
        print(f"⚠️ PNG-to-JPG returned {e.code}: {e.read().decode()}")
except Exception as e:
    print(f"❌ Error testing endpoint: {e}")

import requests
import os

API_URL = "http://localhost:8080/api/clupload"

def upload_video(file_path):
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found at {file_path}")
        return

    print(f"🚀 Uploading {file_path}...")
    try:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(API_URL, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Upload Success!")
            print(f"🔗 URL: {data.get('url')}")
            print("👉 Copy this URL into your videoDatabase in page.tsx")
        else:
            print(f"❌ Upload Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("--- Cloudinary Video Uploader ---")
    path = input("Enter path to video file: ").strip().replace('"', '')
    upload_video(path)

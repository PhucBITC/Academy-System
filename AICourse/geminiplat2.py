import os
import time
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS


genai.configure(api_key=os.environ["AI_API_KEY"])

app = Flask(__name__)
CORS(app)  

def upload_to_gemini(path, mime_type=None):
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file

# Hàm chờ các file được xử lý xong
def wait_for_files_active(files):
    print("Waiting for file processing...")
    for name in (file.name for file in files):
        file = genai.get_file(name)
        while file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(5)
            file = genai.get_file(name)
        if file.state.name != "ACTIVE":
            raise Exception(f"File {file.name} failed to process")
    print("...all files ready")
    print()

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 32,
    "max_output_tokens": 4096,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
)

@app.route('/get_courses', methods=['POST'])
def get_courses():
    data = request.json
    industry = data.get("industry", "front-end")
    level = data.get("level", "cơ bản")

    files = [
        upload_to_gemini("course.csv", mime_type="text/csv"),
    ]

    wait_for_files_active(files)

    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    files[0],
                ],
            },
        ]
    )

    query = f"From the data I provided, briefly list 5 course_title for 1 learning path {industry} {level}"
    
    response = chat_session.send_message(query)
    print(response.usage_metadata)
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True)

import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

# Configure API Key
API_KEY = "AIzaSyCMB1W7BU-UvVlQdCfXVBJpA8a9HLWT3J0"
if "AI_API_KEY" in os.environ:
    genai.configure(api_key=os.environ["AI_API_KEY"])
else:
    genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)

# Load CSV data into memory at startup
try:
    df = pd.read_csv('course.csv')
    csv_context = df.to_string(index=False)
    print("Course data loaded successfully.")
except Exception as e:
    print(f"Error loading course.csv: {e}")
    csv_context = ""

print("------------------------------------------------")
print("CHECKING AVAILABLE MODELS FOR YOUR KEY:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
print("------------------------------------------------")

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 32,
    "max_output_tokens": 4096,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash", # Confirmed model from user's list
    generation_config=generation_config,
)

@app.route('/get_courses', methods=['POST'])
def get_courses():
    if not csv_context:
         return jsonify({"error": "Course data not available"}), 500

    data = request.json
    industry = data.get("industry", "front-end")
    level = data.get("level", "beginner")

    # Create a prompt that includes the data and strict formatting instructions
    prompt = f"""
    Context: Here is a list of available courses data:
    {csv_context}
    
    Task: Based on the dataset above, suggest a learning path of exactly 5 course titles for a '{industry}' student at '{level}' level.
    
    CRITICAL FORMATTING REQUIREMENT:
    - You must output the course titles wrapped in double asterisks, like this: **Course Title**.
    - Do not list courses that happen to be in the data but check if they match the request.
    - Only return the list of 5 courses with a brief 1-sentence explanation for each.
    """

    try:
        response = model.generate_content(prompt)
        print(f"AI Response: {response.text}") # Log for debugging
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

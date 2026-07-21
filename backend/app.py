import os
import base64
import json
import datetime
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# Import the Google Calendar service
from gcal_service import create_calendar_events

app = Flask(__name__)
# FIX: Allows exactVercel URL to safely make requests
allowed_origins = [
    "http://localhost:5173",
    "https://todayapp-lime.vercel.app"
]

CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins
    }
})

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

@app.route("/")
def home():
    return jsonify({"status": "ok"})

@app.route('/api/plan-my-day', methods=['POST'])
def plan_my_day():
    try:
        # Extract data sent by React (TBD)
        user_vibe = request.form.get('vibe', 'Feeling okay')
        access_token = request.form.get('googleAccessToken')
        
        # Hardcoded dummy profile (TESTING ONLY)
        major = "Computer Science"
        job = "Works at coffee shop 4pm - 8pm"
        goals = "Reduce screen time, manage anxiety"

        # Handle the PDF File
        if 'syllabusPdf' not in request.files:
            return jsonify({"error": "Please upload a valid PDF syllabus."}), 400
        
        file = request.files['syllabusPdf']
        if file.filename == '' or not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Please upload a valid PDF syllabus."}), 400

        # Read the file into memory and convert to Base64 string for Claude
        pdf_bytes = file.read()
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

        # Construct the dynamic System Prompt for Claude
        today_str = datetime.datetime.now().strftime("%Y-%m-%d")
        
        system_prompt = f"""
        You are an empathetic, highly organized student scheduling assistant and wellness coach.
        You are creating a schedule for TODAY: {today_str}.

        STUDENT PROFILE CONTEXT:
        - Major: {major}
        - Job: {job} (Do not schedule over shifts if mentioned)
        - Wellness Goals: {goals}

        RULES:
        1. You must output ONLY a valid JSON array. Do not include any markdown formatting, conversational text, or explanations before or after the JSON.
        2. The schedule is for today. You must use valid ISO 8601 timestamps for the current timezone (e.g., "YYYY-MM-DDTHH:MM:SS-07:00").
        3. Break down large tasks from the syllabus into manageable study blocks (e.g., 45-90 minutes).
        4. Factor in the student's vibe. If they feel "stressed" or "tired", schedule more breaks and lighter tasks. If they feel "energetic", tackle the hardest tasks first.
        5. Provide a tailored 'healthTip' for EVERY task based on the student's wellness goals and the specific task.

        JSON SCHEMA:
        [
          {{
            "title": "String - The name of the study block or break",
            "startTime": "String - ISO 8601 timestamp",
            "endTime": "String - ISO 8601 timestamp",
            "healthTip": "String - A short, contextual wellness tip"
          }}
        ]
        """

        # Call Claude API
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": "application/pdf",
                                "data": pdf_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": f"My vibe today is: \"{user_vibe}\". Look at the attached syllabus. Plan my day and return the schedule as a JSON array."
                        }
                    ]
                }
            ]
        )

        # Parse Claude's JSON response
        ai_response_text = response.content[0].text
        
        # Strip markdown code blocks if Claude includes them
        cleaned_text = re.sub(r'^```json\s*', '', ai_response_text)
        cleaned_text = re.sub(r'^```\s*', '', cleaned_text)
        cleaned_text = re.sub(r'\s*```$', '', cleaned_text).strip()

        schedule_data = json.loads(cleaned_text)

        # Create Google Calendar Events
        calendar_results = None
        if access_token:
            calendar_results = create_calendar_events(access_token, schedule_data)

        # Send everything back to React
        return jsonify({
            "success": True,
            "schedule": schedule_data,
            "calendar_status": calendar_results
        })

    except json.JSONDecodeError as e:
        print(f"Claude returned invalid JSON: {ai_response_text}")
        return jsonify({"error": f"Failed to parse AI schedule format: {str(e)}"}), 500
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)

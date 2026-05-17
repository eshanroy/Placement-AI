from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@app.route("/")
def home():
    return "PlaceMentor AI Backend Running"


# ---------------- RESUME ANALYZER ----------------
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    pdf_reader = PyPDF2.PdfReader(file)
    extracted_text = ""

    for page in pdf_reader.pages:
        extracted_text += page.extract_text()

    prompt = f"""
    Analyze this resume for placement preparation.

    Resume:
    {extracted_text}

    Give:
    1. Resume strengths
    2. Resume weaknesses
    3. Missing skills
    4. Improvement suggestions
    5. Placement readiness score out of 10
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    analysis = completion.choices[0].message.content

    return jsonify({
        "message": "Resume analyzed successfully",
        "analysis": analysis
    })


# ---------------- INTERVIEW QUESTION GENERATOR ----------------
@app.route("/generate-interview", methods=["POST"])
def generate_interview():
    data = request.json

    company = data.get("company")
    role = data.get("role")

    prompt = f"""
    Generate interview preparation questions for a student applying to {company}
    for the role of {role}.

    Give:
    1. HR questions
    2. Technical questions
    3. Coding/DSA questions
    4. Company-specific questions
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = completion.choices[0].message.content

    return jsonify({
        "questions": result
    })

@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    data = request.json

    answer = data.get("answer")

    prompt = f"""
    You are an interviewer conducting a placement interview.

    Candidate answer:
    {answer}

    Do the following:
    1. Evaluate the answer
    2. Give improvement suggestions
    3. Give score out of 10
    4. Ask the next interview question
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    result = completion.choices[0].message.content

    return jsonify({
        "feedback": result
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
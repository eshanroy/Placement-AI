import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload-resume",
        formData
      );
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const generateInterviewQuestions = async () => {
    if (!company || !role) {
      alert("Enter company and role");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-interview",
        {
          company,
          role
        }
      );

      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions");
    }
  };

  const startMockInterview = async () => {
    if (!answer) {
      alert("Enter your answer");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/mock-interview",
        {
          answer
        }
      );

      setFeedback(response.data.feedback);
    } catch (error) {
      console.error(error);
      alert("Mock interview failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">
      
      <h1 className="text-5xl font-bold text-center mb-10">
        🚀 PlaceMentor AI
      </h1>

      <p className="text-center text-gray-300 mb-12">
        Your AI-powered placement preparation assistant
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Interview Generator */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Interview Generator
          </h2>

          <input
            className="w-full p-2 rounded text-black mb-3"
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="w-full p-2 rounded text-black mb-3"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button
            onClick={generateInterviewQuestions}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full"
          >
            Generate Questions
          </button>

          <pre className="mt-4 whitespace-pre-wrap text-sm">
            {questions}
          </pre>
        </div>

        {/* Mock Interview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Mock Interview
          </h2>

          <p className="mb-3 font-semibold">
            Question 1: Tell me about yourself
          </p>

          <textarea
            className="w-full p-2 rounded text-black mb-3"
            rows="5"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={startMockInterview}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full"
          >
            Submit Answer
          </button>

          <pre className="mt-4 whitespace-pre-wrap text-sm">
            {feedback}
          </pre>
        </div>

        {/* Resume Analyzer */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Resume Analyzer
          </h2>

          <input
            className="w-full mb-3"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded w-full"
          >
            Analyze Resume
          </button>

          <pre className="mt-4 whitespace-pre-wrap text-sm">
            {analysis}
          </pre>
        </div>

      </div>
    </div>
  );
}

export default App;
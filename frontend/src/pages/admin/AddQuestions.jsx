import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const AddQuestions = () => {
  const { examId } = useParams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [marks, setMarks] = useState(1);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await api.get(`/admin/questions/${examId}`);
    setQuestions(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/admin/questions", {
      examId,
      question,
      options,
      correctAnswer,
      marks,
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setMarks(1);

    fetchQuestions();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Questions</h1>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
        <textarea
          placeholder="Question"
          className="border p-2 w-full mb-2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            className="border p-2 w-full mb-2"
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[i] = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}

        <select
          className="border p-2 w-full mb-2"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(Number(e.target.value))}
        >
          <option value={0}>Correct: Option 1</option>
          <option value={1}>Correct: Option 2</option>
          <option value={2}>Correct: Option 3</option>
          <option value={3}>Correct: Option 4</option>
        </select>

        <input
          type="number"
          placeholder="Marks"
          className="border p-2 w-full mb-2"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />

        <button className="bg-black text-white px-4 py-2">
          Add Question
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Questions</h2>

        {questions.map((q, i) => (
          <div key={q._id} className="border p-2 mb-2">
            <p className="font-medium">
              {i + 1}. {q.question}
            </p>
            <ul className="ml-4 list-disc">
              {q.options.map((o, idx) => (
                <li
                  key={idx}
                  className={
                    idx === q.correctAnswer
                      ? "text-green-600 font-semibold"
                      : ""
                  }
                >
                  {o}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddQuestions;

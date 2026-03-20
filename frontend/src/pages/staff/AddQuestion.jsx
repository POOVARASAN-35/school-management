import React, { useState } from "react";
import api from "../../api/axios";

const AddQuestion = () => {
  const [examId, setExamId] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/questions", {
      examId,
      questionText: question,
      options,
      correctAnswer: correct,
      marks: 1,
    });
    alert("Question added");
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Add MCQ</h2>

      <input
        placeholder="Exam ID"
        className="border p-2 w-full mb-2"
        onChange={(e) => setExamId(e.target.value)}
      />

      <textarea
        placeholder="Question"
        className="border p-2 w-full mb-2"
        onChange={(e) => setQuestion(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          className="border p-2 w-full mb-1"
          onChange={(e) => {
            const newOpt = [...options];
            newOpt[i] = e.target.value;
            setOptions(newOpt);
          }}
        />
      ))}

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => setCorrect(Number(e.target.value))}
      >
        <option value={0}>Correct: Option 1</option>
        <option value={1}>Correct: Option 2</option>
        <option value={2}>Correct: Option 3</option>
        <option value={3}>Correct: Option 4</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2">
        Add Question
      </button>
    </form>
  );
};

export default AddQuestion;

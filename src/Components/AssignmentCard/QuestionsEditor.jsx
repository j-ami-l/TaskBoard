import React, { useState } from "react";

const QuestionsEditor = ({ assignment }) => {
    // Convert questions object into an array
    const initialQuestions = Object.values(assignment.questions);
    const [count, setCount] = useState(initialQuestions.length);

    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assignment Question {index + 1}
                    </label>
                    <textarea
                        name={`qst${index + 1}`}
                        defaultValue={initialQuestions[index] || ""}
                        placeholder="Write question here..."
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            ))}

            {/* Add/Remove Buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setCount((prev) => prev + 1)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Add Question
                </button>
                <button
                    type="button"
                    onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                    disabled={count === 1}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                        count === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                    − Remove Question
                </button>
            </div>
        </div>
    );
};

export default QuestionsEditor;

import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AddAssignmentAns = () => {
    const [count, setCount] = useState(1);
    const [message, setMessage] = useState(null); // success/error message
    const [type, setType] = useState("success"); // "success" or "error"

    const { user } = useContext(AuthContext);
    const api = useAxiosSecure();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value.trim();
        const UniID = form.UniID.value.trim();
        const email = user.email;
        const section = form.section.value.trim();
        const checked = false;

        const answers = {};
        for (let i = 1; i <= count; i++) {
            answers[`qst${i}`] = form[`qst${i}`].value.trim();
        }

        const payload = { name, UniID, answers, email, section, checked };

        // Confirmation before submitting
        const confirmSubmit = window.confirm(
            "⚠️ Once you submit this assignment, it cannot be updated or deleted. Do you want to proceed?"
        );
        if (!confirmSubmit) return; // Stop if user cancels

        try {
            await api.post("/addans", payload);
            setType("success");
            setMessage("✅ Assignment submitted successfully!");
            form.reset();
            setCount(1);
        } catch (err) {
            console.error("Error submitting assignment:", err);
            setType("error");
            setMessage("❌ Failed to submit. Please try again.");
        }

        setTimeout(() => setMessage(null), 3000);
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 relative">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Submit Assignment Answers
                </h2>

                {/* Custom Alert */}
                {message && (
                    <div
                        className={`mb-4 p-3 rounded-lg text-sm font-medium transition-all duration-500 ${type === "success"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                        </label>
                        <input
                            placeholder="Enter your name"
                            defaultValue={user.displayName}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="name"
                            required
                        />
                    </div>

                    {/* Uni ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            University ID Ex:C24****
                        </label>
                        <input
                            placeholder="Enter your ID"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="UniID"
                            required
                        />
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section Ex: 3AM
                        </label>
                        <input
                            placeholder="Enter your section"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="section"
                            required
                        />
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                        {[...Array(count)].map((_, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Answer for Question {index + 1}
                                </label>
                                <textarea
                                    name={`qst${index + 1}`}
                                    placeholder={`Write your answer here...`}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCount(count + 1)}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            + Add Answer
                        </button>

                        <button
                            type="button"
                            onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                            disabled={count === 1}
                            className={`flex-1 py-2 rounded-lg transition-colors ${count === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                        >
                            − Remove Answer
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Submit Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAssignmentAns;

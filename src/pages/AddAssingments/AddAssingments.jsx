import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const AddAssignments = () => {
    const [count, setCount] = useState(1);
    const { user } = useContext(AuthContext);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const api = useAxiosSecure();

    // Show custom alert
    const showAlert = (message, type = "info") => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const section = form.section.value.trim();
        const title = form.title.value.trim();
        const expiredDate = form.expiredDate.value;

        // Convert deadline to readable date
        const readableDate = new Date(expiredDate).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Gather all dynamic questions
        const questions = {};
        for (let i = 1; i <= count; i++) {
            questions[`qst${i}`] = form[`qst${i}`].value.trim();
        }

        const payload = {
            section,
            title,
            questions,
            email: user?.email,
            expiredDate,
            readableDate,
        };

        try {
            const res = await api.post("/addqst", payload);

            if (res.data.exits === 1) {
                showAlert("Assignment already exists for this section!", "error");
                return;
            }

            showAlert("Assignment submitted successfully!", "success");
            form.reset();
            setCount(1);
        } catch (err) {
            console.error("Error submitting assignment:", err);
            showAlert("Failed to submit. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 relative">
            {/* Custom Alert */}
            {alert.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"}`}>
                    <div className="flex items-center">
                        <span className="mr-2">
                            {alert.type === "success" ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            )}
                        </span>
                        <p>{alert.message}</p>
                        <button 
                            onClick={() => setAlert({ show: false, message: "", type: "" })}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Add Assignment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section (e.g., 3AM)
                        </label>
                        <input
                            type="text"
                            name="section"
                            placeholder="Enter section"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigment Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Assigment Title"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assignment Deadline
                        </label>
                        <input
                            type="datetime-local"
                            name="expiredDate"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                        {[...Array(count)].map((_, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assignment Question {index + 1}
                                </label>
                                <textarea
                                    name={`qst${index + 1}`}
                                    placeholder="Write question here..."
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Add/Remove Question Buttons */}
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

                    {/* Submit */}
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

export default AddAssignments;
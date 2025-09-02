import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { UserInfoContext } from "../../provider/UserInfoProvider";
import { Link } from "react-router";

const AddAssingments = () => {
    const [count, setCount] = useState(1);
    const { user } = useContext(AuthContext);
    const {userInfo} = useContext(UserInfoContext);

    const api = useAxiosSecure();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const section = form.section.value.trim();
        const expiredDate = form.expiredDate.value; // raw ISO format

        // Human-readable date
        const readableDate = new Date(expiredDate).toLocaleString("en-US", {
            weekday: "long", // e.g. Monday
            year: "numeric",
            month: "long", // e.g. September
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Collect questions dynamically
        const questions = {};
        for (let i = 1; i <= count; i++) {
            questions[`qst${i}`] = form[`qst${i}`].value.trim();
        }

        const payload = {
            questions,
            section,
            email: user.email,
            expiredDate,     // original ISO format
            readableDate     // human-readable version
        };

        try {
            const res = await api.post("/addqst", payload);
            if (res.data.exits == 1) {
                alert("Assignment already exists for this section!");
                return;
            }
            console.log("Response:", res.data);
            alert("Assignment submitted successfully!");
            form.reset();
            setCount(1);
        } catch (err) {
            console.error("Error submitting assignment:", err);
            alert("Failed to submit. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {userInfo.role === "admin" && (
                <Link to={"/allassignments"}>
                    <button className="btn my-5 mx-auto">Students Assignments Ans</button>
                </Link>
            )}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Add Assignment Qst
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section Ex: 3AM
                        </label>
                        <input
                            placeholder="Enter section"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            name="section"
                            required
                        />
                    </div>

                    {/* Deadline */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-700">Assignment Deadline</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="expiredDate"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                        {[...Array(count)].map((_, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assignment Question {index + 1}
                                </label>
                                <textarea
                                    name={`qst${index + 1}`}
                                    placeholder={`Write Question here...`}
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
                        Add Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAssingments;

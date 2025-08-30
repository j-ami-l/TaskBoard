import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { UserInfoContext } from "../../provider/UserInfoProvider";
import { Link } from "react-router";

const AddAssignmentAns = () => {
    const [count, setCount] = useState(1);
    const { user } = useContext(AuthContext)
    const userInfo = useContext(UserInfoContext)
    console.log(userInfo);
    


    const api = useAxiosSecure()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value.trim();
        const UniID = form.UniID.value.trim();
        const email = user.email
        const section = form.section.value.trim();
        const checked = false;
        // Collect answers dynamically
        const answers = {};
        for (let i = 1; i <= count; i++) {
            answers[`qst${i}`] = form[`qst${i}`].value.trim();
        }

        const payload = {
            name,
            UniID,
            answers,
            email,
            section,
            checked
        };


        try {
            const res = await api.post("/addans", payload);
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
            {userInfo.role === "admin" && <Link to={'/allassignments'}><button className="btn my-5 mx-auto">Students Assignments</button></Link>}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Submit Assignment Answers
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button
                        type="button"
                        onClick={() => setCount(count + 1)}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        + Add Question
                    </button>

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

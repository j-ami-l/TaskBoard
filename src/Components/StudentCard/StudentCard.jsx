import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const StudentCard = ({ assignment, onMarkChecked, handleMarkSubmit }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [editMark, setEditMark] = useState(false);

    const handleToggleChecked = () => {
        onMarkChecked(assignment._id, assignment.checked);
    };

    const handleMarkSubmitTogle = e => {
        const checked = false;
        e.preventDefault()
        const mark = e.target.mark.value
        handleMarkSubmit(assignment?.UniID, mark)
        setShowDetails(false)
        onMarkChecked(assignment._id, checked);
        setEditMark(false)
    }

    return (
        <div className={`mb-6 rounded-xl border-2 p-5 shadow-lg transition-all duration-300 ${assignment.checked ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-300" : "bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200"}`}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        {assignment.name}
                        <span className="text-indigo-600 ml-2">({assignment.UniID})</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{assignment.section} Section</p>
                    {assignment.mark && <p>Mark : {assignment.mark}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Check button */}
                    <button
                        onClick={handleToggleChecked}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${assignment.checked
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'}`}
                    >
                        {assignment.checked ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Checked
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Mark as Checked
                            </>
                        )}
                    </button>

                    {/* Details toggle button */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                    >
                        {showDetails ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Hide Details
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Show Details
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded details with smooth animation */}
            {showDetails && (
                <div className="mt-5 pt-4 border-t border-gray-200 animate-fadeIn">
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Student Email</h4>
                        <p className="text-blue-600 break-all font-mono">{assignment.email}</p>
                    </div>

                    {/* Answers section */}
                    <div className="space-y-5">
                        {Object.entries(assignment.answers).map(([qst, ans]) => (
                            <div key={qst} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                                <div className="bg-gray-900 px-4 py-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="font-bold text-white text-lg">{qst.toUpperCase()}</h4>
                                </div>

                                <SyntaxHighlighter
                                    language="java"
                                    style={vscDarkPlus}
                                    showLineNumbers
                                    wrapLongLines
                                    customStyle={{
                                        margin: 0,
                                        padding: "1rem",
                                        fontSize: "0.9rem",
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                    }}
                                >
                                    {ans}
                                </SyntaxHighlighter>
                            </div>
                        ))}
                    </div>

                    {/* Submission info */}
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                        {editMark ? (
                            <form
                                onSubmit={handleMarkSubmitTogle}
                                className="flex items-center gap-3 w-full"
                            >
                                <input
                                    type="number"
                                    name="mark"
                                    defaultValue={assignment.mark || ""}
                                    placeholder="Assignment mark"
                                    className="input flex-1"
                                />
                                <button type="submit" className="btn">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMark(false)}
                                    className="btn bg-gray-300 text-gray-700"
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                {assignment.mark ? (
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Mark:
                                        <span className="text-indigo-600 ml-2">{assignment.mark}</span>
                                    </h3>
                                ) : (
                                    <p className="text-gray-500 italic">No mark given yet</p>
                                )}
                                <button onClick={() => setEditMark(true)} className="btn">
                                    {assignment.mark ? "Edit Mark" : "Add Mark"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCard;
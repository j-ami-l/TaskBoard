import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";


const Allassignments = () => {
    const { user } = useContext(AuthContext);
    const api = useAxiosSecure();
    const queryClient = useQueryClient();

    const {
        data: allassignments = [],
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ["assignments", user?.email],
        queryFn: async () => {
            if (!user) return [];
            const res = await api.get(`/allassignments?email=${user.email}`);
            return res.data;
        },
        enabled: !!user,
    });

    const [searchId, setSearchId] = useState("");
    const [filteredStudent, setFilteredStudent] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const found = allassignments.find(
            (s) => s.UniID.toLowerCase() === searchId.toLowerCase()
        );
        setFilteredStudent(found || null);
    };

    const handleClear = () => {
        setSearchId("");
        setFilteredStudent(null);
    };

    // Group by section
    const sectionWise = allassignments.reduce((acc, cur) => {
        if (!acc[cur.section]) acc[cur.section] = [];
        acc[cur.section].push(cur);
        return acc;
    }, {});

    if (isFetching)
        return <p className="text-center mt-6">Loading...</p>;

    if (isError)
        return (
            <p className="text-center mt-6 text-red-600">
                Error: {error.message}
            </p>
        );

    return (
        <div className="p-4 sm:p-6">
            {/* 🔍 Search bar */}
            <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3"
            >
                <input
                    type="text"
                    placeholder="Enter UniID (e.g., C243029)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border rounded-md p-2 w-full sm:w-72"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto"
                    >
                        Search
                    </button>
                    {filteredStudent && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full sm:w-auto"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </form>

            {/* If searched student found */}
            {filteredStudent ? (
                <div>
                    <h2 className="text-xl font-bold mb-4">Search Result</h2>
                    <StudentCard assignment={filteredStudent} />
                </div>
            ) : (
                /* Show all students grouped by section */
                Object.keys(sectionWise).map((section) => (
                    <div key={section} className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">
                            {section} Section
                        </h2>
                        {sectionWise[section].map((assignment) => (
                            <StudentCard key={assignment.UniID} assignment={assignment} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

const StudentCard = ({ assignment }) => {
    const [showDetails, setShowDetails] = useState(false);
    const api = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Mutation for marking checked
    const markCheckedMutation = useMutation({
        mutationFn: async ({ id, checked }) => {
            const res = await api.patch(`/markcheck?email=${user.email}`, {
                id,
                checked,
            });
            return res.data;
        },
        onMutate: async ({ id, checked }) => {
            await queryClient.cancelQueries({ queryKey: ["assignments", user.email] });

            const previousAssignments = queryClient.getQueryData([
                "assignments",
                user.email,
            ]);

            queryClient.setQueryData(["assignments", user.email], (old) => {
                if (!old) return old;
                return old.map((item) =>
                    item._id === id ? { ...item, checked: !checked } : item
                );
            });

            return { previousAssignments };
        },
        onError: (err, { id }, context) => {
            queryClient.setQueryData(
                ["assignments", user.email],
                context.previousAssignments
            );
            console.error("Error marking checked:", err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["assignments", user.email]);
        },
    });

    const handleMarkChecked = (id, checked) => {
        markCheckedMutation.mutate({ id, checked });
    };

    return (
        <div
            className={`mb-6 p-4 border rounded-lg shadow transition 
      ${assignment.checked ? "bg-green-100 border-green-400" : "bg-white"}`}
        >
            {/* Basic info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold">
                    {assignment.name} ({assignment.UniID})
                </h3>
                <div className="flex gap-2">
                    {/* ✅ Checked button */}
                    <button
                        onClick={() =>
                            handleMarkChecked(assignment._id, assignment.checked)
                        }
                        disabled={markCheckedMutation.isPending}
                        className={`px-3 py-1 text-sm rounded-md 
              ${assignment.checked
                                ? "bg-green-600 text-white"
                                : "bg-gray-400 text-white hover:bg-gray-500"
                            } 
              ${markCheckedMutation.isPending
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                    >
                        {markCheckedMutation.isPending
                            ? "Updating..."
                            : assignment.checked
                                ? "Checked"
                                : "Mark Checked"}
                    </button>
                    {/* 🔽 Details toggle */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                        {showDetails ? "Hide Details" : "Details"}
                    </button>
                </div>
            </div>

            {/* Expanded details */}
            {showDetails && (
                <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2 break-all">
                        {assignment.email}
                    </p>

                    {/* 🔥 Dynamically render all Qst/Ans */}
                    {Object.entries(assignment.answers).map(([qst, ans]) => (
                        <div key={qst} className="mt-3">
                            <h4 className="font-semibold mb-2">{qst.toUpperCase()}:</h4>

                            <SyntaxHighlighter
                                language="java"
                                style={vscDarkPlus}
                                showLineNumbers
                                wrapLongLines
                                customStyle={{
                                    borderRadius: "0.5rem",
                                    padding: "1rem",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {ans}
                            </SyntaxHighlighter>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Allassignments;

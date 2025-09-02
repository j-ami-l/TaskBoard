import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import StudentCard from "../../Components/StudentCard/StudentCard";

const Allassignments = () => {
    const { user } = useContext(AuthContext);
    const api = useAxiosSecure();
    const queryClient = useQueryClient();
    const [localAssignments, setLocalAssignments] = useState([]);

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
            setLocalAssignments(res.data); // Initialize local state
            return res.data;
        },
        enabled: !!user,
    });

    const updateAssignmentMutation = useMutation({
        mutationFn: ({ id, checked }) => 
            api.patch(`/markcheck?email=${user.email}`, { id, checked }),
        onMutate: async ({ id, checked }) => {
            // Cancel outgoing refetches to avoid overwriting
            await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });
            
            // Snapshot previous value
            const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);
            
            // Optimistically update to new value
            queryClient.setQueryData(["assignments", user?.email], (old) =>
                old.map(assignment =>
                    assignment._id === id ? { ...assignment, checked: !checked } : assignment
                )
            );
            
            return { previousAssignments };
        },
        onError: (err, variables, context) => {
            // Revert to previous value on error
            queryClient.setQueryData(["assignments", user?.email], context.previousAssignments);
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
        },
    });


    const updateAssignmentMarkMutation = useMutation({
        mutationFn: ({ id, mark }) => 
            api.patch(`/updatemark?email=${user.email}`, { id, mark }),
        onMutate: async ({ id, mark }) => {
            // Cancel outgoing refetches to avoid overwriting
            await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });
            
            // Snapshot previous value
            const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);
            
            // Optimistically update to new value
            queryClient.setQueryData(["assignments", user?.email], (old) =>
                old.map(assignment =>
                    assignment._id === id ? { ...assignment, mark: mark } : assignment
                )
            );
            
            return { previousAssignments };
        },
        onError: (err, variables, context) => {
            // Revert to previous value on error
            queryClient.setQueryData(["assignments", user?.email], context.previousAssignments);
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
        },
    });



    const handleMarkChecked = (id, checked) => {
        updateAssignmentMutation.mutate({ id, checked });
    };





    const handleMarkSubmit = (id , mark) =>{
        updateAssignmentMarkMutation.mutate({id , mark})
    }

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

    // if (isFetching) return <p className="text-center mt-6">heeee</p>;
    if (isError) return <p className="text-center mt-6 text-red-600">Error: {error.message}</p>;

    return (
        <div className="p-4 sm:p-6">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
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

            {filteredStudent ? (
                <div>
                    <h2 className="text-xl font-bold mb-4">Search Result</h2>
                    <StudentCard 
                        assignment={filteredStudent} 
                        onMarkChecked={handleMarkChecked}
                        handleMarkSubmit={handleMarkSubmit}
                    />
                </div>
            ) : (
                Object.keys(sectionWise).map((section) => (
                    <div key={section} className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">{section} Section</h2>
                        {sectionWise[section].map((assignment) => (
                            <StudentCard 
                                key={assignment.UniID} 
                                assignment={assignment} 
                                onMarkChecked={handleMarkChecked}
                                handleMarkSubmit={handleMarkSubmit}
                            />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Allassignments;
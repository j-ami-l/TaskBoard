import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import StudentCard from "../../Components/StudentCard/StudentCard";
import { WiDirectionRight } from "react-icons/wi";
import { MdDeleteSweep } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Allassignments = () => {
    const { user } = useContext(AuthContext);
    const api = useAxiosSecure();
    const queryClient = useQueryClient();
    const [localAssignments, setLocalAssignments] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [downloadExcel, setDownloadExcel] = useState(false);


    const downloadSectionExcel = (sectionName, studentData) => {
        // Pick only selected fields
        const filteredData = studentData.map(student => ({
            ID: student.UniID,
            Name: student.name,
            Mark: student.mark,
        }));

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(filteredData);

        // Create workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sectionName);

        // Generate Excel file buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        // Create Blob and trigger download
        const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );
        saveAs(file, `${sectionName}_students.xlsx`);
    };


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

    const handleDeleteSection = useMutation({
        mutationFn: ({ section }) =>
            api.delete(`/delete-section-assignment?email=${user.email}&section=${section}`),

        onMutate: async ({ section }) => {
            // Cancel ongoing queries
            await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });

            // Snapshot previous data
            const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);

            // Optimistically update by removing that section
            queryClient.setQueryData(["assignments", user?.email], (old) => {
                if (!old) return [];
                return old.filter((assignment) => assignment.section !== section);
            });

            return { previousAssignments };
        },

        onError: (err, variables, context) => {
            // Revert on failure
            queryClient.setQueryData(["assignments", user?.email], context.previousAssignments);
        },

        onSettled: () => {
            // Refetch after success or failure
            queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
        },
    });


    const handleConfirmDelete = (section) => {
        setConfirmDelete(section);
    };

    const proceedDelete = () => {
        if (confirmDelete) {
            // ✅ Only download Excel if user selected it
            if (downloadExcel) {
                downloadSectionExcel(confirmDelete, sectionWise[confirmDelete]);
            }

            // Call mutation
            handleDeleteSection.mutate({ section: confirmDelete });

            // Close modal
            setConfirmDelete(null);
            setDownloadExcel(false); // reset checkbox
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };


    const handleMarkChecked = (id, checked) => {
        updateAssignmentMutation.mutate({ id, checked });
    };





    const handleMarkSubmit = (id, mark) => {
        updateAssignmentMarkMutation.mutate({ id, mark })
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

            {/* 🎯 If search result */}
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
                /* 📌 Section-wise listing */
                Object.keys(sectionWise).map((section) => (
                    <div key={section} className="mb-10">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">
                            {section} Section
                        </h2>

                        {/* ❌ Delete button */}
                        <button
                            onClick={() => handleConfirmDelete(section)}
                            className="flex items-center gap-2 px-4 py-2 mb-4 rounded-2xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition-all duration-200"
                        >
                            <MdDeleteSweep size={22} />
                            <span>Delete {section} assignment answers</span>
                            <WiDirectionRight size={28} />
                        </button>

                        {/* 🧑‍🎓 Student Cards */}
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

            {/* ⚠️ Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Are you sure you want to delete all answers from{" "}
                            <span className="font-bold text-red-600">{confirmDelete}</span>{" "}
                            section?
                        </h3>

                        {/* ✅ Checkbox for Excel download */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="downloadExcel"
                                checked={downloadExcel}
                                onChange={(e) => setDownloadExcel(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="downloadExcel" className="text-gray-700">
                                Also download Excel file before deleting
                            </label>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={proceedDelete}
                                disabled={handleDeleteSection.isLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {handleDeleteSection.isLoading ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Allassignments;
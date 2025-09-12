import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import StudentCard from "../../Components/StudentCard/StudentCard";
import { WiDirectionRight } from "react-icons/wi";
import { MdDeleteSweep } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa"; // ✅ new icon
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Allassignments = () => {
  const { user } = useContext(AuthContext);
  const api = useAxiosSecure();
  const queryClient = useQueryClient();
  const [localAssignments, setLocalAssignments] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ✅ Excel download function remains the same
  const downloadSectionExcel = (sectionName, studentData) => {
    const filteredData = studentData.map((student) => ({
      ID: student.UniID,
      Name: student.name,
      Mark: student.mark,
    }));
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sectionName);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `${sectionName}_students.xlsx`);
  };

  const {
    data: allassignments = [],
    isError,
    error,
  } = useQuery({
    queryKey: ["assignments", user?.email],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get(`/allassignments?email=${user.email}`);
      setLocalAssignments(res.data);
      return res.data;
    },
    enabled: !!user,
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: ({ id, checked }) =>
      api.patch(`/markcheck?email=${user.email}`, { id, checked }),
    onMutate: async ({ id, checked }) => {
      await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });
      const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);
      queryClient.setQueryData(["assignments", user?.email], (old) =>
        old.map((a) =>
          a._id === id ? { ...a, checked: !checked } : a
        )
      );
      return { previousAssignments };
    },
    onError: (_err, _v, ctx) => {
      queryClient.setQueryData(["assignments", user?.email], ctx.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
    },
  });

  const updateAssignmentMarkMutation = useMutation({
    mutationFn: ({ id, mark }) =>
      api.patch(`/updatemark?email=${user.email}`, { id, mark }),
    onMutate: async ({ id, mark }) => {
      await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });
      const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);
      queryClient.setQueryData(["assignments", user?.email], (old) =>
        old.map((a) =>
          a._id === id ? { ...a, mark } : a
        )
      );
      return { previousAssignments };
    },
    onError: (_err, _v, ctx) => {
      queryClient.setQueryData(["assignments", user?.email], ctx.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
    },
  });

  const handleDeleteSection = useMutation({
    mutationFn: ({ section }) =>
      api.delete(`/delete-section-assignment?email=${user.email}&section=${section}`),
    onMutate: async ({ section }) => {
      await queryClient.cancelQueries({ queryKey: ["assignments", user?.email] });
      const previousAssignments = queryClient.getQueryData(["assignments", user?.email]);
      queryClient.setQueryData(["assignments", user?.email], (old) =>
        old.filter((a) => a.section !== section)
      );
      return { previousAssignments };
    },
    onError: (_err, _v, ctx) => {
      queryClient.setQueryData(["assignments", user?.email], ctx.previousAssignments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", user?.email] });
    },
  });

  const handleMarkChecked = (id, checked) => {
    updateAssignmentMutation.mutate({ id, checked });
  };
  const handleMarkSubmit = (id, mark) => {
    updateAssignmentMarkMutation.mutate({ id, mark });
  };

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

  const sectionWise = allassignments.reduce((acc, cur) => {
    if (!acc[cur.section]) acc[cur.section] = [];
    acc[cur.section].push(cur);
    return acc;
  }, {});

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

            <div className="flex flex-wrap gap-3 mb-4">
              {/* ❌ Delete button */}
              <button
                onClick={() => setConfirmDelete(section)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition-all duration-200"
              >
                <MdDeleteSweep size={22} />
                <span>Delete {section} assignment answers</span>
                <WiDirectionRight size={28} />
              </button>

              {/* ✅ Download Excel button */}
              <button
                onClick={() =>
                  downloadSectionExcel(section, sectionWise[section])
                }
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition-all duration-200"
              >
                <FaFileExcel size={20} />
                <span>Export Excel</span>
              </button>
            </div>

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
            <h3 className="text-lg font-semibold mb-6 text-gray-800">
              Are you sure you want to delete all answers from{" "}
              <span className="font-bold text-red-600">{confirmDelete}</span> section?
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  handleDeleteSection.mutate({ section: confirmDelete })
                }
                disabled={handleDeleteSection.isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {handleDeleteSection.isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
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

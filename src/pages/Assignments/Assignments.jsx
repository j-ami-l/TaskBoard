import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import AssignmentCard from '../../Components/AssignmentCard/AssignmentCard';

const Assignments = () => {

    const { user } = useContext(AuthContext)
    const api = useAxiosSecure()
    const queryClient = useQueryClient();
    const {
        data: allassignmentsqst = null,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["allassignmentsqst", user?.email],
        queryFn: async () => {
            if (!user) return [];
            const res = await api.get(`/allassignmentsqst`);
            return res.data;
        },
        enabled: !!user,
    });

    const updateAssignmentQstMutation = useMutation({
        mutationFn: ({ id, update }) =>
            api.patch(`/updateassignment?email=${user.email}`, { id, update }),
        onMutate: async ({ id, update }) => {
            // Cancel outgoing refetches to avoid overwriting
            await queryClient.cancelQueries({ queryKey: ["allassignmentsqst", user?.email] });

            // Snapshot previous value
            const previousAssignments = queryClient.getQueryData(["allassignmentsqst", user?.email]);

            // Optimistically update to new value
            queryClient.setQueryData(["allassignmentsqst", user?.email], (old = []) =>
                old.map((assignment) =>
                    assignment._id === id ? { ...assignment, ...update } : assignment
                )
            );

            return { previousAssignments };
        },
        onError: (err, variables, context) => {
            // Revert to previous value on error
            queryClient.setQueryData(["allassignmentsqst", user?.email], context.previousAssignments);
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["allassignmentsqst", user?.email] });
        },
    });


    const handleUpdate = (id, update) => {
        updateAssignmentQstMutation.mutate({ id, update })
    }


    if (!allassignmentsqst) return <h1>loading....</h1>
    return (
        <div className='w-11/12 mx-auto'>
            {allassignmentsqst.map(assignmentsqst => <AssignmentCard key={assignmentsqst._id} assignmentsqst={assignmentsqst}
                handleUpdate={handleUpdate}
                refetch={refetch}></AssignmentCard>)}
        </div>
    );
};

export default Assignments;
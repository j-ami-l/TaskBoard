import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import AssignmentCard from '../../Components/AssignmentCard/AssignmentCard';

const Assignments = () => {

    const {user} = useContext(AuthContext)
    const api = useAxiosSecure()
    const {
        data: allassignmentsqst = null,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["assignmentsqst", user?.email],
        queryFn: async () => {
            if (!user) return [];
            const res = await api.get(`/allassignmentsqst`);
            return res.data;
        },
        enabled: !!user,
    });

    if(!allassignmentsqst) return <h1>loading....</h1>
    return (
        <div>
            {allassignmentsqst.map(assignmentsqst=><AssignmentCard key={assignmentsqst._id} assignmentsqst={assignmentsqst}
            refetch={refetch}></AssignmentCard>)}
        </div>
    );
};

export default Assignments;
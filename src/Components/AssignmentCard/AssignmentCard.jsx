import React, { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../../provider/AuthProvider';

const AssignmentCard = ({ assignmentsqst , refetch }) => {
    const api = useAxiosSecure()
    const { user } = useContext(AuthContext)
    const handleDltAssingment = async (id) => {
        try {
            const res = await api.delete('/dltassignment', {
                data: { id, email: user.email }  // DELETE requires "data" key
            });
            console.log("Deleted:", res.data);
            if(res.data?.deletedCount){
                refetch()
            }
            alert("Assignment deleted!");
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const { questions, section, email, expiredDate, readableDate } = assignmentsqst;
    const userInfo = useContext(UserInfoContext)
    return (
        <div style={styles.card}>
            {/* Header Section */}
            <div style={styles.header}>
                <h2 style={styles.title}>Assignment Questions</h2>
                <div style={styles.sectionBadge}>
                    Section: <span style={styles.highlightedSection}>{section}</span>
                </div>
            </div>

            {/* Deadline Section */}
            <div style={styles.deadlineContainer}>
                <span style={styles.deadlineLabel}>Deadline:</span>
                <span style={styles.deadline}>{readableDate}</span>
            </div>

            {/* Questions */}
            <div style={styles.content}>
                {Object.entries(questions).map(([key, question], index) => (
                    <div key={key} style={styles.questionContainer}>
                        <h3 style={styles.questionTitle}>Question {index + 1}</h3>
                        <p style={styles.questionText}>{question}</p>
                    </div>
                ))}
            </div>
            {userInfo.role === "admin" && <button className='btn' onClick={() => handleDltAssingment(assignmentsqst._id)}>Delete</button>}
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        margin: '20px 0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '12px',
        borderBottom: '2px solid #f0f0f0',
    },
    title: {
        color: '#2c3e50',
        margin: 0,
        fontSize: '1.8rem',
    },
    sectionBadge: {
        backgroundColor: '#e8f4fc',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: '600',
        color: '#2c3e50',
    },
    highlightedSection: {
        color: '#e74c3c',
        fontWeight: '700',
    },
    deadlineContainer: {
        marginBottom: '20px',
        backgroundColor: '#fff3e6',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #ffd1a4',
        display: 'inline-block',
    },
    deadlineLabel: {
        fontWeight: '600',
        marginRight: '8px',
        color: '#e67e22',
    },
    deadline: {
        fontWeight: '700',
        color: '#d35400',
    },
    content: {
        marginBottom: '20px',
    },
    questionContainer: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
    questionTitle: {
        color: '#3498db',
        marginTop: '0',
        marginBottom: '10px',
        fontSize: '1.2rem',
    },
    questionText: {
        color: '#34495e',
        lineHeight: '1.6',
        margin: '0',
        whiteSpace: 'pre-line',
    },
    footer: {
        paddingTop: '15px',
        borderTop: '2px solid #f0f0f0',
        textAlign: 'right',
    },
    email: {
        color: '#7f8c8d',
        fontSize: '0.9rem',
        margin: '0',
        fontStyle: 'italic',
    },
};

export default AssignmentCard;

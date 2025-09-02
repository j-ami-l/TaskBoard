import React, { useContext, useState } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../../provider/AuthProvider';

const AssignmentCard = ({ assignmentsqst, refetch }) => {
    const api = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const { userInfo } = useContext(UserInfoContext);

    // Show custom alert
    const showAlert = (message, type = "info") => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    };

    const handleDltAssingment = async (id) => {
        try {
            const res = await api.delete('/dltassignment', {
                data: { id, email: user.email },
            });
            if (res.data?.deletedCount) {
                refetch();
                showAlert("Assignment deleted successfully!", "success");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            showAlert("Failed to delete assignment. Please try again.", "error");
        }
    };

    const { questions, section, readableDate } = assignmentsqst;

    return (
        <div style={styles.card}>
            {/* Custom Alert */}
            {alert.show && (
                <div style={{
                    ...styles.alert,
                    ...(alert.type === "success" ? styles.alertSuccess : styles.alertError)
                }}>
                    <div style={styles.alertContent}>
                        <span style={styles.alertIcon}>
                            {alert.type === "success" ? "✓" : "✗"}
                        </span>
                        <p style={styles.alertMessage}>{alert.message}</p>
                        <button 
                            onClick={() => setAlert({ show: false, message: "", type: "" })}
                            style={styles.alertClose}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

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

            {/* Footer */}
            {userInfo.role === "admin" && (
                <div style={styles.footer}>
                    <button
                        onClick={() => handleDltAssingment(assignmentsqst._id)}
                        style={styles.deleteBtn}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                    >
                        🗑 Delete Assignment
                    </button>
                </div>
            )}
        </div>
    );
};

// ✅ Responsive styles
const styles = {
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '5%',
        margin: '16px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '95%', // flexible on mobile
        position: 'relative',
    },
    header: {
        display: 'flex',
        flexWrap: 'wrap', // stack on mobile
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '12px',
        borderBottom: '2px solid #f0f0f0',
        gap: '10px',
    },
    title: {
        color: '#2c3e50',
        margin: 0,
        fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', // responsive font
    },
    sectionBadge: {
        backgroundColor: '#e8f4fc',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    },
    highlightedSection: {
        color: '#e74c3c',
        fontWeight: '700',
    },
    deadlineContainer: {
        marginBottom: '20px',
        backgroundColor: '#fff3e6',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ffd1a4',
        display: 'inline-block',
        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    },
    deadlineLabel: {
        fontWeight: '600',
        marginRight: '6px',
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
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
    questionTitle: {
        color: '#3498db',
        marginTop: '0',
        marginBottom: '8px',
        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    },
    questionText: {
        color: '#34495e',
        lineHeight: '1.6',
        margin: '0',
        whiteSpace: 'pre-line',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    },
    footer: {
        paddingTop: '15px',
        borderTop: '2px solid #f0f0f0',
        textAlign: 'right',
    },
    deleteBtn: {
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
    },
    // Alert styles
    alert: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '300px',
        maxWidth: '90%',
    },
    alertSuccess: {
        backgroundColor: '#d4edda',
        borderLeft: '4px solid #28a745',
        color: '#155724',
    },
    alertError: {
        backgroundColor: '#f8d7da',
        borderLeft: '4px solid #dc3545',
        color: '#721c24',
    },
    alertContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    alertIcon: {
        fontSize: '20px',
        marginRight: '10px',
    },
    alertMessage: {
        margin: 0,
        flex: 1,
    },
    alertClose: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        marginLeft: '10px',
        color: 'inherit',
    },
};

export default AssignmentCard;
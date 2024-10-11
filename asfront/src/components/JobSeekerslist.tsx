import React, { useEffect, useState } from 'react';
import { getJobSeekers } from '../api';
import "./JobSeekers.css";
const JobSeekersList = () => {
    const [jobSeekers, setJobSeekers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchJobSeekers = async () => {
            if (!token) {
                setError('User not authenticated.');
                setLoading(false);
                return;
            }
            try {
                const response = await getJobSeekers(token);
                setJobSeekers(response.data);
            } catch (err) {
                setError(`Error fetching job seekers: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchJobSeekers();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Job Seekers List</h2>
            {jobSeekers.length > 0 ? (
                <ul>
                    {jobSeekers.map((jobSeeker) => (
                        <li key={jobSeeker.id}>
                            {jobSeeker.firstName} {jobSeeker.lastName} - {jobSeeker.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No job seekers found.</p>
            )}
        </div>
    );
};

export default JobSeekersList;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import Logo from '../misc/Logo';
import TimesAgo from '../misc/TimesAgo';
import API from '../misc/api';

const JobView = () => {
  const { job_id } = useParams(); // Access job_id from the URL
  const [job, setJob] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchJob = async () => {
      // Retrieve user from localStorage and parse the stored JSON to access the access token
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
         M.toast({ html: 'Please Login!', classes: 'green' });
        navigate('/login'); // Navigate to login if no user is found
        return;
      }

      const user = JSON.parse(storedUser);
      const accessToken = user.accessToken; // Assuming accessToken is stored in the user object

      if (!accessToken) {
        M.toast({ html: 'Access token not found in user data', classes: 'rounded' });
        navigate('/login'); // Navigate to login if no access token is found
        return;
      }

      try {
        const response = await API.get(`jobs/${job_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJob(response.data);
      } catch (error) {
        console.error(error);
        M.toast({ html: error.message || 'Failed to fetch job details', classes: 'rounded' });
      }
    };

    fetchJob();
  }, [job_id, navigate]); // Add `navigate` as dependency

  return (
    <div className="container">
      {job && (
        <div className="row" style={{ marginTop: '30px' }}>
          <div className="col s12">
            <div className="row">
              <div className="col s3">
                <Logo logoUrl={job.logoUrl} />
              </div>
              <div className="col s3 offset-s6">
                <ul style={{ margin: '0px' }}>
                  <li>
                    <span>{job.company}</span>
                  </li>
                  <li>
                    <span>{job.id}</span>
                  </li>
                  <li>
                    <TimesAgo createDate={job.createDate} />
                  </li>
                </ul>
              </div>
            </div>
            <div className="divider"></div>
            <div className="row" style={{ marginTop: '30px', marginBottom: '20px' }}>
              <div className="col s12">
                <span className="flow-text">{job.title}</span>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <span>{job.description}</span>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                
                <Link to={`/customer/jobs/${job.id}`} > {/* Updated Link */}
                  <span className="waves-effect waves-light btn-small blue right">
                    Service Request
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobView;

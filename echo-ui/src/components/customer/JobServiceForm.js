import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import API from '../misc/api';
import { useNavigate, useParams } from 'react-router-dom';

const JobServiceForm = () => {
  const [job, setJob] = useState({
    id: '',
    title: '',
    company: '',
    logoUrl: '',
    description: '',
    createDate: ''
  });

  const navigate = useNavigate();
  const { job_id } = useParams();

  useEffect(() => {
    // Check for the accessToken in localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const accessToken = JSON.parse(storedUser).accessToken;
      if (accessToken) {
        fetchJobDetails(accessToken);
      } else {
        navigate('/login');
      }
    }

    M.Tabs.init(document.querySelectorAll('.tabs'));
  }, [navigate]);

  const fetchJobDetails = async (accessToken) => {
    if (job_id) {
      try {
        const response = await API.get(`jobs/${job_id}`, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        });
        const jobData = response.data;
        setJob({
          id: jobData.id,
          title: jobData.title,
          company: '',
          logoUrl: '',
          description: '',
          createDate: jobData.createDate
        });
      } catch (error) {
        console.log(error);
        M.toast({ html: error.message, classes: 'rounded' });
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setJob({
      ...job,
      [id]: value
    });
  };

  const redirectJobList = () => {
    navigate('/customer');
    M.toast({ html: 'Service request has been created successful!', classes: 'green' });
  };

  const saveJob = async () => {
    if (!validateForm()) return;

    const method = 'POST';
    const url = 'http://localhost:8080/api/orders/jobRequest';

    const storedUser = localStorage.getItem('user');
    const accessToken = JSON.parse(storedUser).accessToken;

    try {
      await API.request({
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify(job)
      });
      redirectJobList();
    } catch (error) {
      console.log(error);
      M.toast({ html: error.message, classes: 'rounded' });
    }
  };

  const validateForm = () => {
    const fields = document.querySelectorAll('.validate');
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.trim() === '') {
        document.getElementById(fields[i].id).focus();
        return false;
      }
    }
    return true;
  };

  const mockJobIdAndCreateDate = () => {
    let mockJob = { ...job };
    mockJob.id = 'XXXXXXXXXXXXXXXXXXXXXXXX';
    mockJob.createDate = new Date();
    return mockJob;
  };

  const jobData = job.id ? job : mockJobIdAndCreateDate();
  const idFieldVisibility = job.id ? { display: 'block' } : { display: 'none' };

  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s4"><a className="active" href="#form">Service Request Form</a></li>
            <li className="tab col s4"><a href="#home-card-preview">Order Request Form</a></li>
          </ul>
        </div>
        <div id="form" className="col s12">
          <div className="row" style={idFieldVisibility}>
            <div className="input-field col s12">
              <input disabled value={jobData.id} id="id" type="text" />
              <label htmlFor="id">Id</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                required
                className="validate"
                value={jobData.title}
                id="title"
                type="text"
                onChange={handleChange}
              />
              <span className="helper-text" data-error="Title cannot be empty"></span>
              <label htmlFor="title">Title</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                required
                className="validate"
                value={jobData.company}
                id="company"
                type="text"
                onChange={handleChange}
              />
              <span className="helper-text" data-error="Company cannot be empty"></span>
              <label htmlFor="company">Company/Hospital Name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                value={jobData.logoUrl}
                id="logoUrl"
                type="text"
                onChange={handleChange}
              />
              <label htmlFor="logoUrl">Address/Location</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea
                required
                className="materialize-textarea validate"
                id="description"
                onChange={handleChange}
                value={jobData.description}
              ></textarea>
              <span className="helper-text" data-error="Enter Service Request Summary"></span>
              <label htmlFor="description" className="active">Enter Service Request Summary</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <button className="waves-effect waves-light btn-small blue right" onClick={saveJob}>Submit Request</button>
              <button className="waves-effect waves-green btn-flat right" onClick={redirectJobList}>Cancel</button>
            </div>
          </div>
        </div>
        <div id="home-card-preview" className="col s12">
          {/* Similar Order Form */}
        </div>
      </div>
    </div>
  );
};

export default JobServiceForm;

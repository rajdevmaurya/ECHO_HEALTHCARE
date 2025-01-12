import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useNavigate, useParams } from 'react-router-dom'
import JobCardHome from '../home/JobCard'
import JobCardCustomer from '../customer/JobCard'
import API from '../misc/api'

const JobServiceForm = () => {
  const [job, setJob] = useState({
    id: '',
    title: '',
    company: '',
    logoUrl: '',
    description: '',
    createDate: ''
  })
  const navigate = useNavigate()
  const { job_id } = useParams() // Getting job_id from URL params

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const accessToken = storedUser ? JSON.parse(storedUser).accessToken : null

    if (!accessToken) {
      navigate('/login') // Redirect to login if no token is found
      return
    }

    const fetchJobDetails = async () => {
      if (job_id) {
        try {
          const response = await API.get(`jobs/${job_id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
          const jobData = response.data
          setJob({
            id: jobData.id,
            title: jobData.title,
            company: jobData.company,
            logoUrl: jobData.logoUrl,
            description: jobData.description,
            createDate: jobData.createDate
          })
        } catch (error) {
          console.error(error)
          M.toast({ html: error.message, classes: 'rounded' })
        }
      }
    }

    fetchJobDetails()

    M.Tabs.init(document.querySelectorAll('.tabs'))
  }, [job_id, navigate])

  const handleChange = (e) => {
    const { id, value } = e.target
    setJob((prevState) => ({
      ...prevState,
      [id]: value
    }))
  }

  const validateForm = () => {
    const fields = document.querySelectorAll('.validate')
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.trim() === '') {
        document.getElementById(fields[i].id).focus()
        return false
      }
    }
    return true
  }

  const saveJob = async () => {
    if (!validateForm()) return

    const method = job.id ? 'PUT' : 'POST'
    const url = job.id ? `http://localhost:8080/api/jobs/${job.id}` : 'http://localhost:8080/api/jobs'
    const storedUser = localStorage.getItem('user')
    const accessToken = storedUser ? JSON.parse(storedUser).accessToken : null
     const msg = job.id ? 'Updated successful!' : 'Added successful!'

    if (!accessToken) {
      navigate('/login') // Redirect to login if no token is found
      return
    }

    try {
      await API.request({
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        data: JSON.stringify(job)
      })

      navigate('/admin')
      M.toast({ html: msg, classes: 'green' });
    } catch (error) {
      console.error(error)
      M.toast({ html: error.message, classes: 'rounded' })
    }
  }

  const mockJobIdAndCreateDate = () => {
    return {
      ...job,
      id: 'XXXXXXXXXXXXXXXXXXXXXXXX',
      createDate: new Date()
    }
  }

  const form = (
    <div className="row">
      <form className="col s12">
        <div className="row" style={{ display: job.id ? 'block' : 'none' }}>
          <div className="input-field col s12">
            <input disabled value={job.id} id="id" type="text" />
            <label htmlFor="id">Id</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              required
              className="validate"
              value={job.title}
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
              value={job.company}
              id="company"
              type="text"
              onChange={handleChange}
            />
            <span className="helper-text" data-error="Company cannot be empty"></span>
            <label htmlFor="company">Company</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input value={job.logoUrl} id="logoUrl" type="text" onChange={handleChange} />
            <label htmlFor="logoUrl">Logo Url</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <textarea
              required
              className="materialize-textarea validate"
              id="description"
              onChange={handleChange}
              value={job.description}
            ></textarea>
            <span className="helper-text" data-error="Description cannot be empty"></span>
            <label htmlFor="description" className="active">
              Description
            </label>
          </div>
        </div>
      </form>
      <div className="row">
        <div className="input-field col s12">
          <button className="waves-effect waves-green btn-flat right" onClick={saveJob}>
            Save 
          </button>
          <button className="waves-effect waves-green btn-flat right" onClick={() => navigate('/admin')}>
            Cancel 
          </button>
        </div>
      </div>
    </div>
  )

  const jobData = job.id ? job : mockJobIdAndCreateDate()

  return (
    <div className="container">
      <div className="row">
        <div className="col s12">
          <ul className="tabs">
            <li className="tab col s4">
              <a className="active" href="#form">
                Form
              </a>
            </li>
            <li className="tab col s4">
              <a href="#home-card-preview">Home Card Preview</a>
            </li>
            <li className="tab col s4">
              <a href="#customer-card-preview">Customer Card Preview</a>
            </li>
          </ul>
        </div>
        <div id="form" className="col s12">
          {form}
        </div>
        <div id="home-card-preview" className="col s12">
          <JobCardHome job={jobData} />
        </div>
        <div id="customer-card-preview" className="col s12">
          <JobCardCustomer job={jobData} />
        </div>
      </div>
    </div>
  )
}

export default JobServiceForm

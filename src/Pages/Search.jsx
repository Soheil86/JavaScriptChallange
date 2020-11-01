import React, { useEffect, useState } from 'react'
import config from '../config'
import http from '../services/http'

export default function Search() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [jobList, setJobList] = useState([])
  const [similarJobList, setSimilarJobList] = useState([])
  const [jobTitle, setJobTitle] = useState()
  const [selectedLocation, setSeletedLocation] = useState('')
  const [selectedJob, setSeletedJob] = useState('')

  useEffect(() => {
    http.get(`${config.apiEndpoint}/locations`).then((res) => {
      setLocations(res.data.data)
    })
  }, [])

  const submitJobSearchForm = (e) => {
    e.preventDefault()
    setLoading(true)
    getJobs()
  }
  const getJobs = () => {
    http
      .get(
        `${config.apiEndpoint}/search-jobs?search.query=${jobTitle}&search.location=${selectedLocation}`
      )
      .then((res) => {
        console.log(res)
        if (res.data && res.data.included) {
          setJobList(res.data.included)
          console.log(res.data.included)
          setSeletedJob({ type: 'searched-job', ...res.data.included[0] })
          const id = res.data.id
          http
            .get(
              `${config.apiEndpoint}/search-jobs/results/${id}/similar-jobs?search.query=${jobTitle}&search.location=${selectedLocation}`
            )
            .then((res) => {
              setSimilarJobList(res.data.data)
            })
          setLoading(false)
        } else {
          setJobList([])
          setSimilarJobList([])
          setSeletedJob('')
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className='container-fluid'>
          <a className='navbar-brand text-primary' href='#a'>
            <b> Advance Job Search</b>
          </a>
          <form
            className='form-inline my-2 my-lg-0'
            onSubmit={submitJobSearchForm}
          >
            <input
              className='form-control border-primary mr-sm-2'
              type='search'
              aria-label='Search'
              placeholder='e.g. Web Developer'
              onChange={(e) => setJobTitle(e.currentTarget.value)}
            />
            <div>
              <input
                list='browsers'
                name='title'
                id='browser'
                className='form-control mr-sm-2 border-primary'
                placeholder='Location'
                type='search'
                aria-label='Search'
                onChange={(e) => setSeletedLocation(e.currentTarget.value)}
              />
              <datalist id='browsers'>
                {locations.map((loc) => {
                  return (
                    <option
                      key={loc.id}
                      value={loc.attributes.lat + ',' + loc.attributes.lng}
                    >
                      {loc.attributes.term}
                    </option>
                  )
                })}
              </datalist>
            </div>
            <button
              className='btn btn-primary my-2 my-sm-0'
              type='submit'
              disabled={!selectedLocation || !jobTitle}
            >
              Search
            </button>
          </form>
        </div>
      </nav>
      {loading && (
        <div className=' text-center mt-1'>
          <div
            className='spinner-border text-primary text-center'
            role='status'
          >
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
      {!loading && jobList.length === 0 && (
        <div className=' text-center mt-1'>
          <div>
            <span>No jobs found</span>
          </div>
        </div>
      )}

      {/* Main DIV */}
      <div className='container-fluid mt-1'>
        <div className='row '>
          {/* Showing Search Result */}
          <div className='col-md-3'>
            {jobList.length > 0 && (
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Search Result</h5>
                  <div className='list-group'>
                    {jobList.map((job) => {
                      job.type = 'searched-job'
                      let title = job.attributes.title
                      let jobAttributes = job.attributes
                      return (
                        <div
                          key={job.id}
                          className={`list-group-item list-group-item-action flex-column align-items-start ${
                            job.type === 'searched-job' &&
                            job.id === selectedJob.id
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => setSeletedJob(job)}
                        >
                          <div>
                            <img
                              className='mb-1'
                              src={jobAttributes.company.logo}
                              alt={jobAttributes.company.title}
                              height={20}
                            />
                          </div>
                          <div className='d-flex w-100 justify-content-between'>
                            <b className='mb-1'>
                              {title.length > 18
                                ? title.substring(0, 18) + '...'
                                : title}
                            </b>
                            <small></small>
                          </div>
                          <p className='mb-0'>{jobAttributes.company.name}</p>
                          <small>{jobAttributes.location.city}</small>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Div inorder to show Job after Clicking on Search Button */}
          <div className='col-md-6'>
            {selectedJob && (
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Job Description</h5>
                  <div className='job-section'>
                    <label>Responsibilities</label>
                    <p>{selectedJob.attributes.responsibilities}</p>
                    <label>Requirements</label>
                    <p>{selectedJob.attributes.requirements}</p>
                    <label>Qualification</label>
                    <p>{selectedJob.attributes?.qualifications[0]?.title}</p>
                    <label>Work timings</label>
                    <p>{selectedJob.attributes?.workingTimes[0]?.title}</p>
                    <label>Employment Type</label>
                    <p>{selectedJob.attributes?.employmentTypes[0]?.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Showing Similar Jobs */}
          <div className='col-md-3'>
            {similarJobList.length > 0 && (
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>Similar Jobs</h5>
                  <div className='list-group'>
                    {similarJobList.map((job) => {
                      job.type = 'similar-job'
                      let title = job.attributes.title
                      let jobAttributes = job.attributes
                      return (
                        <div
                          key={job.id}
                          className={`list-group-item list-group-item-action flex-column align-items-start ${
                            job.type === 'similar-job' &&
                            job.id === selectedJob.id
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => setSeletedJob(job)}
                        >
                          <div>
                            <img
                              className='mb-1'
                              src={jobAttributes.company.logo}
                              alt={jobAttributes.company.title}
                              height={20}
                            />
                          </div>
                          <div className='d-flex w-100 justify-content-between'>
                            <b className='mb-1'>
                              {title.length > 18
                                ? title.substring(0, 18) + '...'
                                : title}
                            </b>
                          </div>
                          <p className='mb-0'>{jobAttributes.company.name}</p>
                          <small>{jobAttributes.location.city}</small>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

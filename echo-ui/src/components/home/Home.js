import React, { Component } from 'react'
import M from 'materialize-css'
import JobList from './JobList'
import API from '../misc/api'
import ImageScroller from './ImageScroller';

class Home extends Component {
  state = {
    jobs: []
  }

  componentDidMount() {
    API.get(`jobs/newest?number=8`)
      .then(response => {
        this.setState({
          jobs: response.data
        })
      })
      .catch(error => {
        console.log(error)
        M.toast({ html: error, classes: 'rounded' })
      })

    M.Parallax.init(document.querySelectorAll('.parallax'))
  }

  render() {
    const { jobs } = this.state
    const scrollerImages = [
      `${process.env.PUBLIC_URL}/images/slide1.jpg`,
      `${process.env.PUBLIC_URL}/images/slide2.jpg`,
      `${process.env.PUBLIC_URL}/images/slide3.jpg`,
    ];
    
    return (
      <div>
        <div className="parallax-container">
           {/*  <div className="parallax"><img src="/nyc.jpg" alt="" /></div> */}
           <ImageScroller images={scrollerImages} />
        </div>
        <div className="section white" style={{ width: '100%', padding: 0 }}>
          {/*   <div className="container" style={{ width: '100%', maxWidth: '100%', padding: 0 }}>*/}
          <div className="container">
            <JobList jobs={jobs} />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
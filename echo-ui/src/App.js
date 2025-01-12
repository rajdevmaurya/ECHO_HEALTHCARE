import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
//import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
//import { Security, SecureRoute, LoginCallback } from '@okta/okta-react'
//import { useHistory } from 'react-router-dom';
import Footer from './components/misc/Footer'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Customer from './components/customer/Customer'
import JobView from './components/customer/JobView'
import Staff from './components/staff/Staff'
import JobForm from './components/staff/JobForm'
import JobServiceForm from './components/customer/JobServiceForm'
import Login from './components/home/Login'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Signup from './components/home/Signup'
import AdminForm from './components/admin/AdminForm'

import JobAdminForm from './components/admin/JobForm'



function App() {
  //const oktaAuth = new OktaAuth({
  //  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
  //  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  //  redirectUri: `${window.location.origin}/implicit/callback`
  //})

  //const history = useHistory();
 // const restoreOriginalUri = async (_oktaAuth, originalUri) => {
  //  history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  //};
  
  return (
<AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/customer/jobs/:job_id' exact element={<JobServiceForm />} />
          <Route path='/staff' exact element={<PrivateRoute><Staff/></PrivateRoute> } />


          <Route path='/jobs/:job_id'  exact element={<JobView/>} />
          <Route path='/staff/jobs'  exact element={<JobForm/>} />
          <Route path='/staff/jobs/:job_id' element={<JobForm />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path='/admin' exact element={<PrivateRoute><AdminForm/></PrivateRoute> } />
          <Route path='/admin/jobs'  exact element={<JobAdminForm/>} />
          <Route path='/admin/jobs/:job_id' element={<JobAdminForm />} />
          
        </Routes>
        <Footer />
    </AuthProvider>
  )
}

export default App

import React from 'react';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import validator from 'validator';


const ForgotPassword = () => {
    const [name, setName] = useState('');
    const currentPageURL = window.location.origin; 

  const navigate = useNavigate();

  const CandidateLogin = async () => {
    if (!name ) {
      window.alert('Enter All Fields.');
    }
    else if(!validator.isEmail(name)){
      window.alert('Enter Valid Email');
    }
    else {
      try {
        const res = await fetch('http://localhost:5000/forgotPassword', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name, currentPageURL
          })
        });
        if(res.status === 201){
          window.alert('A password Reset link is sent to your email');
        }else if (res.status === 400) {
            window.alert('Please fill all fields !');
        }
        else if (res.status === 401) {
            window.alert('Email not registered.Please sign up !');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className='login_container'>
      <div className="login_form">
        <div className="login_header">
          <h2>Forgot Password</h2>
        </div>
        <div className="login_body">
          <div className="form_ele"><FontAwesomeIcon icon={faUser} /><input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Email' /></div>
          {validator.isEmail(name) ? null : <div className="error">Enter valid email</div>}
          
          <div className="form_btns"><button onClick={CandidateLogin}>Send Password Reset Link</button></div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
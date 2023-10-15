import React from 'react';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useParams } from "react-router-dom";
import validator from 'validator';


const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const param = useParams();
    const id = param.id;


  const navigate = useNavigate();

  const CandidateLogin = async () => {
    if (!password || !cpassword ) {
      window.alert('Enter All Fields.')
    }
    else if(!validator.isLength(password, { min: 6 })){
      window.alert('Password must be atleast 6 characters long');
    }
    else if(password !== cpassword){
      window.alert('Password and Confirm Password do not match');
    }
    else {
      try {
        const res = await fetch('http://localhost:5000/resetPassword', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id, password
          })
        });
        if(res.status === 201){
            window.alert('Password Updated successfully');
           
            navigate('/');
        }else if(res.status === 400){
            window.alert('Please enter all fields');
       
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
          <h2>Reset Password</h2>
        </div>
        <div className="login_body">
         
          <div className="form_ele"> <FontAwesomeIcon icon={faLock} /><input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' /></div>
          {validator.isLength(password, { min: 6 }) ? null :  <div className="error">Password must be 6 characters long</div> }
          <div className="form_ele"> <FontAwesomeIcon icon={faLock} /><input type="password" name="cpassword" id="cpassword" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder='Confirm Password' /></div>
          
          <div className="form_btns"><button onClick={CandidateLogin}>Reset Password</button></div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
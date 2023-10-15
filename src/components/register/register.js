import React from 'react';
// import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faMapMarker, faCity, faFlag, faMapPin, faPhone  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
import { AdminContext } from '../../App';
import axios from 'axios';
// import { useValidator } from 'react-validator';
import validator from 'validator';

const Register = () => {
    const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [State, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');

  const { state, dispatch } = useContext(AdminContext);


  const navigate = useNavigate();

  const AdminLogin = async () => {
    if (!name || !email || !password || !cpassword || !address || !city || !State || !pinCode ||!contactNumber || !gender) {
      window.alert('Enter All Fields.');
    }
    else if (!validator.isEmail(email)) {
      window.alert("Enter a valid Email");
    }
    else if(!validator.isNumeric(pinCode) || !validator.isLength(pinCode, { min: 6, max: 6 })){
      window.alert("Enter a valid PinCode");
    }
    else if(!validator.isNumeric(contactNumber) || !validator.isLength(contactNumber, { min: 10, max: 10 })){
      window.alert("Enter a valid Contact Number");
    }
    else if(!validator.isLength(password, { min: 6 })){
      window.alert("Password must be atleast 6 characters long");
    }
    else if(password !== cpassword){
        window.alert('Password and Confirm password do not match');
    }
    else {
      try {
        
        const res = await axios.post('http://localhost:5000/register', {
            name, email, password, address, city, State , pinCode, gender, contactNumber
        });
        if(res.status === 201){

          window.alert('Candidate Redistered Successfully');
          
          navigate('/');
        }else if(res.status === 400){
          window.alert('Please Enter valid information');
        }
        else if(res.status === 422){
          window.alert('User Already exists');
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
          <h2>Candidate Register</h2>
        </div>
        <div className="login_body">
  <div className="form_ele">
    <FontAwesomeIcon icon={faUser} />
    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" required />
  </div>
  <div className="form_ele">
    <FontAwesomeIcon icon={faEnvelope} />
    <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
  </div>

  {validator.isEmail(email) ? null : <div className="error">Enter valid email</div>}

  
  <div className="form_ele">
    <FontAwesomeIcon icon={faMapMarker} />
    <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" required />
  </div>
  <div className="form_ele">
    <FontAwesomeIcon icon={faCity} />
    <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" required />
  </div>
  <div className="form_ele">
  <FontAwesomeIcon icon={faFlag} />
  <select
    name="state"
    id="state"
    value={state}
    onChange={(e) => setState(e.target.value)}
    required
  >
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
  </select>
</div>
  <div className="form_ele">
    <FontAwesomeIcon icon={faMapPin} />
    <input type="text" name="pinCode" id="pinCode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter Pin Code" required />
  </div>
  {validator.isNumeric(pinCode) && validator.isLength(pinCode, { min: 6, max: 6 }) ?  null : <div className="error">Enter valid PinCode</div>}
  <div className="form_ele">
    <FontAwesomeIcon icon={faPhone} />
    <input type="tel" name="contactNumber" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Enter Contact Number" required />
  </div>
  {validator.isNumeric(contactNumber) && validator.isLength(contactNumber, { min: 10, max: 10 }) ?  null : <div className="error">Enter valid contact</div>}
  <div className="form_ele2">
    <label>Gender:</label>
    <input type="radio" name="gender" id="male" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
    <label htmlFor="male">Male</label>
    <input type="radio" name="gender" id="female" value="female" checked={gender === "female"} onChange={() => setGender("female")} />
    <label htmlFor="female">Female</label>
    <input type="radio" name="gender" id="other" value="other" checked={gender === "other"} onChange={() => setGender("other")} />
    <label htmlFor="other">Other</label>
  </div>
  <div className="form_ele">
    <FontAwesomeIcon icon={faLock} />
    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required />
  </div>
  {validator.isLength(password, { min: 6 }) ? null :  <div className="error">Password must be 6 characters long</div> }
  <div className="form_ele">
    <FontAwesomeIcon icon={faLock} />
    <input type="password" name="cpassword" id="cpassword" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder="Confirm Password" required />
  </div>
  <div className="form_btns">
    <button onClick={AdminLogin}>Register</button>
  </div>
</div>
      </div>
    </div>
  )
}

export default Register
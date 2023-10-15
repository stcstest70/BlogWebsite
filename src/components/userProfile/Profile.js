import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Profile.css';
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { state2, dispatch2 } = useContext(UserContext);
  const [data, setData] = useState();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [State, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [userId, setUserId] = useState('');

  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem("UserToken");
    const res = await axios.post("http://localhost:5000/getUserdataByToken", {
      token,
    });
    if (res.status === 200) {
      const data = await res.data;
      setData(data.user);
      setName(data.user.name);
      setAddress(data.user.address);
      setGender(data.user.gender);
      setCity(data.user.city);
      setState(data.user.State);
      setPincode(data.user.pinCode);

      setUserId(data.user._id);

      dispatch2({ type: "USER", payload: true });
     
    } else if (res.status === 401) {
      navigate("/");
    }
   
    // console.log(data);
  };
  useEffect(() => {
    CheckTokenValid();
  }, []);

  const [isEditable, setIsEditable] = useState(false);
  // console.log(gender);

  const handleEditSubmit = async (id)=>{
    const res = await axios.post("http://localhost:5000/editUserDetails",{
      id, name, address, gender, city, State, pincode
    });
    if(res.status === 201){
      window.alert('User Details Updated Successfully');
      CheckTokenValid();
      setIsEditable(false);
    }else if(res.status === 400){
      window.alert('Enter Valid Details');
    }else{
      window.alert('Internal server error');
    }
  }

  return (
    <div>
      {data ? (<div className="profile_container">
        <div className="profile_top">
          <div className="profile_left">
          <div className="profile_left2">
            <span className="profileIcon">{data.name.charAt(0).toUpperCase()}</span> 
          </div>
          <div className="profile_left2">
          <h5>Welcome, </h5><h3>{data.name}</h3>
          </div>
          
          </div>
          <div className="profile_right">
            <div className="EditBtns">
            {isEditable ? <button onClick={()=> handleEditSubmit(data._id)}>Save</button> : null}<button onClick={()=> setIsEditable(!isEditable)}>{isEditable ? 'Cancel':'Edit'}</button>
            </div>
            
            {isEditable ? (<div>
           <div className="profilr_right_item">
              <span>Name</span>
              <input type="text" name="name" id="name" value={name} onChange={(e)=> setName(e.target.value)} />
            </div>
            <div className="profilr_right_item">
              <span>Email</span>
              <input type="text" name="name" id="name" value={data.email} disabled/>
            </div>
            <div className="profilr_right_item">
              <span>Address</span>
              <input type="text" name="name" id="name" value={address} onChange={(e)=> setAddress(e.target.value)} />
            </div>
            <div className="flexcontainer">
            <div className="profilr_right_item">
              <span>Gender</span>
              <select className="gender_select" name="gender" id="gender" value={gender} onChange={(e)=> setGender(e.target.value)}>
                 <option value="male">Male</option>
                 <option value="female">Female</option>
                 <option value="other">Other</option>
                  </select>
              {/* <input type="text" name="name" id="name" value={gender} onChange={(e)=> setGender(e.target.value)} /> */}
            </div>
            <div className="profilr_right_item">
              <span>City</span>
              <input type="text" name="name" id="name" value={city} onChange={(e)=> setCity(e.target.value)} />
            </div>
            </div>
            <div className="flexcontainer">
            <div className="profilr_right_item">
              <span>State</span>
              <input type="text" name="name" id="name" value={State} onChange={(e)=> setState(e.target.value)} />
            </div>
            <div className="profilr_right_item">
              <span>PinCode</span>
              <input type="text" name="name" id="name" value={pincode} onChange={(e)=> setPincode(e.target.value)} />
            </div>
            </div>
           </div>) : (<div>
           <div className="profilr_right_item">
              <span>Name</span>
              <input type="text" name="name" id="name" value={data.name} disabled/>
            </div>
            <div className="profilr_right_item">
              <span>Email</span>
              <input type="text" name="name" id="name" value={data.email} disabled/>
            </div>
            <div className="profilr_right_item">
              <span>Address</span>
              <input type="text" name="name" id="name" value={data.address} disabled/>
            </div>
            <div className="flexcontainer">
            <div className="profilr_right_item">
              <span>Gender</span>
              <input type="text" name="name" id="name" value={data.gender} disabled/>
            </div>
            <div className="profilr_right_item">
              <span>City</span>
              <input type="text" name="name" id="name" value={data.city} disabled/>
            </div>
            </div>
            <div className="flexcontainer">
            <div className="profilr_right_item">
              <span>State</span>
              <input type="text" name="name" id="name" value={data.State} disabled/>
            </div>
            <div className="profilr_right_item">
              <span>PinCode</span>
              <input type="text" name="name" id="name" value={data.pinCode} disabled/>
            </div>
            </div>
           </div>)}
           
            
          </div>


        </div>
        
      </div>) : (<div>Loading</div>)}

      {/* user liked blogs */}

      {data && data?.likedBlogs ? (<div className="comment">
        <h6>Liked Blogs</h6><br />
        {data.likedBlogs.map((item, index)=>(
          <div key={index} className="likedBlogs">
            <div className="like_top">
              <div className="userIcon" style={{color:'white'}}>
              {item.blogId.name.charAt(0).toUpperCase()}
              </div>
              <div className="like_top_right">
                <div>
                  {item.blogId.title}
                </div>
                <p>
                {item.blogId.name}
                </p>
              </div>
            </div>
            <div className="like_bottom">
              <Link to={`/blog?categoryId=${item.blogId.category}&blogId=${item.blogId._id}&userId=${userId}`}>Read Full Blog...</Link>
            {/* {item.blogId.category}
            {item.blogId._id} */}

            </div>
          </div>
        ))}
      </div>):(<div>Loading Comments</div>)}
    </div>
  )
}

export default Profile
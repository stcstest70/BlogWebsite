import React, {useState, useEffect, useContext} from 'react'
import './nav.css'
import { useNavigate } from "react-router-dom";
import { AdminContext } from '../../App';
import { UserContext } from '../../App';
 import logo from './logo.png';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSearch } from '../searchReducer';

const Nav = () => {
  const { state, dispatch } = useContext(AdminContext);
  const { state2, dispatch2 } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [search, setSearchString] = useState('');
  const { searchString, setSearch } = useSearch();
  const navigate = useNavigate();
  // const [debouncedSearchString, setDebouncedSearchString] = useState(searchString);
  // let debounceTimeout;

  // const debounceSearch = (value) => {
  //   clearTimeout(debounceTimeout);
  //   debounceTimeout = setTimeout(() => {
  //     setDebouncedSearchString(value);
  //   }, 3000); // Adjust the delay (in milliseconds) as needed
  // };

  // // Update debouncedSearchString whenever searchString changes
  // useEffect(() => {
  //   debounceSearch(searchString);
  // }, [searchString]);
  const handleShow = (e)=>{
    e.stopPropagation();
    setShow(!show);
  }

  const nav1=()=>{
    navigate('/');
  }
  const nav2=()=>{
    navigate('/register');
  }
  const nav3=()=>{
    sessionStorage.removeItem("AdminToken");
        sessionStorage.setItem("AdminToken", JSON.stringify([]));
        dispatch({type:"ADMIN", payload:false});
        navigate('/');
  }
  const nav4=()=>{
    sessionStorage.removeItem("UserToken");
    sessionStorage.setItem("UserToken", JSON.stringify([]));
    dispatch2({type:"USER", payload:false});
    navigate('/');
  }
  const nav5=()=>{
    navigate('/home');
  }
  const nav6=()=>{
    navigate('/category');
  }
  const nav7=()=>{
    navigate('/user/profile');
  }
  const [name, setName] = useState('');
 
  const [searchResult, setSearchResult] = useState();
  const handleSearch =()=>{
    setSearch(search);
  }
  
  const NavLinks = ()=>{
    if(state){
      return (<div className='nav_links'> <span onClick={nav5}>Blogs</span>  <span onClick={nav6}>Category</span>  <span onClick={nav3}>Logout</span> </div>)
    }else if(state2){
      try {
        const CheckTokenValid = async () => {
          const token = sessionStorage.getItem('UserToken');
          const res = await axios.post('http://localhost:5000/checkUserTokenValid', {
              token
          });
          if (res.status === 200) {
            const data = await res.data;
            const { decoded } = data;
           
            dispatch2({ type: "USER", payload: true });
            // console.log(decoded);
            setName(decoded.name);
          }
          else if (res.status === 401) {
            navigate('/');
          }
        }
        CheckTokenValid();
        
      } catch (error) {
        console.log(error);
      }
     
      return (<div style={{ display:'flex', cursor:'pointer', position:'relative'}} onClick={handleShow}>
        <div style={{ color: 'white', backgroundColor: '#022fc5', padding:'5px', borderRadius:'50%',width:'42px', height:'42px', textAlign:'center', fontSize:'21px', position:'relative' }}> {name.charAt(0).toUpperCase()}
        </div>
        <div style={{ position:'absolute', top:'8px', left: '45px'}} >▼</div>
        {show ? ( <div style={{ position: 'absolute', top: '44px', left: '-9px', width: '100%' }}>
            <button style={{border:'none', borderRadius:'2px'}} onClick={nav7}>Profile</button>
            <button style={{border:'none', borderRadius:'2px'}} onClick={nav4}>Logout</button>
        </div>) : ''}
       
        </div>)
    }
    else{
      return (<div className='nav_links'><span onClick={nav1}>Login</span>  <span onClick={nav2}>Register</span></div>);
    }
  }
  return (
    <div className='nav_container'>
      
        <div className='nav_logo'>
            <img src={logo} alt="LOGO" /> {state2? (<div className='search'><FontAwesomeIcon icon={faSearch} onClick={handleSearch}/> <input
      type="text"
      name="search"
      value={search}
        onChange={(e) => setSearchString(e.target.value)}
      placeholder="Search by title"
    /></div>) : ''}
        </div>
        <div className="searchResults">
          <ul>
            {searchResult ? (<div className='searchResult'><ul>
            {
              searchResult.map((item, index)=>(
                <li key={index}> <Link to={`/blog/${item._id}`} onClick={()=> setSearchResult('')}>{item.title}</Link> </li>
              ))
            }

              </ul></div>):(<div></div>)}
          </ul>
        </div>
        <NavLinks />
    </div>
  )
}

export default Nav
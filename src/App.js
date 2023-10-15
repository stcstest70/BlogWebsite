import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/login/adminLogin";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";

import { createContext, useReducer } from 'react';
import { initialState, reducer } from "./components/reducer";
import { initialState2, reducer2 } from "./components/reducer2";
import Register from './components/register/register.js';
import CandidateHome from "./components/candidateHome/candidateHome";
import Blog from "./components/blog/blog";
import { SearchProvider } from "./components/searchReducer";
import ForgotPassword from "./components/login/forgotPassword";
import ResetPassword from "./components/login/resetPassword";
import Category from "./components/home/category";
import Profile from "./components/userProfile/Profile";

export const AdminContext = createContext();
export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [state2, dispatch2] = useReducer(reducer2, initialState2);
  if ("AdminToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("AdminToken", JSON.stringify([]));
  }
  if ("UserToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("UserToken", JSON.stringify([]));
  }
  return (
    <>
     <SearchProvider>
     <AdminContext.Provider value={{state, dispatch}}>
     <UserContext.Provider value={{state2, dispatch2}}>
     <Nav />
      <Routes>
          <Route path="/" element={<AdminLogin />} exact />
          <Route path="/home" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/candidate" element={<CandidateHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/users/:id/resetPassword" element={<ResetPassword />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/user/profile" element={<Profile />} />
      </Routes>
     </UserContext.Provider>
    
      </AdminContext.Provider>
     </SearchProvider>
     
    </>
  );
}

export default App;

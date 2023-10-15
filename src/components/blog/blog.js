import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./blog.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from 'react-router-dom';

const Blog = () => {
  // const { id } = useParams();
  // const { category } = useParams();
  const { search } = useLocation();

  function getQueryParams(search) {
    const params = new URLSearchParams(search);
    const queryParams = {};
    for (const [key, value] of params) {
      queryParams[key] = value;
    }
    return queryParams;
  }

  const queryParams = getQueryParams(search);
  const category = queryParams.categoryId;
  const id = queryParams.blogId;
  const userid = queryParams.userId;

  const [blogId, setBlogId] = useState(id);
  // console.log(blogId);

  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { state2, dispatch2 } = useContext(UserContext);
  const [userId, setUserId] = useState(userid);

  const [disabled, setDisabled] = useState(false);

  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem("UserToken");
    const res = await axios.post("http://localhost:5000/checkUserTokenValid", {
      token,
    });
    if (res.status === 200) {
      const data = await res.data;
      const { decoded } = data;

      dispatch2({ type: "USER", payload: true });
      // console.log(decoded);
      setUserId(decoded.id);
    } else if (res.status === 401) {
      navigate("/");
    }
  };
  const getLike = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/getLikes?id=${blogId}&userId=${userId}`
      );
      const data = res.data;
      // console.log(data);
      setLikes(data.likesCount);
      setLiked(data.liked);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(liked);
  useEffect(() => {
    CheckTokenValid();
    getLike();
  }, []);

  const [data, setData] = useState();
  const getBlogById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getBlogById?id=${blogId}`
      );

      if (response.status === 200) {
        const data = response.data;
        setData(data);
      } else {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getBlogById();
  }, [blogId]);
  const [blogs, setBlogs] = useState();
  const [perPage, setperPage] = useState("10");
  const getBlogByCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getBlogByCategory?category=${category}&perPage=${perPage}`
      );

      if (response.status === 200) {
        const data = response.data;
        // console.log(data);
        setBlogs(data);
      } else {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlogByCategory();
  }, [id, category]);

  const getComment = async () => {
    const res = await axios.get(
      `http://localhost:5000/getComments?blogId=${blogId}&count=${commentCount}`
    );
    const data = res.data;
    // console.log(data);
    setComment(data);
  };

  const handleBlogClick = (id) => {
    setBlogId(id);
    // console.log(blogId);
    navigate(`/blog?categoryId=${category}&blogId=${id}&userId=${userid}`);
    getComment();
    getLike();
  };

  //likes section
  const [likes, setLikes] = useState(0);

  
  // console.log(likes);
  

  const userLiked = async () => {
    try {
      // console.log('inside user liked');
      const res = await axios.get(
        `http://localhost:5000/setLike?id=${blogId}&userId=${userId}`
      );
      if(res.status === 201){
      //   const likes = res.data;
      // console.log(likes);
      // setLikes(likes.likes);
      getLike();
      }else if(res.status === 400 || res.status === 404){
        setDisabled(true);
        setLiked(true);
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  
    //comments section
  const [comment, setComment] = useState();
  const [commentCount, setCommentCount] = useState(10);



  useEffect(() => {
    getComment(blogId);
    
  }, []);

  

  const [isCommenting, setIsCommenting] = useState(false);
  const [commentTitle, setCommentTitle] = useState("");
  const [commentDescription, setCommentDescription] = useState("");

  const handleCommentClick = () => {
    setIsCommenting(!isCommenting);
  };

  const handleCommentSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/postComment", {
        userId,
        blogId,
        commentTitle,
        commentDescription,
      });
      if (res.status === 201) {
        getComment();
        window.alert("Comment added successfully");
      } else {
        window.alert("Internal server error");
      }
    } catch (error) {
      console.log(error);
    }
    setIsCommenting(false);
    setCommentTitle("");
    setCommentDescription("");
  };

  return (
    <div className="blog_container2">
      <div className="blog_container">
        <div className="blog">
          {data ? (
            <div>
              <div>
                <h2>{data.title}</h2>
              </div>
              <div className="blog_header">
                <h5>{data.name} </h5>
                <p>
                  {new Date(data.createdAt).toLocaleString("default", {
                    month: "short",
                  })}{" "}
                  {new Date(data.createdAt).getDate()}
                </p>
                <p>{data.category.category}</p>
              </div>
              <div className="blog_img">
                <img src={data.image} alt="Image" />
              </div>
              <div className="blog_content">{data.blog}</div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="bloglist">
          <h4> Similar Blogs</h4>
          {blogs ? (
            <div className="blogs">
              {blogs.map((item, index) => (
                //  <Link to={`/blog/${item.category}/${item._id}`}>
                <div
                  className="blogItem"
                  key={index}
                  onClick={() => handleBlogClick(item._id)}
                 
                >
                  <div className="blogtitle">
                    <h5 classname="two-line-ellipsis">{item.title}</h5>
                  </div>
                  <div className="blogBody">
                    <p className="two-line-ellipsis">{item.blog}</p>
                  </div>
                </div>
                //  </Link>
              ))}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <div className="comments">
        <div className="likes">
          <div style={{display:'flex'}}>
              <button className={liked ? "like red" : "like"} onClick={()=> userLiked()} disabled={disabled}>   <FontAwesomeIcon icon={faThumbsUp} /></button>
              <div>{likes}</div>
          </div>
          
          {/* <button
            className={liked ? "like red" : "like"}
            onClick={() => handleLike(data._id.toString())}
          >
           
            <FontAwesomeIcon icon={faThumbsUp} />{" "}
            <div className="like">{likes}</div>{" "}
          </button> */}
          <button className="commentShowBtn" onClick={handleCommentClick}>Comment</button>
       
        </div>

        <div>
          <div className={`comment-form ${isCommenting ? "active" : ""}`}>
            <input
              type="text"
              placeholder="Comment Title"
              value={commentTitle}
              onChange={(e) => setCommentTitle(e.target.value)}
            />
            <textarea
              placeholder="Comment Description"
              value={commentDescription}
              onChange={(e) => setCommentDescription(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Submit Comment</button>
          </div>
        </div>

        <div className="allComments">
          <div className="comment_container">
            {comment ? (<div>
              {comment.map((item, index)=>(
                <div className="comment_item" key={index}>
                  <div className="commentHead">
                    <div>
                      <span className="userIcon">{item.userId.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h5>{item.title}</h5><p>{item.userId.name}</p> 
                    </div>
                  </div>
                <div className="commentBody">
                  <p>{item.comment}</p>
                </div>
              </div>
              ))}
            </div>) :  (<div>Loading Comments...</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

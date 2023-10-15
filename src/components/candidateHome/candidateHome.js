import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./candidate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSearch } from "../searchReducer";
import axios from "axios";

const CandidateHome = () => {
  const { searchString, setSearch } = useSearch();
  const { state2, dispatch2 } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState();
  const blogsPerPage = 4;
  const [totalBlog, setTotalBlog] = useState();
  
  const [selectedOption, setSelectedOption] = useState("");
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  const navigate = useNavigate();
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
      setUserName(decoded.id);
    } else if (res.status === 401) {
      navigate("/");
    }
  };

  useEffect(() => {
    CheckTokenValid();
  }, []);

  const getCategory = async () => {
    try {
      const res = await axios.get("/getAllCategory");
      if (res.status === 200) {
        const data = res.data;
        setCategories(data);
      } else {
        throw new Error(
          `Failed to fetch data: ${res.status} ${res.statusText}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  const getBlogTotal = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getTotalBlogs?searchString=${searchString}&selectedCategory=${selectedOption}`
      );

      if (response.status === 200) {
        const data = response.data;
        setTotalBlog(data);
      } else {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [data, setData] = useState();
  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getBlogs?page=${currentPage}&perPage=${blogsPerPage}&searchString=${searchString}&selectedCategory=${selectedOption}`
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
  //   console.log(data);
  useEffect(() => {
    getData();
    getBlogTotal();
  }, [currentPage, searchString, selectedOption]);
  const maxParagraphLength = 200;

  const renderPagination = () => {
    if (!data) {
      return null; // Return null or a loading indicator when data is undefined
    }

    const totalBlogs = totalBlog;
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);

    const visiblePageCount = 5; // Number of visible page buttons
    // const currentPage = currentPage;

    // Calculate the range of page buttons to display
    let startPage = Math.max(currentPage - Math.floor(visiblePageCount / 2), 1);
    let endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

    // Adjust the range if the startPage goes below 1
    if (startPage + visiblePageCount - 1 > totalPages) {
      startPage = totalPages - visiblePageCount + 1;
    }
    startPage = Math.max(startPage, 1);

    const paginationItems = [];

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <button key={i} onClick={() => setCurrentPage(i)}>
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <p> More Pages :</p> {paginationItems}
      </div>
    );
  };

  const [sortBy, setSortBy] = useState("name");

  const sortByDate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/getBlogsById?page=${currentPage}&perPage=${blogsPerPage}&sortBy=${sortBy}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch data: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };
  useEffect(() => {
    sortByDate();
  }, [sortBy]);
  
  return (
    <div className="candidate_container">
      <div className="candidate_container_header">
        <div>
          <h4>Sort By </h4>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="title">Sort by Title</option>
            <option value="createdAt">Sort by Date</option>
          </select>
        </div>
        <div>
          <h4>Category</h4>
          {categories ? (
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.category}
                </option>
              ))}
            </select>
          ) : (
            <div>Loading categories...</div>
          )}
        </div>
      </div>

      <div className="card_container">
        {data ? (
          <div>
            {data.map((item, index) => (
              // <Link to={`/blog/${item.category._id}/${item._id}`}>
              <Link to={`/blog?categoryId=${item.category._id}&blogId=${item._id}&userId=${userName}`}>
                <div className="cards" key={index}>
                  <div className="card_left">
                    <div className="card_head">
                      <FontAwesomeIcon icon={faUser} />
                      <h6>{item.name}</h6>
                      <div id="date">
                        <div>
                        {new Date(item.createdAt).toLocaleString("default", {
                          month: "short",
                        })}{" "}
                        {new Date(item.createdAt).getDate()}  
                        </div>
                         
                        <span>{item.category.category}</span> 
                      </div>
                    </div>
                    <div className="card_title">
                      <h5>{item.title}</h5>
                    </div>

                    <div className="card_body">
                      <p>
                        {item.blog.length > maxParagraphLength
                          ? item.blog.slice(0, maxParagraphLength) + "..."
                          : item.blog}
                      </p>
                    </div>
                  </div>
                  <div className="card_right">
                    <img src={item.image} alt="Image" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {renderPagination()}
    </div>
  );
};

export default CandidateHome;

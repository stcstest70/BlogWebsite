import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { storage } from "../Firebase";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Home = () => {
  const { state, dispatch } = useContext(AdminContext);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");

  const [image, setImage] = useState('');
  const [imgUpload, setImgUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgUploadMsg, setImgUploadMsg] = useState('');

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setImgUpload(selectedFile);
  };


  const handleImageUpload = () => {
    if (imgUpload) {
      const imageRef = ref(storage, `Courses/${imgUpload.name}`);
      const uploadTask = uploadBytesResumable(imageRef, imgUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error during upload:', error);
        },
        () => {
          console.log('Image uploaded successfully');
          setImgUploadMsg('Image Uploaded');
          setUploadProgress(100);

          // Get the download URL
          getDownloadURL(imageRef)
            .then((url) => {
              setImage(url);
            })
            .catch((err) => console.error('Error getting download URL:', err));
        }
      );
    } else {
      setImgUploadMsg('Please select an image');
    }
  };
  const [newImg, setNewImg] = useState('');
  const handleImageUpload2 = () => {
    if (imgUpload) {
      const imageRef = ref(storage, `Courses/${imgUpload.name}`);
      const uploadTask = uploadBytesResumable(imageRef, imgUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error during upload:', error);
        },
        () => {
          console.log('Image uploaded successfully');
          setImgUploadMsg('Image Uploaded');
          setUploadProgress(100);

          // Get the download URL
          getDownloadURL(imageRef)
            .then((url) => {
              setNewImg(url);
            })
            .catch((err) => console.error('Error getting download URL:', err));
        }
      );
    } else {
      setImgUploadMsg('Please select an image');
    }
  };

  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem("AdminToken");

    try {
      const res = await axios.post(
        "http://localhost:5000/checkAdminTokenValid",
        {
          token,
        }
      );

      if (res.status === 200) {
        const { decoded } = res.data; // Access data directly

        dispatch({ type: "ADMIN", payload: true });
        setUserName(decoded.name);
      } else if (res.status === 401) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      // Handle errors appropriately
    }
  };
  useEffect(() => {
    CheckTokenValid();
  }, []);
  // console.log(userName);

  const [modalState, setModalState] = useState("close");
  const handleShowModalOne = () => {
    setModalState("modal-one");
  };
  const handleShowModalTwo = () => {
    setModalState("modal-two");
  };
  const handleShowModalThree = () => {
    setModalState("modal-three");
  };
  const handleClose = () => {
    setModalState("close");
  };

  const [title, setTitle] = useState("");
  const [blog, setBlog] = useState("");

  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    try {
      if(!userName || !title || !blog || !selectedOption || !image){
        window.alert('All fields required');
      }
      else{
        const res = await axios.post("http://localhost:5000/addBlog", {
        userName,
        title,
        blog,
        selectedOption,
        image
      });
      if (res.status === 201) {
        window.alert("Blog added successfully");
        setTitle('');setBlog('');setSelectedOption('');setImgUpload(null);setImage('');setUploadProgress(0);
        getData();
        setModalState("close");
      } else {
        window.alert("Internal server error");
      }
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if(!newImg){
        setNewImg(editImage);
      }
      const res = await axios.post("http://localhost:5000/editBlog", {
        blogid,
        editName,
        title_edit,
        blog_edit,
        selectedOption2,
        newImg
      });
      if (res.status === 201) {
        window.alert("Blog Updated successfully");
        getData();
        setModalState("close");
      } else if (res.status === 400) {
        window.alert("Enter All Fields");
        getData();
        setModalState("close");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState();

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getAllBlogs");

      if (response.status === 200) {
        const data = response.data;
        setData(data);
        setLoading(false);
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
    getData();
  }, []);
  const [blogid, setid] = useState("");

  const [title_edit, setTitle_edit] = useState("");
  const [blog_edit, setBlog_edit] = useState("");
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const handleEdit = (id, name, title, blog, category, image) => {
    setid(id);
    setTitle_edit(title);
    setBlog_edit(blog);
    setEditName(name);
    setSelectedOption2(category._id);
    // console.log(category.category);
    // console.log(category);
    setEditImage(image)
    handleShowModalTwo();
  };

  const [delId, setDelId] = useState("");
  const handleDelete = (id) => {
    setDelId(id);
    handleShowModalThree();
  };
  const handleDeleteSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/deleteBlog", {
        delId,
      });
      if (res.status === 201) {
        window.alert("Blog Deleted successfully");
        getData();
        setModalState("close");
      } else if (res.status === 400) {
        window.alert("Internal server error");
        getData();
        setModalState("close");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  return (
    <div className="home_container">
      <div className="home_top">
        <h4>Add Blog </h4>{" "}
        <Button variant="primary" onClick={handleShowModalOne}>
          Add
        </Button>
      </div>
      <Modal
        show={modalState === "modal-one"}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Blog </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            name="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
          />
          <br />
          <input
            type="text"
            name="level"
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            placeholder="Enter Blog"
          />
          <br />
          {categories ? (
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select an option</option>
              {categories.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.category}
                </option>
              ))}
            </select>
          ) : (
            <div>Loading categories...</div>
          )}
            <input type="file" name="image" onChange={handleFileInputChange} />
          <div className='uploadProgress'><Button variant="primary" onClick={handleImageUpload}>Upload Image</Button> Upload Progress: {uploadProgress.toFixed(2)}%</div>
          <br />
          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="tablecontainer table table-responsive">
        <table className="content-table tableC">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Created By</th>
              <th>Title</th>
              <th>Blog</th>
              <th>Category</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          {data ? (
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.title}</td>
                  <td>{item.blog}</td>
                  <td>{item.category.category}</td>
                  <td>
                    <a href={item.image} rel="noreferrer" target="_blank">image url</a>
                  </td>
                  <td>
                    {" "}
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleEdit(
                          item._id,
                          item.name,
                          item.title,
                          item.blog,
                          item.category,
                          item.image
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  </td>
                  <Modal
                    show={modalState === "modal-two"}
                    onHide={handleClose}
                    backdrop="static"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Blog </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <input
                        type="text"
                        name="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter Name"
                      />
                      <br />
                      <input
                        type="text"
                        name="title"
                        value={title_edit}
                        onChange={(e) => setTitle_edit(e.target.value)}
                        placeholder="Enter Title"
                      />
                      <br />
                      <input
                        type="text"
                        name="blog"
                        value={blog_edit}
                        onChange={(e) => setBlog_edit(e.target.value)}
                        placeholder="Enter Blog"
                      />
                      <br />
                      {categories ? (
                        <select
                          value={selectedOption2}
                          onChange={(e) => setSelectedOption2(e.target.value)}
                        >
                          <option value="">Select an option</option>
                          {categories.map((option, index) => (
                            <option key={index} value={option._id}>
                              {option.category}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div>Loading categories...</div>
                      )}
                      <div className="modalImage">
                      <img src={editImage} alt="Image" />
                      </div>
                     
                       <input type="file" name="image" onChange={handleFileInputChange} />
          <div className='uploadProgress'><Button variant="primary" onClick={handleImageUpload2}>Upload Image</Button> Upload Progress: {uploadProgress.toFixed(2)}%</div>
          <br />
                      <div className="btns">
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleEditSubmit}>
                          Edit
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <td>
                    {" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                  <Modal
                    show={modalState === "modal-three"}
                    onHide={handleClose}
                    backdrop="static"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Are you sure you want to delete the blog ?{" "}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="btns">
                        <Button variant="secondary" onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSubmit}>
                          Delete
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Home;

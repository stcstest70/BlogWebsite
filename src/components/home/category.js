import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Category = () => {
  const { state, dispatch } = useContext(AdminContext);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem("AdminToken");
    const res = await axios.post("http://localhost:5000/checkAdminTokenValid", {
      token,
    });
    if (res.status === 200) {
      const data = await res.data;
      const { decoded } = data;

      dispatch({ type: "ADMIN", payload: true });
      // console.log(decoded);
      setUserName(decoded.name);
    } else if (res.status === 401) {
      navigate("/");
    }
  };
  useEffect(() => {
    CheckTokenValid();
  }, []);

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

  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/addCategory", {
        userName,
        category,
      });
      if (res.status === 201) {
        window.alert("Category added successfully");
        getData();
        setModalState("close");
      } else {
        window.alert("Internal server error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [data, setData] = useState();
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getAllCategory");

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
    getData();
  }, []);

  const [catid, setid] = useState("");
  const [editName, setEditName] = useState("");
  const [cat_edit, setCat_edit] = useState("");

  const handleEdit = (id, name, cat) => {
    setid(id);
    setCat_edit(cat);
    setEditName(name);
    handleShowModalTwo();
  };

  const handleEditSubmit = async ()=>{
    try {
        const res = await axios.post('http://localhost:5000/editCategory',{
          catid, editName, cat_edit
        })
        if (res.status === 201) {
          window.alert('Category Updated successfully');
          getData();
          setModalState("close");
        } else if (res.status === 400){
          window.alert('Enter All Fields');
          getData();
          setModalState("close");
        }
      } catch (error) {
        console.log(error);
      }
  }

  const [delId, setDelId] = useState('');
  const handleDelete = (id) =>{
    setDelId(id);
    handleShowModalThree();
  }
  const handleDeleteSubmit = async ()=>{
    try {
      const res = await axios.post('http://localhost:5000/deleteCategory', {
          delId
      });
      if (res.status === 201) {
        window.alert('Category Deleted successfully');
        getData();
        setModalState("close");
      } else if (res.status === 400){
        window.alert('Internal server error');
        getData();
        setModalState("close");
      }
    } catch (error) {
      console.log(error);
    }
  }

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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter Category"
          />
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
              <th>Category</th>
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
                  <td>{item.category}</td>
                  <td>
                    {" "}
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleEdit(item._id, item.name, item.category)
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
                        value={cat_edit}
                        onChange={(e) => setCat_edit(e.target.value)}
                        placeholder="Enter Title"
                      />
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
                  
                  <td> <Button variant="danger" onClick={()=> handleDelete(item._id)}><FontAwesomeIcon icon={faTrash } /></Button></td>
                  <Modal
        show={modalState === "modal-three"} onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete the blog ? </Modal.Title>
        </Modal.Header>
        <Modal.Body>
      
          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSubmit}>Delete</Button>
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

export default Category;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PopUp.css";
import { baseURL } from "../lib/config";
import { useNavigate } from "react-router-dom";

export default function PopUp({close}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phoneNumber: "",
    email: "",
  });

  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleModal = () => setShowModal(!showModal); // Toggle modal visibility

  const handleSubmit = async () => {
    console.log(formData);
    const response = await fetch(`${baseURL}/patients/add-patient`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.fullName,    // Make sure these property names match
        dob: formData.dob,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      })
    });
    const data = await response.json();
    if (data.message === "success") {
      navigate("/submit-report", { state: { patientId: data.data.id, patientName: data.data.patientName } });
    } else {
      alert("Failed to add patient");
    }
  }

  return (
        <div
          className="modal"
          tabIndex={-1} 
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Patient</h5>
              </div>
              <div className="modal-body">
                <div className="mb-3 d-flex">
                  <label htmlFor="fullName" className="col-sm-2">
                    Full Name:
                  </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      name="fullName"
                      className="form-control"
                      style={{ border: '1px solid #ccc' }} // Add border inline as a test
                    />
                </div>

                <div className="mb-3 d-flex">
                  <label htmlFor="dob" className="form-label me-3">
                    Date of Birth:
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    name="dob"
                    className="form-control"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label htmlFor="phoneNumber" className="form-label me-3">
                    Phone Number:
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    name="phoneNumber"
                    className="form-control"
                  />
                </div>
                <div className="mb-3 d-flex">
                  <label htmlFor="email" className="form-label me-3">
                    Email Address:
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={close}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}

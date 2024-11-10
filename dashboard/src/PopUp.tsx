import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

export default function PopUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phoneNumber: "",
    email: "",
  });

  const [showModal, setShowModal] = useState(false); // To control modal visibility

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleModal = () => setShowModal(!showModal); // Toggle modal visibility

  return (
    <div className="main-container">
      {/* Trigger Button to Open Modal */}
      <button className="btn btn-primary" onClick={toggleModal}>
        Open Form
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal"
          tabIndex={-1} // This makes the modal element focusable when open
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Patient</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <label htmlFor="fullName" className="col-sm-2 col-form-label">
                    Full Name:
                  </label>
                  <div className="col-sm-10">
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      name="fullName"
                      className="form-control"
                    />
                  </div>
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
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

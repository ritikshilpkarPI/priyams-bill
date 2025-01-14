import React, { useState } from "react";
import "./AssignOrderToRider.scss";

const AssignOrderToRider = ({ order, riders, onAssignRider }) => {
  const [selectedRider, setSelectedRider] = useState("");
  const [selectedRiderDetails, setSelectedRiderDetails] = useState(null);

  const handleAssignRider = () => {
    if (!selectedRider) return;
    const rider = riders.find((r) => r._id === selectedRider);
    onAssignRider({orderId: order._id, riderId: rider._id, riderName: rider?.name});
  };

  const handleSelectRider = (e) => {
    const riderId = e.target.value;
    setSelectedRider(riderId);
    const rider = riders.find((r) => r._id === riderId);
    setSelectedRiderDetails(rider || null);
  };

  return (
    <div className="assign-rider-container-wrapper">
      <div className="assign-rider-header">Assign a Rider</div>

      <div className="assign-rider-select-button-container">
        <select
          value={selectedRider}
          onChange={handleSelectRider}
          className="select-container"
        >
          <option className="select-default-option" value="">
            Select a rider
          </option>
          {riders?.map((rider) => (
            <option className="select-rider-option" key={rider._id} value={rider._id}>
              {rider.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssignRider}
          disabled={!selectedRider}
          style={{
            backgroundColor: selectedRider ? "#1890ff" : "#ddd",
            color: selectedRider ? "#fff" : "#666",
            cursor: selectedRider ? "pointer" : "not-allowed",
          }}
          className="assign-rider-button"
        >
          Assign Rider
        </button>
      </div>

      {selectedRiderDetails && (
        <div className="selected-rider-details">
          <h5>Selected Rider</h5>
          <p className="selected-rider-details-label">
            <strong className="selected-rider-details-label">Name:</strong> {selectedRiderDetails.name}
          </p>
          <p className="selected-rider-details-label">
            <strong className="selected-rider-details-label">Phone:</strong> {selectedRiderDetails.phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignOrderToRider;

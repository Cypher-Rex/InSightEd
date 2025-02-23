import React, { useState, useEffect } from "react";

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState("2025-02-23");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [participants, setParticipants] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [bookingType, setBookingType] = useState(null);
  const [studentsCount, setStudentsCount] = useState(1);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSlot) {
      const bookingData = {
        bookingType,
        date: selectedDate,
        timeSlot: selectedSlot,
        ...(bookingType === "doctor" ? { symptoms } : { studentsCount }),
      };

      try {
        const response = await fetch("http://localhost:5000/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("✅ Booking Confirmed:", result);
          setSubmittedData(bookingData);
        } else {
          console.error("❌ Error:", result.error);
        }
      } catch (error) {
        console.error("❌ API Error:", error);
      }

      setSelectedSlot("");
      setStudentsCount(1);
      setSymptoms("");
    }
  };

  const facilities = [
    { id: "pool", name: "Swimming Pool", maxCapacity: 30 },
    { id: "cricket", name: "Cricket Ground", maxCapacity: 40 },
    { id: "doctor", name: "Doctor Appointment", maxCapacity: 50 },
  ];

  const fetchAvailability = (facilityId) => {
    const mockData = {
      pool: [
        { time: "09:00 - 10:00", available: 15 },
        { time: "10:00 - 11:00", available: 8 },
        { time: "11:00 - 12:00", available: 20 },
      ],
      cricket: [
        { time: "14:00 - 15:00", available: 12 },
        { time: "15:00 - 16:00", available: 5 },
        { time: "16:00 - 17:00", available: 0 },
      ],
      doctor: [
        { time: "09:00 - 09:30", available: 10 },
        { time: "10:00 - 10:30", available: 5 },
        { time: "11:00 - 11:30", available: 2 },
      ],
    };
    setAvailableSlots(mockData[facilityId] || []);
  };

  useEffect(() => {
    if (selectedFacility) {
      fetchAvailability(selectedFacility);
    }
  }, [selectedFacility]);

  const handleBooking = () => {
    if (selectedSlot) {
      setBookingConfirmed(true);
    }
  };

  if (bookingConfirmed) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>🎉 Booking Confirmed!</h2>
        <p>
          <strong>Facility:</strong>{" "}
          {facilities.find((f) => f.id === selectedFacility)?.name}
        </p>
        <p>
          <strong>Date:</strong> {selectedDate}
        </p>
        <p>
          <strong>Time Slot:</strong> {selectedSlot}
        </p>
        {selectedFacility !== "doctor" && (
          <p>
            <strong>Participants:</strong> {participants}
          </p>
        )}
        {selectedFacility === "doctor" && (
          <p>
            <strong>Symptoms:</strong> {symptoms}
          </p>
        )}
        <button onClick={() => setBookingConfirmed(false)}>Book Another</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Sports & Medical Booking System</h1>
      <label>
        <strong>Select Date:</strong>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          display: "inline-block",
          background: selectedFacility === "doctor" ? "#fff9c4" : "#f9f9f9",
        }}
      >
        <h2>Book Your Session</h2>
        <p>{selectedDate}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {facilities.map((facility) => (
            <button
              key={facility.id}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                background: selectedFacility === facility.id ? "#ddd" : "white",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedFacility(facility.id);
                setBookingType(facility.id);
              }}
            >
              <strong>{facility.name}</strong>
              <br /> Max Capacity: {facility.maxCapacity}
            </button>
          ))}
        </div>
        {selectedFacility && (
          <div>
            {availableSlots.map((slot) => (
              <button
                key={slot.time}
                disabled={slot.available === 0}
                style={{
                  margin: "5px",
                  padding: "10px",
                  background:
                    selectedSlot === slot.time
                      ? "#4CAF50"
                      : slot.available === 0
                      ? "#ccc"
                      : "#fff",
                  border: "1px solid #000",
                  cursor: slot.available === 0 ? "not-allowed" : "pointer",
                  color: selectedSlot === slot.time ? "white" : "black",
                }}
                onClick={() => setSelectedSlot(slot.time)}
              >
                {slot.time} -{" "}
                {slot.available > 0
                  ? `${slot.available} seats left`
                  : "Fully booked"}
              </button>
            ))}
            {selectedFacility !== "doctor" && (
              <div style={{ marginTop: "20px" }}>
                <label>Number of Participants</label>
                <input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  min="1"
                  style={{ marginLeft: "10px", width: "50px" }}
                />
              </div>
            )}
            {selectedFacility === "doctor" && (
              <div style={{ marginTop: "20px" }}>
                <label>Describe Symptoms</label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Enter symptoms"
                  style={{ marginLeft: "10px", width: "200px" }}
                />
              </div>
            )}
            <button
              onClick={handleBooking}
              disabled={!selectedSlot}
              style={{
                marginTop: "20px",
                padding: "10px",
                background: selectedSlot ? "#2962ff" : "#888",
                color: "white",
                border: "none",
                cursor: selectedSlot ? "pointer" : "not-allowed",
              }}
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;

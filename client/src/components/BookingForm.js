import React, { useState } from "react";
import styles from "./BookingForm.module.css";

const BookingForm = ({
  availableSlots = [],
  selectedDate,
  onBookingSubmit,
}) => {
  const [bookingType, setBookingType] = useState("facility");
  const [studentsCount, setStudentsCount] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const facilities = [
    { id: "pool", name: "Swimming Pool", maxCapacity: 30 },
    { id: "cricket", name: "Cricket Ground", maxCapacity: 40 },
    { id: "doctor", name: "Doctor Appointment", maxCapacity: 50 },
  ];

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

  if (submittedData) {
    return (
      <div className={styles.confirmationOverlay}>
        <div className={styles.confirmationBox}>
          <h2>🎉 Booking Confirmed!</h2>

          <div className={styles.confirmationDetails}>
            <div className={styles.detailRow}>
              <span>Service Type:</span>
              <strong>
                {submittedData.bookingType === "doctor"
                  ? "Medical Appointment"
                  : submittedData.bookingType === "pool"
                  ? "Swimming Pool Access"
                  : "Cricket Ground Booking"}
              </strong>
            </div>

            <div className={styles.detailRow}>
              <span>Date:</span>
              <strong>
                {new Date(submittedData.date).toLocaleDateString()}
              </strong>
            </div>

            <div className={styles.detailRow}>
              <span>Time Slot:</span>
              <strong>{submittedData.timeSlot}</strong>
            </div>

            {submittedData.bookingType === "doctor" ? (
              <div className={styles.detailRow}>
                <span>Symptoms:</span>
                <strong>{submittedData.symptoms}</strong>
              </div>
            ) : (
              <div className={styles.detailRow}>
                <span>Participants:</span>
                <strong>{submittedData.studentsCount}</strong>
              </div>
            )}
          </div>

          <button
            className={styles.newBookingButton}
            onClick={() => setSubmittedData(null)}
          >
            Create New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Book Your Session</h1>
        <p className={styles.selectedDate}>{selectedDate}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        {/* Facility Selection */}
        <div className={styles.facilitySelection}>
          {facilities.map((facility) => (
            <label
              key={facility.id}
              className={`${styles.facilityCard} ${
                bookingType === facility.id ? styles.selectedFacility : ""
              }`}
            >
              <input
                type="radio"
                name="facility"
                value={facility.id}
                checked={bookingType === facility.id}
                onChange={() => setBookingType(facility.id)}
              />
              <div className={styles.facilityContent}>
                <h3>{facility.name}</h3>
                <p>Max Capacity: {facility.maxCapacity}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Time Slots */}
        <div className={styles.slotsGrid}>
          {availableSlots.map((slot) => {
            const isAvailable =
              slot.available >= (bookingType === "doctor" ? 1 : studentsCount);

            return (
              <button
                key={slot.time}
                type="button"
                className={`${styles.slotButton} ${
                  selectedSlot === slot.time ? styles.selectedSlot : ""
                } ${!isAvailable ? styles.disabledSlot : ""}`}
                onClick={() => isAvailable && setSelectedSlot(slot.time)}
                disabled={!isAvailable}
              >
                <span className={styles.slotTime}>{slot.time}</span>
                <span className={styles.slotAvailability}>
                  {isAvailable
                    ? `${slot.available} ${
                        bookingType === "doctor" ? "slots" : "seats"
                      } left`
                    : "Fully booked"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Fields */}
        <div className={styles.formSection}>
          {bookingType === "doctor" ? (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Symptoms Description
                <textarea
                  className={styles.symptomsInput}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  required
                  rows="4"
                />
              </label>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Number of Participants
                <input
                  type="number"
                  className={styles.participantInput}
                  value={studentsCount}
                  onChange={(e) =>
                    setStudentsCount(Math.max(1, e.target.value))
                  }
                  min="1"
                  max={
                    facilities.find((f) => f.id === bookingType)?.maxCapacity
                  }
                  required
                />
              </label>
            </div>
          )}
        </div>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={!selectedSlot}
        >
          {selectedSlot ? "Confirm Booking" : "Select Time Slot"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

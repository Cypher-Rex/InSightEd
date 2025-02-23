// BookingsPage.js (Parent Component)
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookingForm from "./BookingForm";

const BookingsPage = () => {
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch availability from API
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("/api/availability", {
          params: { date: selectedDate },
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate]);

  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    try {
      // Add facility type to API payload
      const payload = {
        ...bookingData,
        facilityType: bookingData.bookingType,
        date: selectedDate,
      };

      await axios.post("/api/bookings", payload);

      // Keep your existing success handling
      console.log("Booking confirmed:", bookingData);
    } catch (error) {
      console.error("Booking failed:", error.response?.data);
      alert(
        `Booking failed: ${error.response?.data.message || "Server error"}`
      );
    }
  };

  if (loading) return <div>Loading availability...</div>;

  return (
    <div className="bookings-page">
      <BookingForm
        availableSlots={availableSlots}
        selectedDate={selectedDate}
        onBookingSubmit={handleBookingSubmit}
      />
    </div>
  );
};

export default BookingsPage;

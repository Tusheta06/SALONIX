import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    salon: null,
    service: null,
    staff: null,
    date: new Date().toISOString().split('T')[0],
    timeSlot: null,
    notes: '',
  });

  const resetBooking = () => {
    setBookingData({
      salon: null,
      service: null,
      staff: null,
      date: new Date().toISOString().split('T')[0],
      timeSlot: null,
      notes: '',
    });
  };

  const updateBooking = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);

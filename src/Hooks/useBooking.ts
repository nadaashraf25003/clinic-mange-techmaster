import { useState } from 'react';
import { AppointmentBookingRequest, BookingResponse } from '../utils/types';
import { clinicService } from '../API/clinicService';

export const useBooking = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const bookAppointment = async (data: AppointmentBookingRequest): Promise<boolean> => {
    try {
      setSubmitting(true);
      setBookingError(null);
      const res = await clinicService.submitAppointment(data);
      setBookingResult(res);
      return res.success;
    } catch (err: any) {
      setBookingError(err.message || 'حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBookingResult(null);
    setBookingError(null);
  };

  return {
    bookAppointment,
    submitting,
    bookingResult,
    bookingError,
    resetBooking,
  };
};

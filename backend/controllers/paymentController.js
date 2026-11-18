import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        message: "Doctor, date and time are required.",
      });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    const amount = doctor.consultationFee;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      success: true,
      order,
      doctorName: doctor.name,
      consultationFee: amount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create payment order.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      doctorId,
      date,
      time,
      reason,
    } = req.body;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // Find doctor
    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    // Find selected slot
    const slot = doctor.availability.find((slot) => {
  return (
    new Date(slot.date).toISOString().split("T")[0] === date &&
    slot.time === time &&
    slot.bookedCount < slot.maxAppointments
  );
});

    if (!slot) {
      return res.status(400).json({
        message: "Selected slot is no longer available.",
      });
    }

    const existingAppointment = await Appointment.findOne({
  patient: req.user._id,
  doctor: doctorId,
  date,
  time,
});

if (existingAppointment) {
  return res.status(400).json({
    message: "You have already booked this appointment.",
  });
}

    // Increase booked count
    slot.bookedCount += 1;

    await doctor.save();

    // Create Appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,

      status: "confirmed",

      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: doctor.consultationFee,
        status: "paid",
      },
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      appointment,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
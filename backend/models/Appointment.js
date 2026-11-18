import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },

    time: {
      type: String,
      required: [true, "Appointment time is required"],
    },

    reason: {
      type: String,
      trim: true,
    },

    responseMessage: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "declined",
        "completed",
        "cancelled",
      ],
      default: "confirmed",
    },

    payment: {
      orderId: {
        type: String,
      },

      paymentId: {
        type: String,
      },

      amount: {
        type: Number,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
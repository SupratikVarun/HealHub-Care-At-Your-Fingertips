import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      default: 'patient',
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    city: String,
    specialization: String,
    experience: Number,
    clinic: String,
    licenseNumber: String,

availability: [
  {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    maxAppointments: {
      type: Number,
      default: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
  },
],
  },

{
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;

import User from '../models/User.js';

export const getDoctors = async (req, res) => {
  const { name, specialization, city } = req.query;
  const filter = { role: 'doctor' };

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (specialization) {
    filter.specialization = { $regex: specialization, $options: 'i' };
  }
  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }
const doctors = await User.find(filter).select(
  '-__v -createdAt -updatedAt'
);

const availableDoctors = doctors
  .map((doctor) => {
    const availableSlots = doctor.availability.filter(
      (slot) => slot.bookedCount < slot.maxAppointments
    );

    return {
      ...doctor.toObject(),
      availability: availableSlots,
    };
  })
  .filter((doctor) => doctor.availability.length > 0);

return res.json(availableDoctors);
};

export const getDoctorById = async (req, res) => {
  const doctor = await User.findById(req.params.id).select(
    "-password -__v"
  );

  if (!doctor || doctor.role !== "doctor") {
    return res.status(404).json({
      message: "Doctor not found",
    });
  }

  return res.json(doctor);
};

export const addAvailability = async (req, res) => {
 const { date, time, maxAppointments } = req.body;

if (!date || !time || !maxAppointments) {
  return res.status(400).json({ message: 'Date, time, and maximum appointments are required' });
}
  

  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can add availability' });
  }

  const doctor = await User.findById(req.user._id);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  const existingSlot = doctor.availability.find(
  (slot) => slot.date === date && slot.time === time
);

if (existingSlot) {
  return res.status(400).json({
    message: 'Availability already exists for this date and time',
  });
}

 doctor.availability.push({
  date,
  time,
  maxAppointments: Number(maxAppointments),
  bookedCount: 0,
});

  await doctor.save();

  return res.status(201).json({
    message: 'Availability added successfully',
    availability: doctor.availability,
  });
};

export const getDoctorAvailability = async (req, res) => {
  const doctor = await User.findById(req.params.id).select('availability');

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  return res.json(doctor.availability || []);
};
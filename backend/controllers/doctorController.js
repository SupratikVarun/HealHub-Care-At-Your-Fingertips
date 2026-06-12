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

  const doctors = await User.find(filter).select('-__v -createdAt -updatedAt');
  return res.json(doctors);
};

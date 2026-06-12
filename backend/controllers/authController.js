import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerPatient = async (req, res) => {
  const { name, phone, password, age, gender, city } = req.body;
  if (!name || !phone || !password || !age || !gender || !city) {
    return res.status(400).json({ message: 'All fields are required for patient registration' });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone number is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: 'patient',
    age,
    gender,
    city,
  });

  return res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

export const registerDoctor = async (req, res) => {
  const { name, phone, password, specialization, experience, clinic, licenseNumber, city } = req.body;
  if (!name || !phone || !password || !specialization || !experience || !clinic || !licenseNumber) {
    return res.status(400).json({ message: 'All doctor registration fields are required' });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone number is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: 'doctor',
    specialization,
    experience,
    clinic,
    licenseNumber,
    city,
  });

  return res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone number and password are required to login' });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ message: 'User not found. Please register first' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect phone or password' });
  }

  return res.json({
    token: generateToken(user._id),
    user,
  });
};

export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json(req.user);
};

import mongoose from 'mongoose';
import dns from 'node:dns';

const configureDnsServers = () => {
  const dnsServers = process.env.DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
    console.log(`MongoDB DNS servers: ${dnsServers.join(', ')}`);
  }
};

const connectDB = async () => {
  configureDnsServers();

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Error connecting to MongoDB: MONGO_URI is not set. Set it in Render environment variables or local .env.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

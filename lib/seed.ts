import dbConnect from './mongodb';
import { Student, Team } from './models';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firstNames = [
  'Rahul', 'Priya', 'Arjun', 'Sneha', 'Amit', 'Anjali', 'Vikram', 'Neha', 'Rohan', 'Shreya',
  'Aditya', 'Tanvi', 'Abhishek', 'Riya', 'Siddharth', 'Divya', 'Karan', 'Isha', 'Varun', 'Kriti',
  'Manish', 'Pooja', 'Sanjay', 'Deepa', 'Rajesh', 'Sunita', 'Anil', 'Kiran', 'Vijay', 'Jyoti',
  'Harish', 'Lata', 'Ramesh', 'Asha', 'Suresh', 'Geeta'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Reddy', 'Kumar', 'Gupta', 'Joshi', 'Nair', 'Das', 'Sen',
  'Mehta', 'Verma', 'Rao', 'Iyer', 'Pillai', 'Choudhury', 'Bose', 'Mishra', 'Pandey', 'Saxena',
  'Deshmukh', 'Kulkarni', 'Bhat', 'Shetty', 'Menon', 'Som', 'Dutta', 'Roy',
  'Mukherjee', 'Chatterjee', 'Banerjee', 'Ghosh'
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected.');

    // Clear existing students and teams to start fresh (or just students as per user choice, but clearing both ensures consistent state)
    console.log('Clearing existing students and teams collections...');
    await Student.deleteMany({});
    await Team.deleteMany({});

    console.log('Generating seed data...');
    const studentsData = [];
    for (let i = 1; i <= 72; i++) {
      const roll = `22CS${String(i).padStart(3, '0')}`;
      const firstName = firstNames[(i - 1) % firstNames.length];
      const lastName = lastNames[(i - 1) % lastNames.length];
      const cluster = ((i - 1) % 3) + 1; // 1, 2, 3
      studentsData.push({
        roll,
        name: `${firstName} ${lastName}`,
        cluster,
      });
    }

    console.log(`Inserting ${studentsData.length} students...`);
    await Student.insertMany(studentsData);
    console.log('Database seeding complete successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

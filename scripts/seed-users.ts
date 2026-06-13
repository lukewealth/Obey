import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import firebaseConfig from '../firebase-applet-config.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5001/api';

const users = [
  {
    email: 'lukeokagha@gmail.com',
    password: 'DancwithMe123!',
    role: 'user',
    profile: {
      name: 'Luke Okagha',
      phone: '+234 809 000 0001',
      avatar: 'LO',
      kycStatus: 'Verified',
      balance: 1000000.00,
      promoCode: 'FOUNDER',
      twoFactorEnabled: true
    }
  },
  {
    email: 'contact@tricode.pro',
    password: 'Grace&Money$0007',
    role: 'admin',
    profile: {
      name: 'Tricode Admin',
      phone: '+234 809 000 0002',
      avatar: 'TA',
      kycStatus: 'Verified',
      balance: 999999999.99,
      promoCode: 'ADMIN-ACCESS',
      twoFactorEnabled: true
    }
  }
];

async function seed() {
  console.log('🚀 Starting Full-Stack User Seeding...');

  for (const user of users) {
    try {
      console.log(`\n👤 Processing ${user.email}...`);
      
      let firebaseUser;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        firebaseUser = userCredential.user;
        console.log(`✅ Created Firebase user: ${firebaseUser.uid}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
          firebaseUser = userCredential.user;
          console.log(`ℹ️ User already exists, signed in: ${firebaseUser.uid}`);
        } else {
          throw error;
        }
      }

      // Sync with MongoDB
      try {
        await axios.post(`${API_BASE_URL}/sync/user`, {
          supabaseId: firebaseUser.uid, // Using firebase UID for cross-platform compatibility
          ...user.profile,
          email: user.email,
          role: user.role
        });
        console.log(`✅ Synced ${user.email} with MongoDB`);
      } catch (error: any) {
        console.warn(`⚠️ MongoDB Sync Failed for ${user.email}:`, error.message);
      }

    } catch (error: any) {
      console.error(`❌ Failed to process ${user.email}:`, error.message);
    }
  }

  console.log('\n✨ Seeding Complete!');
  process.exit(0);
}

seed();

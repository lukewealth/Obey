import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5001/api';

const users = [
  {
    email: 'lukeokagha@gmail.com',
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
  console.log('🚀 Starting MongoDB User Seeding...');

  for (const user of users) {
    try {
      console.log(`\n👤 Processing ${user.email}...`);
      
      // Sync with MongoDB
      // Note: We use a dummy ID if we don't have the Supabase ID yet.
      // The frontend will update this with the real ID upon first login.
      try {
        await axios.post(`${API_BASE_URL}/sync/user`, {
          supabaseId: `pending_${user.email}`,
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

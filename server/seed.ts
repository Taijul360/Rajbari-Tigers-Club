import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { 
  Settings, Role, User, Tournament, Project, Notice, BloodDonor 
} from './models/index.js';
import { PERMISSIONS } from '../src/shared/permissions.js';

dotenv.config();

const SEED_SUPER_ADMIN_PHONE = process.env.SEED_SUPER_ADMIN_PHONE || '+8801700000000';
const SEED_SUPER_ADMIN_PASSWORD = process.env.SEED_SUPER_ADMIN_PASSWORD || 'secret123';

const runSeed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("🌱 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 1. Settings
    console.log("⚙️ Seeding Settings...");
    await Settings.findOneAndUpdate({}, {
      siteName: { bn: "রাজবাড়ি টাইগার্স ক্লাব", en: "Rajbari Tigers Club" },
      tagline: { bn: "ক্রীড়া ও সামাজিক উন্নয়ন", en: "Sports & Social Development" },
      theme: {
        navy: "#0A2148",
        royal: "#1656B8",
        orange: "#F5821F",
        gold: "#FFC233",
        bone: "#F7F4EF",
        ink: "#101418",
        radiusScale: "6px"
      },
      fonts: {
        displayBn: "Baloo Da 2",
        displayEn: "Archivo Expanded",
        body: "Hind Siliguri"
      },
      contact: {
        phone: "+8801700000000",
        email: "contact@rajbaritigers.com",
        address: { bn: "রাজবাড়ি", en: "Rajbari" }
      },
      defaultLanguage: "bn",
      memberCodePrefix: "RTC",
      monthlyDueAmount: 200,
      dueDayOfMonth: 10,
      establishedYear: "2018"
    }, { upsert: true, new: true });

    // 2. Roles
    console.log("🛡️ Seeding Roles...");
    const roles = [
      {
        key: 'super_admin',
        label: { bn: 'সুপার অ্যাডমিন', en: 'Super Admin' },
        rank: 100,
        permissions: ['*'],
        responsibilities: { bn: ['সর্বোচ্চ ক্ষমতা'], en: ['Root authority'] },
        isSystem: true
      },
      {
        key: 'admin',
        label: { bn: 'অ্যাডমিন', en: 'Admin' },
        rank: 90,
        permissions: Object.values(PERMISSIONS).filter(p => !p.startsWith('system.')),
        responsibilities: { bn: ['দৈনন্দিন কার্যক্রম পরিচালনা'], en: ['Daily operations'] },
        isSystem: true
      },
      {
        key: 'president',
        label: { bn: 'সভাপতি', en: 'President' },
        rank: 80,
        permissions: [PERMISSIONS.NOTICES_PUBLISH, PERMISSIONS.APPROVALS_FINAL],
        responsibilities: { bn: ['তত্ত্বাবধান ও অনুমোদন'], en: ['Oversight and approvals'] }
      },
      {
        key: 'treasurer',
        label: { bn: 'কোষাধ্যক্ষ', en: 'Treasurer' },
        rank: 65,
        permissions: [
          PERMISSIONS.FINANCE_SUMMARY_VIEW, PERMISSIONS.FINANCE_LEDGER_VIEW,
          PERMISSIONS.FINANCE_DEPOSIT_CREATE, PERMISSIONS.FINANCE_EXPENSE_CREATE,
          PERMISSIONS.FINANCE_DUES_MANAGE
        ],
        responsibilities: { bn: ['হিসাব রক্ষণাবেক্ষণ'], en: ['Financial accounting'] }
      },
      {
        key: 'member',
        label: { bn: 'সদস্য', en: 'Member' },
        rank: 50,
        permissions: [],
        responsibilities: { bn: ['ক্লাবের সদস্য'], en: ['Club member'] }
      },
      {
        key: 'user',
        label: { bn: 'সাধারণ ইউজার', en: 'User' },
        rank: 20,
        permissions: [],
        responsibilities: { bn: ['নিবন্ধিত ব্যবহারকারী'], en: ['Registered user'] }
      }
    ];

    for (const roleData of roles) {
      await Role.findOneAndUpdate({ key: roleData.key }, roleData, { upsert: true });
    }

    // 3. Super Admin
    console.log("👑 Seeding Super Admin...");
    const passwordHash = await bcrypt.hash(SEED_SUPER_ADMIN_PASSWORD, 12);
    await User.findOneAndUpdate({ phone: SEED_SUPER_ADMIN_PHONE }, {
      name: { bn: "সুপার অ্যাডমিন", en: "Super Admin" },
      phone: SEED_SUPER_ADMIN_PHONE,
      passwordHash,
      roleKey: "super_admin",
      memberStatus: "active"
    }, { upsert: true });

    // 4. Sample Content
    console.log("📝 Seeding Sample Tournaments and Projects...");
    await Tournament.findOneAndUpdate({ "title.en": "Tigers Premier League" }, {
      title: { bn: "টাইগার্স প্রিমিয়ার লিগ", en: "Tigers Premier League" },
      sport: "football",
      status: "upcoming",
      isPublic: true
    }, { upsert: true });

    await Project.findOneAndUpdate({ "title.en": "Anti-Drug Campaign 2026" }, {
      title: { bn: "মাদকমুক্ত সমাজ গড়ি", en: "Anti-Drug Campaign 2026" },
      category: "anti_drug",
      status: "ongoing",
      progressPercent: 30,
      isPublic: true
    }, { upsert: true });

    await BloodDonor.findOneAndUpdate({ phone: "01800000000" }, {
      name: "রাহিম আহমেদ",
      bloodGroup: "O+",
      phone: "01800000000",
      area: "রাজবাড়ি সদর",
      isAvailable: true,
      donationCount: 2
    }, { upsert: true });

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();

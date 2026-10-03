import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "./models/User";
import { Campaign } from "./models/Campaign";
import { Resource } from "./models/Resource";
import { LegalResource } from "./models/LegalResource";
import { EmergencyContact } from "./models/EmergencyContact";
import { SurveyQuestion } from "./models/SurveyQuestion";

import {
  demoCampaigns,
  demoEmergencyContacts,
  demoLegalResources,
  demoResources,
  demoSurveyQuestions,
} from "../src/lib/demoData";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/safeaware";

async function seed() {
  try {
    console.log(`Connecting to MongoDB for seeding: ${MONGODB_URI.replace(/:([^:@]{1,})@/, ":****@")}`);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // 1. Seed Admin User
    const adminEmail = "admin@safeaware.org";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await User.create({
        fullName: "SafeAware Administrator",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
      console.log("✓ Created default admin: admin@safeaware.org / admin123");
    } else {
      console.log("✓ Admin account already exists.");
    }

    // 2. Seed Campaigns
    for (const c of demoCampaigns) {
      await Campaign.findOneAndUpdate(
        { slug: c.slug },
        {
          title: c.title,
          slug: c.slug,
          description: c.description,
          category: c.category,
          coverImage: c.cover_image ?? null,
          topics: c.topics,
          startDate: new Date(c.start_date),
          endDate: new Date(c.end_date),
          status: c.status,
        },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${demoCampaigns.length} campaigns.`);

    // 3. Seed Resources
    for (const r of demoResources) {
      await Resource.findOneAndUpdate(
        { title: r.title },
        {
          title: r.title,
          summary: r.summary,
          content: r.content,
          category: r.category,
          sourceUrl: r.source_url ?? null,
          published: r.published,
        },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${demoResources.length} resources.`);

    // 4. Seed Legal Resources
    for (const l of demoLegalResources) {
      await LegalResource.findOneAndUpdate(
        { title: l.title },
        {
          title: l.title,
          topic: l.topic,
          summary: l.summary,
          generalInformation: l.general_information,
          officialSourceUrl: l.official_source_url ?? null,
          jurisdiction: l.jurisdiction,
          lastVerified: new Date(l.last_verified),
          published: l.published,
        },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${demoLegalResources.length} legal resources.`);

    // 5. Seed Emergency Contacts
    for (const e of demoEmergencyContacts) {
      await EmergencyContact.findOneAndUpdate(
        { name: e.name },
        {
          name: e.name,
          description: e.description,
          phone: e.phone,
          website: e.website ?? null,
          category: e.category,
          jurisdiction: e.jurisdiction,
          isActive: e.is_active,
        },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${demoEmergencyContacts.length} emergency contacts.`);

    // 6. Seed Survey Questions
    for (const q of demoSurveyQuestions) {
      await SurveyQuestion.findOneAndUpdate(
        { prompt: q.prompt },
        {
          prompt: q.prompt,
          questionType: q.question_type,
          isRequired: q.is_required,
          isActive: q.is_active,
          orderIndex: q.order_index,
          options: (q.options || []).map((opt) => ({
            id: opt.id,
            label: opt.label,
            orderIndex: opt.order_index,
          })),
        },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${demoSurveyQuestions.length} survey questions.`);

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();


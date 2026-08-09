import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// ============================================================
// PRISMA CLIENT SETUP (Prisma 7 + pg adapter)
// ============================================================

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================
// MAIN SEED FUNCTION
// Runs all construction-related seed data in safe relational order:
//   1. Districts
//   2. Specializations
//   3. Certifications
//   4. Companies
//   5. Company specializations
//   6. Company certifications
//   7. Company stories
//   8. Services
//   9. Brochures
//  10. Projects
//  11. Project images
//  12. Reviews
//  13. Contact information
//  14. Market insights
// ============================================================

async function main() {
  console.log('🌱 Starting Construction seed...\n');

  // ──────────────────────────────────────────────────────────
  // STEP 1 — DISTRICTS
  // ──────────────────────────────────────────────────────────

  console.log('📍 Seeding districts...');

  const districtColombo = await prisma.constructionDistrict.upsert({
    where: { name: 'Colombo' },
    update: {},
    create: { name: 'Colombo' },
  });

  const districtGalle = await prisma.constructionDistrict.upsert({
    where: { name: 'Galle' },
    update: {},
    create: { name: 'Galle' },
  });

  const districtKandy = await prisma.constructionDistrict.upsert({
    where: { name: 'Kandy' },
    update: {},
    create: { name: 'Kandy' },
  });

  console.log('  ✅ Districts created:', districtColombo.name, '|', districtGalle.name, '|', districtKandy.name);

  // ──────────────────────────────────────────────────────────
  // STEP 2 — SPECIALIZATIONS
  // ──────────────────────────────────────────────────────────

  console.log('\n🏗️  Seeding specializations...');

  const specializationData = [
    { name: 'Residential',       icon: '🏠' },
    { name: 'Commercial',        icon: '🏢' },
    { name: 'Luxury Villas',     icon: '🏰' },
    { name: 'Interior Design',   icon: '🛋️' },
    { name: 'Sustainable Design', icon: '🌿' },
    { name: 'Hospitality',       icon: '🏨' },
    { name: 'Renovations',       icon: '🔨' },
    { name: 'Smart Buildings',   icon: '📱' },
    { name: 'Green Buildings',   icon: '🌱' },
  ];

  const specializations: Record<string, { id: string; name: string }> = {};
  for (const spec of specializationData) {
    const s = await prisma.constructionSpecialization.upsert({
      where: { name: spec.name },
      update: { icon: spec.icon },
      create: { name: spec.name, icon: spec.icon },
    });
    specializations[s.name] = s;
  }
  console.log(`  ✅ ${Object.keys(specializations).length} specializations created`);

  // ──────────────────────────────────────────────────────────
  // STEP 3 — CERTIFICATIONS
  // ──────────────────────────────────────────────────────────

  console.log('\n🏆 Seeding certifications...');

  const certificationData = [
    { name: 'ISO 9001:2015',              icon: '🏅' },
    { name: 'Green Building Certified',   icon: '🌿' },
    { name: 'Construction Authority',     icon: '🏛️' },
    { name: 'Safety Gold Standard',       icon: '⭐' },
    { name: 'ICTAD Registered',           icon: '📋' },
  ];

  const certifications: Record<string, { id: string; name: string }> = {};
  for (const cert of certificationData) {
    const c = await prisma.constructionCertification.upsert({
      where: { name: cert.name },
      update: { icon: cert.icon },
      create: { name: cert.name, icon: cert.icon },
    });
    certifications[c.name] = c;
  }
  console.log(`  ✅ ${Object.keys(certifications).length} certifications created`);

  // ──────────────────────────────────────────────────────────
  // STEP 4 — COMPANIES
  // ──────────────────────────────────────────────────────────

  console.log('\n🏗️  Seeding companies...');

  // ─── Company 1: Heritage Construction ───

  const company1 = await prisma.constructionCompany.upsert({
    where: { id: 'construction-demo-001' },
    update: {
      name:             'Heritage Construction',
      slug:             'heritage-construction',
      tagline:          'Building Sri Lanka with premium quality and trusted craftsmanship.',
      logoUrl:          '/images/construction/heritage-logo.png',
      coverImageUrl:    '/images/construction/heritage-cover.jpg',
      districtId:       districtColombo.id,
      establishedYear:  2004,
      yearsInBusiness:  22,
      isVerified:       true,
      isFeatured:       true,
      status:           'active',
      ratingAvg:        4.9,
      reviewCount:      312,
      projectsCompleted: 512,
      teamSize:         85,
      avgProjectCost:   3500000,
      avgResponseTimeHours: 2,
      clientSatisfactionPct: 98,
      budgetMin:        3500000,
      budgetMax:        250000000,
    },
    create: {
      id:               'construction-demo-001',
      name:             'Heritage Construction',
      slug:             'heritage-construction',
      tagline:          'Building Sri Lanka with premium quality and trusted craftsmanship.',
      logoUrl:          '/images/construction/heritage-logo.png',
      coverImageUrl:    '/images/construction/heritage-cover.jpg',
      districtId:       districtColombo.id,
      establishedYear:  2004,
      yearsInBusiness:  22,
      isVerified:       true,
      isFeatured:       true,
      status:           'active',
      ratingAvg:        4.9,
      reviewCount:      312,
      projectsCompleted: 512,
      teamSize:         85,
      avgProjectCost:   3500000,
      avgResponseTimeHours: 2,
      clientSatisfactionPct: 98,
      budgetMin:        3500000,
      budgetMax:        250000000,
    },
  });

  // ─── Company 2: Colombo Elite Builders ───

  const company2 = await prisma.constructionCompany.upsert({
    where: { id: 'construction-demo-002' },
    update: {
      name:             'Colombo Elite Builders',
      slug:             'colombo-elite-builders',
      tagline:          'Elevating skylines with precision engineering and modern design.',
      logoUrl:          '/images/construction/elite-logo.png',
      coverImageUrl:    '/images/construction/elite-cover.jpg',
      districtId:       districtColombo.id,
      establishedYear:  2010,
      yearsInBusiness:  16,
      isVerified:       true,
      isFeatured:       true,
      status:           'active',
      ratingAvg:        4.7,
      reviewCount:      198,
      projectsCompleted: 287,
      teamSize:         62,
      avgProjectCost:   5200000,
      avgResponseTimeHours: 3,
      clientSatisfactionPct: 95,
      budgetMin:        5000000,
      budgetMax:        500000000,
    },
    create: {
      id:               'construction-demo-002',
      name:             'Colombo Elite Builders',
      slug:             'colombo-elite-builders',
      tagline:          'Elevating skylines with precision engineering and modern design.',
      logoUrl:          '/images/construction/elite-logo.png',
      coverImageUrl:    '/images/construction/elite-cover.jpg',
      districtId:       districtColombo.id,
      establishedYear:  2010,
      yearsInBusiness:  16,
      isVerified:       true,
      isFeatured:       true,
      status:           'active',
      ratingAvg:        4.7,
      reviewCount:      198,
      projectsCompleted: 287,
      teamSize:         62,
      avgProjectCost:   5200000,
      avgResponseTimeHours: 3,
      clientSatisfactionPct: 95,
      budgetMin:        5000000,
      budgetMax:        500000000,
    },
  });

  // ─── Company 3: Southern Coast Constructions ───

  const company3 = await prisma.constructionCompany.upsert({
    where: { id: 'construction-demo-003' },
    update: {
      name:             'Southern Coast Constructions',
      slug:             'southern-coast-constructions',
      tagline:          'Where the ocean meets architectural excellence.',
      logoUrl:          '/images/construction/southern-logo.png',
      coverImageUrl:    '/images/construction/southern-cover.jpg',
      districtId:       districtGalle.id,
      establishedYear:  2008,
      yearsInBusiness:  18,
      isVerified:       true,
      isFeatured:       false,
      status:           'active',
      ratingAvg:        4.8,
      reviewCount:      143,
      projectsCompleted: 195,
      teamSize:         45,
      avgProjectCost:   2800000,
      avgResponseTimeHours: 4,
      clientSatisfactionPct: 96,
      budgetMin:        2000000,
      budgetMax:        150000000,
    },
    create: {
      id:               'construction-demo-003',
      name:             'Southern Coast Constructions',
      slug:             'southern-coast-constructions',
      tagline:          'Where the ocean meets architectural excellence.',
      logoUrl:          '/images/construction/southern-logo.png',
      coverImageUrl:    '/images/construction/southern-cover.jpg',
      districtId:       districtGalle.id,
      establishedYear:  2008,
      yearsInBusiness:  18,
      isVerified:       true,
      isFeatured:       false,
      status:           'active',
      ratingAvg:        4.8,
      reviewCount:      143,
      projectsCompleted: 195,
      teamSize:         45,
      avgProjectCost:   2800000,
      avgResponseTimeHours: 4,
      clientSatisfactionPct: 96,
      budgetMin:        2000000,
      budgetMax:        150000000,
    },
  });

  console.log('  ✅ Companies created:', company1.name, '|', company2.name, '|', company3.name);

  // ──────────────────────────────────────────────────────────
  // STEP 5 — COMPANY SPECIALIZATIONS
  // ──────────────────────────────────────────────────────────

  console.log('\n🔗 Seeding company specializations...');

  const companySpecializations: Array<{ companyId: string; specializationId: string }> = [
    // Heritage Construction
    { companyId: company1.id, specializationId: specializations['Residential'].id },
    { companyId: company1.id, specializationId: specializations['Commercial'].id },
    { companyId: company1.id, specializationId: specializations['Luxury Villas'].id },
    { companyId: company1.id, specializationId: specializations['Hospitality'].id },
    { companyId: company1.id, specializationId: specializations['Renovations'].id },
    // Colombo Elite Builders
    { companyId: company2.id, specializationId: specializations['Commercial'].id },
    { companyId: company2.id, specializationId: specializations['Smart Buildings'].id },
    { companyId: company2.id, specializationId: specializations['Green Buildings'].id },
    { companyId: company2.id, specializationId: specializations['Sustainable Design'].id },
    // Southern Coast Constructions
    { companyId: company3.id, specializationId: specializations['Residential'].id },
    { companyId: company3.id, specializationId: specializations['Luxury Villas'].id },
    { companyId: company3.id, specializationId: specializations['Interior Design'].id },
    { companyId: company3.id, specializationId: specializations['Sustainable Design'].id },
  ];

  for (const cs of companySpecializations) {
    await prisma.constructionCompanySpecialization.upsert({
      where: { companyId_specializationId: { companyId: cs.companyId, specializationId: cs.specializationId } },
      update: {},
      create: cs,
    });
  }
  console.log(`  ✅ ${companySpecializations.length} company-specialization links created`);

  // ──────────────────────────────────────────────────────────
  // STEP 6 — COMPANY CERTIFICATIONS
  // ──────────────────────────────────────────────────────────

  console.log('\n🏅 Seeding company certifications...');

  const companyCertifications = [
    // Heritage
    { companyId: company1.id, certificationId: certifications['ISO 9001:2015'].id,            issuedDate: new Date('2020-01-01'), isVerified: true  },
    { companyId: company1.id, certificationId: certifications['Construction Authority'].id,    issuedDate: new Date('2018-06-15'), isVerified: true  },
    { companyId: company1.id, certificationId: certifications['Safety Gold Standard'].id,      issuedDate: new Date('2022-03-10'), isVerified: true  },
    // Elite
    { companyId: company2.id, certificationId: certifications['ISO 9001:2015'].id,            issuedDate: new Date('2021-04-01'), isVerified: true  },
    { companyId: company2.id, certificationId: certifications['Green Building Certified'].id, issuedDate: new Date('2023-08-20'), isVerified: true  },
    { companyId: company2.id, certificationId: certifications['ICTAD Registered'].id,         issuedDate: new Date('2019-11-05'), isVerified: true  },
    // Southern
    { companyId: company3.id, certificationId: certifications['Construction Authority'].id,    issuedDate: new Date('2017-09-01'), isVerified: true  },
    { companyId: company3.id, certificationId: certifications['Green Building Certified'].id, issuedDate: new Date('2024-02-14'), isVerified: true  },
  ];

  for (const cc of companyCertifications) {
    await prisma.constructionCompanyCertification.upsert({
      where: { companyId_certificationId: { companyId: cc.companyId, certificationId: cc.certificationId } },
      update: { issuedDate: cc.issuedDate, isVerified: cc.isVerified },
      create: cc,
    });
  }
  console.log(`  ✅ ${companyCertifications.length} company-certification links created`);

  // ──────────────────────────────────────────────────────────
  // STEP 7 — COMPANY STORIES
  // ──────────────────────────────────────────────────────────

  console.log('\n📖 Seeding company stories...');

  await prisma.constructionCompanyStory.upsert({
    where: { companyId: company1.id },
    update: {
      ourStory:   'Founded in 2004, Heritage Construction has grown from a small residential builder in Colombo to one of Sri Lanka\'s most trusted full-service construction companies. Over two decades, we have delivered over 512 projects spanning residential, commercial, and hospitality sectors — each built with the same commitment to quality that our founders instilled on day one.',
      mission:    'To deliver exceptional construction services through integrity, innovation, and craftsmanship, ensuring every project becomes a landmark of quality.',
      vision:     'To become the most trusted construction partner in Sri Lanka, transforming communities through world-class infrastructure and sustainable building practices.',
      coreValues: 'Integrity, Excellence, Innovation, Sustainability, Customer Focus',
    },
    create: {
      companyId:  company1.id,
      ourStory:   'Founded in 2004, Heritage Construction has grown from a small residential builder in Colombo to one of Sri Lanka\'s most trusted full-service construction companies. Over two decades, we have delivered over 512 projects spanning residential, commercial, and hospitality sectors — each built with the same commitment to quality that our founders instilled on day one.',
      mission:    'To deliver exceptional construction services through integrity, innovation, and craftsmanship, ensuring every project becomes a landmark of quality.',
      vision:     'To become the most trusted construction partner in Sri Lanka, transforming communities through world-class infrastructure and sustainable building practices.',
      coreValues: 'Integrity, Excellence, Innovation, Sustainability, Customer Focus',
    },
  });

  await prisma.constructionCompanyStory.upsert({
    where: { companyId: company2.id },
    update: {
      ourStory:   'Colombo Elite Builders was established in 2010 with a singular vision: to bring international-grade commercial construction to Sri Lanka. We specialise in smart, sustainable commercial developments and have been at the forefront of Colombo\'s skyline transformation over the past decade.',
      mission:    'To redefine Sri Lanka\'s commercial landscape through precision engineering, smart technology integration, and green building standards.',
      vision:     'To be Sri Lanka\'s leading commercial construction company, recognised internationally for engineering excellence and sustainable innovation.',
      coreValues: 'Precision, Innovation, Sustainability, Transparency, Excellence',
    },
    create: {
      companyId:  company2.id,
      ourStory:   'Colombo Elite Builders was established in 2010 with a singular vision: to bring international-grade commercial construction to Sri Lanka. We specialise in smart, sustainable commercial developments and have been at the forefront of Colombo\'s skyline transformation over the past decade.',
      mission:    'To redefine Sri Lanka\'s commercial landscape through precision engineering, smart technology integration, and green building standards.',
      vision:     'To be Sri Lanka\'s leading commercial construction company, recognised internationally for engineering excellence and sustainable innovation.',
      coreValues: 'Precision, Innovation, Sustainability, Transparency, Excellence',
    },
  });

  await prisma.constructionCompanyStory.upsert({
    where: { companyId: company3.id },
    update: {
      ourStory:   'Southern Coast Constructions was born from a deep love for the southern coastline of Sri Lanka. Since 2008, we have crafted luxury homes, boutique hotels, and eco-friendly residences that blend seamlessly with the natural beauty of the Galle and southern coastal districts.',
      mission:    'To create beautiful, sustainable structures along Sri Lanka\'s southern coast that respect the natural environment and enrich the communities we serve.',
      vision:     'To be the most respected construction company in Sri Lanka\'s southern province, known for coastal luxury, sustainable design, and community impact.',
      coreValues: 'Nature, Craftsmanship, Community, Sustainability, Beauty',
    },
    create: {
      companyId:  company3.id,
      ourStory:   'Southern Coast Constructions was born from a deep love for the southern coastline of Sri Lanka. Since 2008, we have crafted luxury homes, boutique hotels, and eco-friendly residences that blend seamlessly with the natural beauty of the Galle and southern coastal districts.',
      mission:    'To create beautiful, sustainable structures along Sri Lanka\'s southern coast that respect the natural environment and enrich the communities we serve.',
      vision:     'To be the most respected construction company in Sri Lanka\'s southern province, known for coastal luxury, sustainable design, and community impact.',
      coreValues: 'Nature, Craftsmanship, Community, Sustainability, Beauty',
    },
  });

  console.log('  ✅ 3 company stories created');

  // ──────────────────────────────────────────────────────────
  // STEP 8 — SERVICES
  // Use deleteMany (Construction-only) + createMany for idempotence on services
  // ──────────────────────────────────────────────────────────

  console.log('\n🛠️  Seeding services...');

  await prisma.constructionService.deleteMany({
    where: { companyId: { in: [company1.id, company2.id, company3.id] } },
  });

  await prisma.constructionService.createMany({
    data: [
      // Heritage
      { companyId: company1.id, title: 'Residential Construction',  description: 'Full-scale home and villa construction from foundation to finishing, tailored to each client\'s vision.',                displayOrder: 1, tags: ['Housing', 'Luxury', 'Available'] },
      { companyId: company1.id, title: 'Commercial Construction',   description: 'End-to-end commercial construction including office buildings, retail spaces, and mixed-use developments.',           displayOrder: 2, tags: ['Commercial', 'Available'] },
      { companyId: company1.id, title: 'Luxury Villas',             description: 'Bespoke luxury villa construction combining premium architectural design with the finest materials available.',          displayOrder: 3, tags: ['Luxury', 'Available'] },
      { companyId: company1.id, title: 'Hospitality Projects',      description: 'Hotels, resorts, and boutique properties built to international hospitality standards.',                               displayOrder: 4, tags: ['Hospitality', 'Available'] },
      { companyId: company1.id, title: 'Renovations & Extensions',  description: 'Professional renovation and extension services for existing residential and commercial properties.',                    displayOrder: 5, tags: ['Renovation', 'Available'] },
      // Elite
      { companyId: company2.id, title: 'High-Rise Commercial',      description: 'Precision engineering for multi-storey commercial buildings with integrated smart building systems.',                  displayOrder: 1, tags: ['Commercial', 'Smart', 'Available'] },
      { companyId: company2.id, title: 'Green Building Design',     description: 'Eco-certified construction delivering LEED-compliant, energy-efficient buildings that reduce operational costs.',       displayOrder: 2, tags: ['Green', 'Sustainable', 'Available'] },
      { companyId: company2.id, title: 'Smart Building Integration', description: 'IoT-enabled building automation systems for climate, security, lighting and energy management.',                     displayOrder: 3, tags: ['Smart', 'Technology', 'Available'] },
      { companyId: company2.id, title: 'Industrial Facilities',     description: 'Large-scale industrial and warehouse facilities built to international safety and operational standards.',              displayOrder: 4, tags: ['Industrial', 'Available'] },
      // Southern
      { companyId: company3.id, title: 'Coastal Residential',       description: 'Luxury coastal homes and villas designed to withstand the southern climate while maximising ocean views.',             displayOrder: 1, tags: ['Coastal', 'Luxury', 'Available'] },
      { companyId: company3.id, title: 'Boutique Hotel Construction', description: 'Intimate boutique hotels and eco-lodges that celebrate the natural beauty of the southern coast.',                  displayOrder: 2, tags: ['Hospitality', 'Boutique', 'Available'] },
      { companyId: company3.id, title: 'Interior Design & Fit-Out', description: 'Complete interior design and fit-out services that bring each space to life with curated local and international materials.', displayOrder: 3, tags: ['Interior', 'Design', 'Available'] },
      { companyId: company3.id, title: 'Eco-Friendly Construction', description: 'Environmentally conscious construction using sustainable materials and techniques that respect the coastal ecosystem.',  displayOrder: 4, tags: ['Eco', 'Sustainable', 'Available'] },
    ],
  });

  console.log('  ✅ Services created for all 3 companies');

  // ──────────────────────────────────────────────────────────
  // STEP 9 — BROCHURES
  // ──────────────────────────────────────────────────────────

  console.log('\n📄 Seeding brochures...');

  await prisma.constructionBrochure.deleteMany({
    where: { companyId: { in: [company1.id, company2.id, company3.id] } },
  });

  await prisma.constructionBrochure.createMany({
    data: [
      { companyId: company1.id, fileUrl: '/brochures/heritage-construction-2026.pdf' },
      { companyId: company1.id, fileUrl: '/brochures/heritage-portfolio-2025.pdf'     },
      { companyId: company2.id, fileUrl: '/brochures/colombo-elite-commercial.pdf'    },
      { companyId: company3.id, fileUrl: '/brochures/southern-coast-portfolio.pdf'    },
    ],
  });

  console.log('  ✅ Brochures created');

  // ──────────────────────────────────────────────────────────
  // STEP 10 — PROJECTS
  // ──────────────────────────────────────────────────────────

  console.log('\n🏛️  Seeding projects...');

  await prisma.constructionProject.deleteMany({
    where: { companyId: { in: [company1.id, company2.id, company3.id] } },
  });

  const projects = await prisma.constructionProject.createManyAndReturn({
    data: [
      // Heritage
      { companyId: company1.id, title: 'The Marina Two Garden',           location: 'Colombo 02',    completedYear: 2025, cost: 120000000, thumbnailUrl: '/images/projects/marina-two.jpg',          description: 'A premium twin-tower residential complex with landscaped garden terraces and direct marina views.',              displayOrder: 1 },
      { companyId: company1.id, title: 'Santa Ishara Boutique Hotel',     location: 'Kandy',         completedYear: 2024, cost: 95000000,  thumbnailUrl: '/images/projects/santa-ishara.jpg',         description: 'A 48-room boutique heritage hotel blending colonial architecture with modern comfort in the hill country.',     displayOrder: 2 },
      { companyId: company1.id, title: 'Rajagiriya Tech Park',            location: 'Rajagiriya',    completedYear: 2023, cost: 340000000, thumbnailUrl: '/images/projects/rajagiriya-tech.jpg',      description: 'A 12-storey mixed-use technology park with Grade A office space, retail podium, and rooftop amenities.',       displayOrder: 3 },
      { companyId: company1.id, title: 'Havelock Luxury Residences',      location: 'Colombo 05',    completedYear: 2022, cost: 180000000, thumbnailUrl: '/images/projects/havelock.jpg',             description: 'Exclusive high-end apartment residences with concierge services and resort-style amenities.',                   displayOrder: 4 },
      // Elite
      { companyId: company2.id, title: 'One Galle Face East Tower',       location: 'Colombo 01',    completedYear: 2025, cost: 875000000, thumbnailUrl: '/images/projects/one-galle.jpg',            description: 'A 38-storey smart commercial tower integrated with the One Galle Face mixed-use development.',                 displayOrder: 1 },
      { companyId: company2.id, title: 'Ports City Office Hub',           location: 'Colombo Port City', completedYear: 2024, cost: 620000000, thumbnailUrl: '/images/projects/ports-city.jpg',      description: 'State-of-the-art green-rated commercial office complex in the Colombo Port City development zone.',            displayOrder: 2 },
      { companyId: company2.id, title: 'Orion City Industrial Campus',    location: 'Ekala',         completedYear: 2023, cost: 210000000, thumbnailUrl: '/images/projects/orion-city.jpg',          description: 'Purpose-built industrial campus with automated warehousing, staff facilities, and renewable energy systems.',  displayOrder: 3 },
      // Southern
      { companyId: company3.id, title: 'Cape Weligama Ocean Villa',       location: 'Weligama',      completedYear: 2025, cost: 65000000,  thumbnailUrl: '/images/projects/cape-weligama.jpg',       description: 'A dramatic clifftop villa with infinity pool, open-plan living spaces, and panoramic ocean views.',            displayOrder: 1 },
      { companyId: company3.id, title: 'Galle Fort Boutique Hotel',       location: 'Galle Fort',    completedYear: 2024, cost: 82000000,  thumbnailUrl: '/images/projects/galle-fort-hotel.jpg',    description: 'A sensitively restored Dutch colonial property within the UNESCO-listed Galle Fort, now a luxury hotel.',      displayOrder: 2 },
      { companyId: company3.id, title: 'Tangalle Eco Beach Resort',       location: 'Tangalle',      completedYear: 2023, cost: 115000000, thumbnailUrl: '/images/projects/tangalle-resort.jpg',     description: 'A 24-villa eco-certified beach resort built with sustainable materials and a zero-waste operating model.',     displayOrder: 3 },
    ],
  });

  console.log(`  ✅ ${projects.length} projects created`);

  // ──────────────────────────────────────────────────────────
  // STEP 11 — PROJECT IMAGES
  // ──────────────────────────────────────────────────────────

  console.log('\n🖼️  Seeding project images...');

  // Map project titles to their created records
  const projectMap: Record<string, string> = {};
  for (const p of projects) {
    if (p.title) projectMap[p.title] = p.id;
  }

  await prisma.constructionProjectImage.deleteMany({
    where: { projectId: { in: Object.values(projectMap) } },
  });

  await prisma.constructionProjectImage.createMany({
    data: [
      // Marina Two Garden
      { projectId: projectMap['The Marina Two Garden'],        imageUrl: '/images/projects/marina-two-1.jpg',         sortOrder: 1 },
      { projectId: projectMap['The Marina Two Garden'],        imageUrl: '/images/projects/marina-two-2.jpg',         sortOrder: 2 },
      { projectId: projectMap['The Marina Two Garden'],        imageUrl: '/images/projects/marina-two-3.jpg',         sortOrder: 3 },
      // Santa Ishara
      { projectId: projectMap['Santa Ishara Boutique Hotel'],  imageUrl: '/images/projects/santa-ishara-1.jpg',       sortOrder: 1 },
      { projectId: projectMap['Santa Ishara Boutique Hotel'],  imageUrl: '/images/projects/santa-ishara-2.jpg',       sortOrder: 2 },
      // One Galle Face
      { projectId: projectMap['One Galle Face East Tower'],    imageUrl: '/images/projects/one-galle-1.jpg',          sortOrder: 1 },
      { projectId: projectMap['One Galle Face East Tower'],    imageUrl: '/images/projects/one-galle-2.jpg',          sortOrder: 2 },
      { projectId: projectMap['One Galle Face East Tower'],    imageUrl: '/images/projects/one-galle-3.jpg',          sortOrder: 3 },
      // Cape Weligama
      { projectId: projectMap['Cape Weligama Ocean Villa'],    imageUrl: '/images/projects/cape-weligama-1.jpg',      sortOrder: 1 },
      { projectId: projectMap['Cape Weligama Ocean Villa'],    imageUrl: '/images/projects/cape-weligama-2.jpg',      sortOrder: 2 },
      // Galle Fort
      { projectId: projectMap['Galle Fort Boutique Hotel'],    imageUrl: '/images/projects/galle-fort-1.jpg',         sortOrder: 1 },
      { projectId: projectMap['Galle Fort Boutique Hotel'],    imageUrl: '/images/projects/galle-fort-2.jpg',         sortOrder: 2 },
    ],
  });

  console.log('  ✅ Project images created');

  // ──────────────────────────────────────────────────────────
  // STEP 12 — REVIEWS
  // ──────────────────────────────────────────────────────────

  console.log('\n⭐ Seeding reviews...');

  await prisma.constructionReview.deleteMany({
    where: { companyId: { in: [company1.id, company2.id, company3.id] } },
  });

  await prisma.constructionReview.createMany({
    data: [
      // Heritage
      { companyId: company1.id, reviewerName: 'Anupam Wickramasinghe', reviewerRole: 'Homeowner',            ratingQuality: 5.0, ratingConstruction: 5.0, ratingTimeline: 4.0, ratingValue: 5.0, overallRating: 5.0, reviewText: 'Exceptional construction quality and professional communication throughout the project. The Heritage team turned our vision into reality beyond expectation.', reviewDate: new Date('2026-01-15') },
      { companyId: company1.id, reviewerName: 'Sarah Perera',          reviewerRole: 'CEO, Retail Ventures', ratingQuality: 5.0, ratingConstruction: 5.0, ratingTimeline: 5.0, ratingValue: 5.0, overallRating: 5.0, reviewText: 'Heritage delivered exactly what was promised on time and within budget. Their commercial construction expertise is unmatched in Colombo.',               reviewDate: new Date('2025-12-20') },
      { companyId: company1.id, reviewerName: 'Rohan Fernando',        reviewerRole: 'Property Developer',   ratingQuality: 5.0, ratingConstruction: 4.0, ratingTimeline: 5.0, ratingValue: 4.0, overallRating: 5.0, reviewText: 'Working with Heritage on our Havelock project was a seamless experience. The quality of finishing and attention to detail was outstanding.',              reviewDate: new Date('2025-10-08') },
      // Elite
      { companyId: company2.id, reviewerName: 'Dilshan Jayasuriya',    reviewerRole: 'COO, TechPark LK',     ratingQuality: 5.0, ratingConstruction: 5.0, ratingTimeline: 4.0, ratingValue: 5.0, overallRating: 5.0, reviewText: 'Colombo Elite\'s smart building integration for our office complex was world-class. The BMS and energy management systems work flawlessly.',           reviewDate: new Date('2026-02-10') },
      { companyId: company2.id, reviewerName: 'Priya Seneviratne',     reviewerRole: 'Sustainability Officer', ratingQuality: 5.0, ratingConstruction: 5.0, ratingTimeline: 5.0, ratingValue: 4.0, overallRating: 5.0, reviewText: 'Their green building approach is genuine. We achieved LEED Gold certification on our first submission, directly due to Elite\'s rigorous standards.',    reviewDate: new Date('2025-11-25') },
      // Southern
      { companyId: company3.id, reviewerName: 'James Robertson',       reviewerRole: 'Hotel Owner',           ratingQuality: 5.0, ratingConstruction: 5.0, ratingTimeline: 5.0, ratingValue: 5.0, overallRating: 5.0, reviewText: 'Southern Coast built our Galle Fort hotel with extraordinary sensitivity to the heritage environment. Our guests are consistently blown away.',          reviewDate: new Date('2026-01-30') },
      { companyId: company3.id, reviewerName: 'Natasha De Silva',      reviewerRole: 'Villa Owner',           ratingQuality: 5.0, ratingConstruction: 4.0, ratingTimeline: 5.0, ratingValue: 5.0, overallRating: 5.0, reviewText: 'Our ocean villa in Weligama is everything we dreamed of. The team\'s knowledge of coastal construction conditions and their craftsmanship is superb.',    reviewDate: new Date('2025-09-14') },
    ],
  });

  console.log('  ✅ Reviews created');

  // ──────────────────────────────────────────────────────────
  // STEP 13 — CONTACT INFORMATION
  // ──────────────────────────────────────────────────────────

  console.log('\n📞 Seeding contact information...');

  await prisma.constructionContactInfo.upsert({
    where: { companyId: company1.id },
    update: {
      phone:         '+94 11 456 7890',
      email:         'info@heritageconstructionlk.com',
      website:       'www.heritageconstructionlk.com',
      address:       '42 Galle Road, Colombo 03, Sri Lanka',
      latitude:      6.9271,
      longitude:     79.8612,
      hoursWeekday:  '8:00 AM – 6:00 PM',
      hoursSaturday: '9:00 AM – 2:00 PM',
      hoursSunday:   'Closed',
    },
    create: {
      companyId:     company1.id,
      phone:         '+94 11 456 7890',
      email:         'info@heritageconstructionlk.com',
      website:       'www.heritageconstructionlk.com',
      address:       '42 Galle Road, Colombo 03, Sri Lanka',
      latitude:      6.9271,
      longitude:     79.8612,
      hoursWeekday:  '8:00 AM – 6:00 PM',
      hoursSaturday: '9:00 AM – 2:00 PM',
      hoursSunday:   'Closed',
    },
  });

  await prisma.constructionContactInfo.upsert({
    where: { companyId: company2.id },
    update: {
      phone:         '+94 11 789 4560',
      email:         'info@colomboelitebuilders.lk',
      website:       'www.colomboelitebuilders.lk',
      address:       '15 Union Place, Colombo 02, Sri Lanka',
      latitude:      6.9147,
      longitude:     79.8698,
      hoursWeekday:  '8:30 AM – 5:30 PM',
      hoursSaturday: '9:00 AM – 1:00 PM',
      hoursSunday:   'Closed',
    },
    create: {
      companyId:     company2.id,
      phone:         '+94 11 789 4560',
      email:         'info@colomboelitebuilders.lk',
      website:       'www.colomboelitebuilders.lk',
      address:       '15 Union Place, Colombo 02, Sri Lanka',
      latitude:      6.9147,
      longitude:     79.8698,
      hoursWeekday:  '8:30 AM – 5:30 PM',
      hoursSaturday: '9:00 AM – 1:00 PM',
      hoursSunday:   'Closed',
    },
  });

  await prisma.constructionContactInfo.upsert({
    where: { companyId: company3.id },
    update: {
      phone:         '+94 91 223 5678',
      email:         'hello@southerncoastconstructions.lk',
      website:       'www.southerncoastconstructions.lk',
      address:       '7 Lighthouse Street, Galle Fort, Galle, Sri Lanka',
      latitude:      6.0251,
      longitude:     80.2170,
      hoursWeekday:  '8:00 AM – 5:00 PM',
      hoursSaturday: '9:00 AM – 12:00 PM',
      hoursSunday:   'Closed',
    },
    create: {
      companyId:     company3.id,
      phone:         '+94 91 223 5678',
      email:         'hello@southerncoastconstructions.lk',
      website:       'www.southerncoastconstructions.lk',
      address:       '7 Lighthouse Street, Galle Fort, Galle, Sri Lanka',
      latitude:      6.0251,
      longitude:     80.2170,
      hoursWeekday:  '8:00 AM – 5:00 PM',
      hoursSaturday: '9:00 AM – 12:00 PM',
      hoursSunday:   'Closed',
    },
  });

  console.log('  ✅ Contact information created');

  // ──────────────────────────────────────────────────────────
  // STEP 14 — MARKET INSIGHTS
  // ──────────────────────────────────────────────────────────

  console.log('\n📊 Seeding market insights...');

  // monthYear is DateTime? in the actual DB
  const marketInsights = [
    {
      districtId:             districtColombo.id,
      avgCostPerSqft:         14500,
      residentialCostPerSqft: 12000,
      commercialCostPerSqft:  18000,
      industrialCostPerSqft:  9500,
      luxuryCostPerSqft:      25000,
      monthYear:              new Date('2026-08-01'),
    },
    {
      districtId:             districtGalle.id,
      avgCostPerSqft:         10500,
      residentialCostPerSqft: 9000,
      commercialCostPerSqft:  13000,
      industrialCostPerSqft:  7500,
      luxuryCostPerSqft:      18000,
      monthYear:              new Date('2026-08-01'),
    },
    {
      districtId:             districtKandy.id,
      avgCostPerSqft:         9800,
      residentialCostPerSqft: 8500,
      commercialCostPerSqft:  12000,
      industrialCostPerSqft:  7000,
      luxuryCostPerSqft:      15000,
      monthYear:              new Date('2026-08-01'),
    },
  ];

  await prisma.constructionMarketInsight.deleteMany({
    where: { districtId: { in: [districtColombo.id, districtGalle.id, districtKandy.id] } },
  });

  await prisma.constructionMarketInsight.createMany({ data: marketInsights });

  console.log(`  ✅ ${marketInsights.length} market insights created`);

  console.log('\n🎉 Construction seed completed successfully!\n');
  console.log('📋 Summary:');
  console.log('   Companies      : 3 (Heritage, Colombo Elite, Southern Coast)');
  console.log('   Districts      : 3 (Colombo, Galle, Kandy)');
  console.log('   Specializations: 9');
  console.log('   Certifications : 5');
  console.log('   Projects       : 10');
  console.log('   Reviews        : 7');
  console.log('   Services       : 13');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
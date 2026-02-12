import 'dotenv/config';
import { db } from './index';
import { users, collections, bids, categories, collectionCategories, activityLogs } from './schema';
import bcryptjs from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Please set it in your .env file or environment variables');
  process.exit(1);
}

const SALT_ROUNDS = 12;

// Realistic collectible categories
const categoryData = [
  { name: 'Vintage Watches', slug: 'vintage-watches', description: 'Timeless timepieces from renowned brands' },
  { name: 'Fine Art', slug: 'fine-art', description: 'Paintings, sculptures, and mixed media' },
  { name: 'Antique Furniture', slug: 'antique-furniture', description: 'Classic pieces from different eras' },
  { name: 'Collectible Coins', slug: 'collectible-coins', description: 'Rare and historical currency' },
  { name: 'Vintage Jewelry', slug: 'vintage-jewelry', description: 'Estate and heirloom pieces' },
  { name: 'Sports Memorabilia', slug: 'sports-memorabilia', description: 'Autographed items and collectibles' },
  { name: 'Vintage Cameras', slug: 'vintage-cameras', description: 'Classic photography equipment' },
  { name: 'Mid-Century Modern', slug: 'mid-century-modern', description: 'Iconic design from the 50s-60s' },
  { name: 'Art Deco', slug: 'art-deco', description: 'Elegant 1920s-30s decorative arts' },
  { name: 'Rare Books', slug: 'rare-books', description: 'First editions and antiquarian books' },
  { name: 'Musical Instruments', slug: 'musical-instruments', description: 'Vintage guitars, pianos, and more' },
  { name: 'Luxury Handbags', slug: 'luxury-handbags', description: 'Designer bags and accessories' },
];

// Sample user data
const userData = [
  { email: 'admin@luxorbids.com', name: 'Admin User', bio: 'Platform administrator', location: 'New York, NY' },
  { email: 'sarah.mitchell@email.com', name: 'Sarah Mitchell', bio: 'Estate sale enthusiast and vintage watch collector', location: 'Los Angeles, CA' },
  { email: 'james.chen@email.com', name: 'James Chen', bio: 'Art dealer specializing in mid-century modern', location: 'San Francisco, CA' },
  { email: 'maria.rodriguez@email.com', name: 'Maria Rodriguez', bio: 'Jewelry designer and antique coin collector', location: 'Miami, FL' },
  { email: 'robert.williams@email.com', name: 'Robert Williams', bio: 'Photography historian and vintage camera expert', location: 'Chicago, IL' },
  { email: 'elizabeth.taylor@email.com', name: 'Elizabeth Taylor', bio: 'Fine art curator and rare book collector', location: 'Boston, MA' },
  { email: 'david.kim@email.com', name: 'David Kim', bio: 'Sports memorabilia dealer since 2005', location: 'Seattle, WA' },
  { email: 'emily.johnson@email.com', name: 'Emily Johnson', bio: 'Interior designer with a passion for antique furniture', location: 'Austin, TX' },
  { email: 'michael.brown@email.com', name: 'Michael Brown', bio: 'Professional auctioneer and watch enthusiast', location: 'Denver, CO' },
  { email: 'jennifer.davis@email.com', name: 'Jennifer Davis', bio: 'Luxury fashion reseller and handbag collector', location: 'Atlanta, GA' },
  { email: 'thomas.wilson@email.com', name: 'Thomas Wilson', bio: 'Vintage guitar collector and music lover', location: 'Nashville, TN' },
  { email: 'lisa.anderson@email.com', name: 'Lisa Anderson', bio: 'Art Deco specialist and interior architect', location: 'Philadelphia, PA' },
  { email: 'chris.martinez@email.com', name: 'Chris Martinez', bio: 'Numismatist and rare coin expert', location: 'Phoenix, AZ' },
  { email: 'amanda.white@email.com', name: 'Amanda White', bio: 'Estate liquidation specialist', location: 'Portland, OR' },
  { email: 'kevin.clark@email.com', name: 'Kevin Clark', bio: 'Vintage furniture restorer', location: 'Detroit, MI' },
];

// Collection templates for generating realistic items
const collectionTemplates = [
  // Watches
  { prefix: 'Rolex Submariner', category: 'vintage-watches', minPrice: 500000, maxPrice: 1500000 },
  { prefix: 'Omega Speedmaster', category: 'vintage-watches', minPrice: 250000, maxPrice: 800000 },
  { prefix: 'Patek Philippe Calatrava', category: 'vintage-watches', minPrice: 1500000, maxPrice: 5000000 },
  { prefix: 'Cartier Tank', category: 'vintage-watches', minPrice: 150000, maxPrice: 600000 },
  { prefix: 'Jaeger-LeCoultre Reverso', category: 'vintage-watches', minPrice: 200000, maxPrice: 700000 },
  { prefix: 'Tag Heuer Carrera', category: 'vintage-watches', minPrice: 180000, maxPrice: 450000 },
  
  // Art
  { prefix: 'Abstract Expressionist Painting', category: 'fine-art', minPrice: 200000, maxPrice: 2000000 },
  { prefix: 'Mid-Century Oil on Canvas', category: 'fine-art', minPrice: 50000, maxPrice: 300000 },
  { prefix: 'Bronze Sculpture', category: 'fine-art', minPrice: 100000, maxPrice: 800000 },
  { prefix: 'Contemporary Mixed Media', category: 'fine-art', minPrice: 30000, maxPrice: 250000 },
  { prefix: 'Vintage Landscape Painting', category: 'fine-art', minPrice: 25000, maxPrice: 150000 },
  { prefix: 'Modernist Portrait', category: 'fine-art', minPrice: 40000, maxPrice: 300000 },
  
  // Furniture
  { prefix: 'Eames Lounge Chair', category: 'antique-furniture', minPrice: 300000, maxPrice: 800000 },
  { prefix: 'Mid-Century Danish Teak Sideboard', category: 'mid-century-modern', minPrice: 80000, maxPrice: 250000 },
  { prefix: 'Herman Miller Noguchi Table', category: 'mid-century-modern', minPrice: 120000, maxPrice: 350000 },
  { prefix: 'Victorian Mahogany Secretary Desk', category: 'antique-furniture', minPrice: 150000, maxPrice: 400000 },
  { prefix: 'Art Deco Vanity Mirror', category: 'art-deco', minPrice: 40000, maxPrice: 120000 },
  { prefix: 'French Provincial Dining Set', category: 'antique-furniture', minPrice: 200000, maxPrice: 600000 },
  { prefix: 'Le Corbusier LC4 Chaise', category: 'mid-century-modern', minPrice: 180000, maxPrice: 450000 },
  { prefix: 'Stickley Mission Oak Cabinet', category: 'antique-furniture', minPrice: 120000, maxPrice: 350000 },
  
  // Coins
  { prefix: '1794 Flowing Hair Dollar', category: 'collectible-coins', minPrice: 5000000, maxPrice: 15000000 },
  { prefix: '1933 Double Eagle Gold Coin', category: 'collectible-coins', minPrice: 8000000, maxPrice: 25000000 },
  { prefix: '1804 Silver Dollar', category: 'collectible-coins', minPrice: 2000000, maxPrice: 8000000 },
  { prefix: 'Complete Morgan Dollar Set', category: 'collectible-coins', minPrice: 500000, maxPrice: 2000000 },
  { prefix: 'Ancient Roman Gold Aureus', category: 'collectible-coins', minPrice: 150000, maxPrice: 600000 },
  { prefix: '1916-D Mercury Dime', category: 'collectible-coins', minPrice: 50000, maxPrice: 200000 },
  
  // Jewelry
  { prefix: 'Art Deco Diamond Ring', category: 'vintage-jewelry', minPrice: 150000, maxPrice: 600000 },
  { prefix: 'Estate Emerald Necklace', category: 'vintage-jewelry', minPrice: 200000, maxPrice: 800000 },
  { prefix: 'Victorian Cameo Brooch', category: 'vintage-jewelry', minPrice: 25000, maxPrice: 80000 },
  { prefix: 'Sapphire and Diamond Earrings', category: 'vintage-jewelry', minPrice: 180000, maxPrice: 500000 },
  { prefix: 'Tiffany & Co. Gold Bracelet', category: 'vintage-jewelry', minPrice: 80000, maxPrice: 250000 },
  { prefix: 'Antique Pearl Necklace', category: 'vintage-jewelry', minPrice: 120000, maxPrice: 400000 },
  
  // Sports Memorabilia
  { prefix: 'Babe Ruth Signed Baseball', category: 'sports-memorabilia', minPrice: 300000, maxPrice: 1200000 },
  { prefix: 'Michael Jordan Rookie Card', category: 'sports-memorabilia', minPrice: 200000, maxPrice: 800000 },
  { prefix: 'Tom Brady Game-Worn Jersey', category: 'sports-memorabilia', minPrice: 150000, maxPrice: 500000 },
  { prefix: '1952 Mickey Mantle Card', category: 'sports-memorabilia', minPrice: 500000, maxPrice: 2000000 },
  { prefix: 'Muhammad Ali Signed Gloves', category: 'sports-memorabilia', minPrice: 80000, maxPrice: 300000 },
  
  // Cameras
  { prefix: 'Leica M3 Rangefinder', category: 'vintage-cameras', minPrice: 150000, maxPrice: 450000 },
  { prefix: 'Hasselblad 500C/M Medium Format', category: 'vintage-cameras', minPrice: 120000, maxPrice: 350000 },
  { prefix: 'Nikon F2 SLR', category: 'vintage-cameras', minPrice: 40000, maxPrice: 120000 },
  { prefix: 'Rolleiflex TLR', category: 'vintage-cameras', minPrice: 80000, maxPrice: 250000 },
  { prefix: 'Polaroid SX-70', category: 'vintage-cameras', minPrice: 25000, maxPrice: 80000 },
  { prefix: 'Canon AE-1 Program', category: 'vintage-cameras', minPrice: 20000, maxPrice: 60000 },
  
  // Books
  { prefix: 'First Edition Great Gatsby', category: 'rare-books', minPrice: 150000, maxPrice: 500000 },
  { prefix: 'Shakespeare First Folio', category: 'rare-books', minPrice: 2000000, maxPrice: 10000000 },
  { prefix: 'Signed First Edition Hemingway', category: 'rare-books', minPrice: 80000, maxPrice: 300000 },
  { prefix: 'Alice in Wonderland First Edition', category: 'rare-books', minPrice: 50000, maxPrice: 200000 },
  { prefix: 'Charles Darwin Origin of Species', category: 'rare-books', minPrice: 120000, maxPrice: 400000 },
  
  // Instruments
  { prefix: '1959 Gibson Les Paul Standard', category: 'musical-instruments', minPrice: 1500000, maxPrice: 5000000 },
  { prefix: 'Pre-War Martin D-28', category: 'musical-instruments', minPrice: 400000, maxPrice: 1200000 },
  { prefix: 'Fender Stratocaster 1954', category: 'musical-instruments', minPrice: 800000, maxPrice: 2500000 },
  { prefix: 'Steinway Model B Grand Piano', category: 'musical-instruments', minPrice: 500000, maxPrice: 1500000 },
  { prefix: 'Selmer Mark VI Saxophone', category: 'musical-instruments', minPrice: 80000, maxPrice: 250000 },
  { prefix: 'Vintage Ludwig Drum Kit', category: 'musical-instruments', minPrice: 60000, maxPrice: 200000 },
  
  // Handbags
  { prefix: 'Hermès Birkin 35', category: 'luxury-handbags', minPrice: 120000, maxPrice: 400000 },
  { prefix: 'Chanel Classic Flap Bag', category: 'luxury-handbags', minPrice: 60000, maxPrice: 180000 },
  { prefix: 'Louis Vuitton Capucines', category: 'luxury-handbags', minPrice: 50000, maxPrice: 150000 },
  { prefix: 'Vintage Gucci Bamboo Handle', category: 'luxury-handbags', minPrice: 30000, maxPrice: 90000 },
  { prefix: 'Prada Saffiano Tote', category: 'luxury-handbags', minPrice: 35000, maxPrice: 100000 },
];

// Description templates
const descriptionTemplates = [
  'A stunning {adjective} piece from the {era}. This {item} shows {condition} and has been {provenance}. Perfect for {use}.',
  'Exceptional {adjective} {item} dating back to {era}. Features {feature}. {condition} with {provenance}.',
  'Rare opportunity to own a {adjective} {item}. From the {era}, this piece {feature}. {condition}.',
  'Beautiful {adjective} {item} in {condition}. Dating to {era}, it comes {provenance}. {feature}.',
  'Magnificent {item} from {era}. This {adjective} example {feature}. {condition} and {provenance}.',
];

const adjectives = ['museum-quality', 'exquisite', 'rare', 'pristine', 'authenticated', 'stunning', 'remarkable', 'exceptional'];
const eras = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', 'early 20th century', 'mid-century', 'Victorian era', 'Art Deco period'];
const conditions = ['excellent original condition', 'minimal wear consistent with age', 'well-preserved patina', 'minimal signs of use', 'professionally restored', 'original finish intact'];
const provenance = ['from a prominent estate', 'with documented history', 'from a private collection', 'acquired from original owner', 'with certificate of authenticity'];
const features = ['intricate detailing', 'original hardware', 'handcrafted construction', 'signed by maker', 'period-appropriate materials', 'all original components'];
const uses = ['the serious collector', 'investment purposes', 'display in a curated home', 'adding to an established collection'];

// Image URLs from Unsplash for collectibles
const imageUrls = [
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
  'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
  'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
  'https://images.unsplash.com/photo-1616422323326-17b5e584d95b?w=800&q=80',
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&q=80',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(itemName: string): string {
  const template = randomElement(descriptionTemplates);
  return template
    .replace('{item}', itemName.toLowerCase())
    .replace('{adjective}', randomElement(adjectives))
    .replace('{era}', randomElement(eras))
    .replace('{condition}', randomElement(conditions))
    .replace('{provenance}', randomElement(provenance))
    .replace('{feature}', randomElement(features))
    .replace('{use}', randomElement(uses));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await db.delete(activityLogs);
    await db.delete(bids);
    await db.delete(collectionCategories);
    await db.delete(collections);
    await db.delete(categories);
    await db.delete(users);
    console.log('✓ Existing data cleared\n');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✓ Created ${createdCategories.length} categories\n`);

    // Create category lookup map
    const categoryMap = new Map(createdCategories.map(c => [c.slug, c.id]));

    // Create users with hashed passwords
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      userData.map(async (user) => ({
        ...user,
        passwordHash: await bcryptjs.hash('password123', SALT_ROUNDS),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      }))
    );
    const createdUsers = await db.insert(users).values(hashedUsers).returning();
    console.log(`✓ Created ${createdUsers.length} users\n`);

    // Create collections
    console.log('Creating collections...');
    const collectionsData = [];
    const collectionCategoriesData = [];
    
    for (let i = 0; i < 120; i++) {
      const template = randomElement(collectionTemplates);
      const variant = randomInt(1, 50);
      const name = `${template.prefix} ${variant}`;
      const slug = `${slugify(template.prefix)}-${variant}-${Date.now()}-${i}`;
      const owner = randomElement(createdUsers);
      const price = randomInt(template.minPrice, template.maxPrice);
      
      // 30% chance of having an end date (auction mode)
      const hasEndDate = Math.random() < 0.3;
      const endsAt = hasEndDate 
        ? new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000)
        : null;
      
      // 10% chance of being sold
      const status = Math.random() < 0.1 ? 'sold' : 'active';
      
      collectionsData.push({
        name,
        slug,
        description: generateDescription(name),
        imageUrl: randomElement(imageUrls),
        stock: randomInt(1, 5),
        startingPrice: price,
        ownerId: owner.id,
        status,
        endsAt,
      });
    }

    const createdCollections = await db.insert(collections).values(collectionsData).returning();
    console.log(`✓ Created ${createdCollections.length} collections\n`);

    // Assign categories to collections
    console.log('Assigning categories to collections...');
    for (const collection of createdCollections) {
      // Find the template that matches this collection
      const template = collectionTemplates.find(t => 
        collection.name.toLowerCase().startsWith(t.prefix.toLowerCase())
      );
      
      if (template) {
        const categoryId = categoryMap.get(template.category);
        if (categoryId) {
          collectionCategoriesData.push({
            collectionId: collection.id,
            categoryId,
          });
        }
      }
      
      // 20% chance of having a second category
      if (Math.random() < 0.2) {
        const randomCategory = randomElement(createdCategories);
        const exists = collectionCategoriesData.some(
          cc => cc.collectionId === collection.id && cc.categoryId === randomCategory.id
        );
        if (!exists) {
          collectionCategoriesData.push({
            collectionId: collection.id,
            categoryId: randomCategory.id,
          });
        }
      }
    }

    await db.insert(collectionCategories).values(collectionCategoriesData);
    console.log(`✓ Assigned ${collectionCategoriesData.length} category relationships\n`);

    // Create bids
    console.log('Creating bids...');
    const bidsData = [];
    const activityLogsData = [];
    
    // Only create bids on active or sold collections
    const biddableCollections = createdCollections.filter(c => c.status !== 'cancelled');
    
    for (const collection of biddableCollections) {
      // Generate 3-15 bids per collection
      const numBids = randomInt(3, 15);
      let currentPrice = collection.startingPrice;
      
      // Get potential bidders (everyone except the owner)
      const bidders = createdUsers.filter(u => u.id !== collection.ownerId);
      
      for (let i = 0; i < numBids; i++) {
        const bidder = randomElement(bidders);
        // Each bid is 2-10% higher than the previous
        const increment = Math.floor(currentPrice * randomInt(2, 10) / 100);
        currentPrice += Math.max(increment, 100); // Minimum $1 increment
        
        // Determine bid status based on collection status and position
        let status: 'pending' | 'accepted' | 'rejected' = 'pending';
        if (collection.status === 'sold') {
          // Last bid wins on sold items
          status = i === numBids - 1 ? 'accepted' : 'rejected';
        } else if (!collection.endsAt && Math.random() < 0.1) {
          // 10% chance of accepted/rejected on manual acceptance items
          status = Math.random() < 0.5 ? 'accepted' : 'rejected';
        }
        
        const bidTime = new Date(collection.createdAt.getTime() + randomInt(1, 48) * 60 * 60 * 1000);
        
        bidsData.push({
          collectionId: collection.id,
          userId: bidder.id,
          amount: currentPrice,
          status,
          createdAt: bidTime,
          updatedAt: bidTime,
        });
      }
    }

    const createdBids = await db.insert(bids).values(bidsData).returning();
    console.log(`✓ Created ${createdBids.length} bids\n`);

    // Create activity logs
    console.log('Creating activity logs...');
    
    // Log collection creations
    for (const collection of createdCollections) {
      activityLogsData.push({
        userId: collection.ownerId,
        type: 'collection_created',
        collectionId: collection.id,
        bidId: null,
        metadata: { price: collection.startingPrice },
        createdAt: collection.createdAt,
      });
    }

    // Log bids
    for (const bid of createdBids) {
      activityLogsData.push({
        userId: bid.userId,
        type: 'bid_placed',
        collectionId: bid.collectionId,
        bidId: bid.id,
        metadata: { amount: bid.amount },
        createdAt: bid.createdAt,
      });
      
      // Log accepted bids
      if (bid.status === 'accepted') {
        activityLogsData.push({
          userId: bid.userId,
          type: 'bid_accepted',
          collectionId: bid.collectionId,
          bidId: bid.id,
          metadata: { amount: bid.amount },
          createdAt: new Date(bid.createdAt.getTime() + 1000 * 60 * 60), // 1 hour later
        });
      }
    }

    await db.insert(activityLogs).values(activityLogsData);
    console.log(`✓ Created ${activityLogsData.length} activity logs\n`);

    // Print summary
    console.log('\n✅ Seed completed successfully!\n');
    console.log('Summary:');
    console.log(`  • Users: ${createdUsers.length}`);
    console.log(`  • Categories: ${createdCategories.length}`);
    console.log(`  • Collections: ${createdCollections.length}`);
    console.log(`  • Bids: ${createdBids.length}`);
    console.log(`  • Activity Logs: ${activityLogsData.length}`);
    console.log('\nAll passwords are: password123');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

seed().catch(console.error);

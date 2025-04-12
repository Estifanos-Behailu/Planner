import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const branches = [
    {
      name: 'Kuriftu Resort & Spa Bishoftu',
      location: 'Bishoftu, Ethiopia',
      description: 'A luxury resort on a crater lake offering nature, entertainment, and event services.',
      activities: [
        { name: 'Bird Watching', description: 'Observe native bird species around the crater lake.', category: 'Nature', duration: 60 },
        { name: 'Kayaking', description: 'Paddle across the serene lake in kayaks.', category: 'Water Sports', duration: 45 },
        { name: 'Waterpark Visit', description: 'Enjoy East Africa’s largest water park.', category: 'Family Entertainment', duration: 120 },
        { name: 'Circus Performances', description: 'Live performances at the on-site circus.', category: 'Entertainment', duration: 90 },
        { name: 'Birthday Parties', description: 'Event packages for birthdays with catering and activities.', category: 'Events', duration: 180 },
        { name: 'Pool Parties', description: 'Music, drinks, and swimming at The Village Pool & Bar.', category: 'Leisure', duration: 180 },
        { name: 'Nature-based Weddings', description: 'Outdoor weddings surrounded by nature.', category: 'Events', duration: 240 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa Lake Tana (Bahir Dar)',
      location: 'Bahir Dar, Ethiopia',
      description: 'Scenic resort on Lake Tana combining historical tours with relaxation.',
      activities: [
        { name: 'Boat Rides', description: 'Tours on Lake Tana with scenic and historic views.', category: 'Adventure', duration: 90 },
        { name: 'Monastery Visits', description: 'Cultural tours to ancient island monasteries.', category: 'Cultural', duration: 120 },
        { name: 'Bird Watching Tours', description: 'Explore local bird species around Lake Tana.', category: 'Nature', duration: 60 },
        { name: 'Wildlife Excursions', description: 'Guided exploration of the region’s flora and fauna.', category: 'Nature', duration: 90 },
        { name: 'Dining Experience', description: 'Meals by the lake with traditional and international cuisine.', category: 'Dining', duration: 60 },
        { name: 'Relaxation and Wellness', description: 'Spa treatments and wellness activities.', category: 'Wellness', duration: 60 },
        { name: 'Corporate Team Activities', description: 'Team-building programs for businesses.', category: 'Corporate', duration: 180 },
        { name: 'Event Hosting', description: 'Facilities for weddings, birthdays, and parties.', category: 'Events', duration: 240 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa Entoto',
      location: 'Entoto, Addis Ababa, Ethiopia',
      description: 'An adventure resort featuring thrill-based activities in the Entoto hills.',
      activities: [
        { name: 'Zipline', description: '500-meter zipline experience.', category: 'Adventure', duration: 30 },
        { name: 'Aerial Rope Course', description: '400m course 5m above ground with 26 elements.', category: 'Adventure', duration: 45 },
        { name: 'Go Kart Racing', description: 'Race track for Go Karts.', category: 'Sport', duration: 30 },
        { name: 'Pedal Karting', description: '350m track for pedal-powered karts.', category: 'Sport', duration: 30 },
        { name: 'Horse Riding', description: 'Trail riding through scenic routes.', category: 'Adventure', duration: 45 },
        { name: 'Archery', description: 'Target shooting with various distances.', category: 'Sport', duration: 30 },
        { name: 'Paintball', description: 'Outdoor paintball for groups.', category: 'Adventure', duration: 60 },
        { name: 'Wall Climbing', description: '10-meter high natural climbing wall.', category: 'Sport', duration: 30 },
        { name: 'Trampoline World', description: 'Fun for kids and adults in trampoline areas.', category: 'Family Entertainment', duration: 60 },
        { name: 'Jungle Playground', description: 'Adventure zone for children.', category: 'Family Entertainment', duration: 60 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa African Village',
      location: 'Addis Ababa, Ethiopia',
      description: 'Cultural resort featuring 54 villas showcasing African traditions.',
      activities: [
        { name: 'Private Trekking', description: 'Trails through 50,000 sq. m. of nature.', category: 'Nature', duration: 60 },
        { name: 'Spa & Fitness Center', description: 'Health and wellness treatments and gym.', category: 'Wellness', duration: 60 },
        { name: 'Cultural Exploration', description: 'Explore African cultures via food, art, and artifacts.', category: 'Cultural', duration: 90 },
        { name: 'Weddings with 360° View', description: 'Panoramic cityscape ceremonies.', category: 'Events', duration: 240 },
        { name: 'Conferences and Events', description: 'Multipurpose halls for large gatherings.', category: 'Corporate', duration: 180 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa Awash Falls',
      location: 'Awash National Park, Ethiopia',
      description: 'A boutique resort offering waterfall views and relaxation experiences.',
      activities: [
        { name: 'Waterfall Dining', description: 'Meals near a scenic waterfall.', category: 'Dining', duration: 60 },
        { name: 'Dipping Pool Bar', description: 'Swim and enjoy drinks at the poolside bar.', category: 'Leisure', duration: 90 },
        { name: 'Outdoor Lounging', description: 'Relax on outdoor beds in nature.', category: 'Leisure', duration: 60 },
        { name: 'Specialty Massage', description: 'Spa with local massage techniques.', category: 'Wellness', duration: 60 },
        { name: 'Corporate Team Activities', description: 'Packages for company retreats.', category: 'Corporate', duration: 180 },
        { name: 'Gift Stays and Events', description: 'Customized experiences for celebrations.', category: 'Events', duration: 240 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa Adama',
      location: 'Adama, Ethiopia',
      description: 'A standard resort with general luxury amenities.',
      activities: [
        { name: 'Swimming Pool', description: 'Access to pool for relaxation and fun.', category: 'Leisure', duration: 60 },
        { name: 'Spa Services', description: 'Massages and body treatments.', category: 'Wellness', duration: 60 },
        { name: 'Resort Dining', description: 'On-site dining with various cuisines.', category: 'Dining', duration: 60 },
      ],
    },
    {
      name: 'Kuriftu Resort & Spa Langano',
      location: 'Langano, Ethiopia',
      description: 'A lakeside resort currently under development.',
      activities: [],
    },
    {
      name: 'Kuriftu Resorts Afar (Semera)',
      location: 'Semera, Afar Region, Ethiopia',
      description: 'Resort acting as a launch point for desert adventures in Afar.',
      activities: [
        { name: 'Desert Adventure Tours', description: 'Trips to Dalol, Erta Ale, and Allolobad.', category: 'Adventure', duration: 240 },
        { name: 'Standard Resort Amenities', description: 'Dining, conferences, and lodging.', category: 'Leisure', duration: 60 },
      ],
    },
  ]

  for (const branch of branches) {
    await prisma.branch.create({
      data: {
        name: branch.name,
        location: branch.location,
        description: branch.description,
        activities: {
          create: branch.activities,
        },
      },
    })
  }

  console.log('🌿 Seeded Kuriftu Resort data successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
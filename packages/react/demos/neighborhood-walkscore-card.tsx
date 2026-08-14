import * as React from 'react'
import Story from '../../components/story/Story'
import {
  NeighborhoodWalkscoreCard,
  type MobilityScore,
  type PoiItem,
  type CommuteDestination,
} from '@react-registry-blocks/neighborhood-walkscore-card/NeighborhoodWalkscoreCard'

const seattleWalkScore: MobilityScore = {
  score: 99,
  maxScore: 100,
  label: 'Walk Score®',
  verdict: "Walker's Paradise",
  description: 'Daily errands do not require a car',
  verdictClass: 'text-emerald-700 dark:text-emerald-400',
  gaugeColor: '#10b981',
  subtext: '99 out of 100 on urban pedestrian accessibility',
  highlights: ['92 amenities within 5-min walk', '100% sidewalk coverage', 'Direct underground concourse access'],
}

const seattleTransitScore: MobilityScore = {
  score: 97,
  maxScore: 100,
  label: 'Transit Score®',
  verdict: "Rider's Paradise",
  description: 'World-class public transit options',
  verdictClass: 'text-sky-700 dark:text-sky-400',
  gaugeColor: '#0ea5e9',
  subtext: '97 out of 100 on rapid rail and bus transit',
  highlights: [
    'Sound Transit Link 1 Line (2 min)',
    'Seattle Streetcar stop outside',
    'Ferry Terminal within 8 min walk',
  ],
}

const seattleBikeScore: MobilityScore = {
  score: 84,
  maxScore: 100,
  label: 'Bike Score®',
  verdict: 'Very Bikeable',
  description: 'Steep hill sections with protected cycle lanes',
  verdictClass: 'text-teal-700 dark:text-teal-400',
  gaugeColor: '#14b8a6',
  subtext: '84 out of 100 on bicycle infrastructure',
  highlights: [
    '2nd Ave Protected Bike Track',
    'Dedicated indoor bike lockup',
    'City bike share stations at every corner',
  ],
}

const seattlePois: PoiItem[] = [
  {
    id: 'sea-1',
    name: 'Westlake Station (Link Light Rail)',
    category: 'transit',
    categoryLabel: 'Public Transit',
    distance: '0.1 mi',
    timeWalk: '2 min walk',
    badge: 'Subway / Rail',
    description: 'Central subway junction connecting SEA Airport, Capitol Hill, and Bellevue/Redmond.',
    address: '400 Pine St, Seattle, WA',
  },
  {
    id: 'sea-2',
    name: 'Pike Place Market',
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.2 mi',
    timeWalk: '4 min walk',
    rating: '4.9 ★',
    badge: 'Historic Market',
    description: 'Iconic 9-acre public market featuring fresh seafood stalls, bakeries, craft dining, and produce.',
    address: '85 Pike St, Seattle, WA',
  },
  {
    id: 'sea-3',
    name: 'Monorail Terminal at Westlake',
    category: 'transit',
    categoryLabel: 'Public Transit',
    distance: '0.1 mi',
    timeWalk: '3 min walk',
    badge: 'Monorail',
    description: 'Direct high-speed monorail service to Seattle Center, Space Needle, and Climate Pledge Arena.',
    address: '400 Pine St #3, Seattle, WA',
  },
  {
    id: 'sea-4',
    name: 'Original Starbucks & 1st Ave Cafes',
    category: 'dining',
    categoryLabel: 'Dining & Coffee',
    distance: '0.2 mi',
    timeWalk: '5 min walk',
    rating: '4.7 ★',
    badge: 'Heritage Coffee',
    description: 'Historic cafe district with artisanal roasteries, espresso bars, and artisan sourdough bakeries.',
    address: '1912 Pike Pl, Seattle, WA',
  },
  {
    id: 'sea-5',
    name: 'Seattle Waterfront & Olympic Sculpture Park',
    category: 'parks',
    categoryLabel: 'Parks & Recreation',
    distance: '0.5 mi',
    timeWalk: '10 min walk',
    rating: '4.8 ★',
    badge: 'Public Park',
    description: '9-acre outdoor waterfront museum park with Puget Sound views and shoreline running trails.',
    address: '2901 Western Ave, Seattle, WA',
  },
  {
    id: 'sea-6',
    name: 'Downtown Seattle School of the Arts',
    category: 'schools',
    categoryLabel: 'Schools & Education',
    distance: '0.6 mi',
    timeWalk: '12 min walk',
    rating: '9/10',
    badge: 'Public 9-12',
    description: 'Top-ranking magnet arts and STEM secondary school located in the urban core district.',
    address: '2600 2nd Ave, Seattle, WA',
  },
]

const seattleCommutes: CommuteDestination[] = [
  {
    id: 'sea-comm-1',
    name: 'Bellevue Tech Hub / Downtown',
    region: 'Eastside Tech Corridor',
    distance: '10.2 mi',
    transitTime: 22,
    transitLabel: '22m by train',
    transitRoute: 'Link 2 Line East Link',
    driveTime: 26,
    driveLabel: '26m by car',
    driveRoute: 'via I-90 E Floating Bridge',
    peakRushTime: '35-45m at 8:30 AM',
  },
  {
    id: 'sea-comm-2',
    name: 'South Lake Union (Amazon HQ)',
    region: 'BioTech & Cloud Campuses',
    distance: '1.2 mi',
    transitTime: 8,
    transitLabel: '8m by streetcar',
    transitRoute: 'South Lake Union Streetcar',
    driveTime: 10,
    driveLabel: '10m by car',
    driveRoute: 'via Westlake Ave N',
    peakRushTime: '12-16m at 8:30 AM',
  },
  {
    id: 'sea-comm-3',
    name: 'Seattle-Tacoma Int Airport (SEA)',
    region: 'International Transit Hub',
    distance: '14.5 mi',
    transitTime: 36,
    transitLabel: '36m by train',
    transitRoute: 'Link 1 Line Direct',
    driveTime: 24,
    driveLabel: '24m by car',
    driveRoute: 'via I-5 S Express',
    peakRushTime: '38-52m at 8:30 AM',
  },
]

const austinWalkScore: MobilityScore = {
  score: 64,
  maxScore: 100,
  label: 'Walk Score®',
  verdict: 'Somewhat Walkable',
  description: 'Some errands can be accomplished on foot',
  verdictClass: 'text-amber-700 dark:text-amber-400',
  gaugeColor: '#f59e0b',
  subtext: '64 out of 100 on neighborhood walkability',
  highlights: [
    'Community shopping village in 8 min',
    'Greenbelt hike & bike trail access',
    'Wide residential sidewalks',
  ],
}

const austinTransitScore: MobilityScore = {
  score: 48,
  maxScore: 100,
  label: 'Transit Score®',
  verdict: 'Some Transit',
  description: 'A few nearby public transportation options',
  verdictClass: 'text-amber-700 dark:text-amber-400',
  gaugeColor: '#f59e0b',
  subtext: '48 out of 100 on suburban transit connectivity',
  highlights: [
    'CapMetro Route 111 Express bus',
    'Park & Ride facility within 1.2 mi',
    'Direct commuter bus to Capitol',
  ],
}

const austinBikeScore: MobilityScore = {
  score: 86,
  maxScore: 100,
  label: 'Bike Score®',
  verdict: 'Very Bikeable',
  description: 'Extensive multi-use trails and bike networks',
  verdictClass: 'text-teal-700 dark:text-teal-400',
  gaugeColor: '#14b8a6',
  subtext: '86 out of 100 on cycling trails & topography',
  highlights: [
    '18-mile Violet Crown Trail connection',
    'Bicycle lanes along all arterials',
    'Community veloway loop nearby',
  ],
}

export default function NeighborhoodWalkscoreCardDemo() {
  return (
    <>
      <Story
        title="Pasadena Location & Neighborhood Intelligence"
        description="Comprehensive real estate neighborhood scorecard showcasing Walk Score (94/100 Walker's Paradise), Transit Score (82/100), Bike Score (88/100), categorized POIs with interactive filters, and commute duration comparisons."
      >
        <NeighborhoodWalkscoreCard />
      </Story>

      <Story
        title="High-Density Urban Transit Hub (Seattle, WA)"
        description="Location intelligence scorecard configured for an ultra-walkable urban core address with 99 Walk Score, 97 Rider's Paradise Transit Score, and rapid light rail commuter routes."
      >
        <NeighborhoodWalkscoreCard
          title="Downtown Urban Core Intelligence"
          address="1912 Pike Place, Seattle, WA 98101"
          neighborhood="Pike Place & Westlake Commercial Core"
          city="Seattle"
          zipCode="98101"
          walkScore={seattleWalkScore}
          transitScore={seattleTransitScore}
          bikeScore={seattleBikeScore}
          pois={seattlePois}
          commutes={seattleCommutes}
        />
      </Story>

      <Story
        title="Suburban Greenbelt Neighborhood (Austin, TX)"
        description="Scorecard variant for a master-planned family suburban neighborhood featuring top-rated school ratings, greenbelt bike paths, and express highway commuter access."
      >
        <NeighborhoodWalkscoreCard
          title="Suburban Community Intelligence"
          address="5412 Escarpment Blvd, Austin, TX 78749"
          neighborhood="Circle C Ranch & Slaughter Creek District"
          city="Austin"
          zipCode="78749"
          walkScore={austinWalkScore}
          transitScore={austinTransitScore}
          bikeScore={austinBikeScore}
        />
      </Story>
    </>
  )
}

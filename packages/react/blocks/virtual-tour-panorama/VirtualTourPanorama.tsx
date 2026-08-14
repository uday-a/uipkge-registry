'use client'

import * as React from 'react'
import {
  Bed,
  Bath,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Glasses,
  Home,
  Info,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  Share2,
  Sofa,
  Sparkles,
  Sun,
  Utensils,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface RoomHotspot {
  id: string
  type: 'portal' | 'info'
  x: number // Base % (0 - 100)
  y: number // Pitch % (0 - 100)
  title: string
  subtitle: string
  targetRoomId?: string
  infoData?: {
    category: string
    specs: string[]
    description: string
    highlight: string
    material: string
  }
}

interface RoomMeasurement {
  id: string
  title: string
  imperial: string
  metric: string
  x1: number
  y1: number
  x2: number
  y2: number
  labelX: number
  labelY: number
}

interface RoomData {
  id: string
  name: string
  badgeName: string
  floor: string
  area: string
  exposure: string
  ceilingHeight: string
  description: string
  skylineStyle: string
  floorPlanCoords: { cx: number; cy: number; x: number; y: number; w: number; h: number; label: string }
  hotspots: RoomHotspot[]
  measurements: RoomMeasurement[]
  features: { label: string; value: string }[]
}

const rooms: RoomData[] = [
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    badgeName: 'Master Penthouse Bedroom',
    floor: 'Level 14',
    area: '450 sq ft (41.8 m²)',
    exposure: 'South-East Panoramic',
    ceilingHeight: '10.5 ft (3.20 m)',
    description:
      'Expansive private retreat with floor-to-ceiling soundproof glazing, custom Italian walnut millwork, motorized blackout drapes, and direct access to both the spa en-suite and sky terrace.',
    skylineStyle: 'from-indigo-950 via-slate-900 to-amber-950/40',
    floorPlanCoords: { cx: 178, cy: 46, x: 125, y: 10, w: 105, h: 72, label: 'Master Bed' },
    hotspots: [
      {
        id: 'hs-bed-to-bath',
        type: 'portal',
        x: 28,
        y: 56,
        title: 'Walk to En-suite Bathroom →',
        subtitle: 'Master Spa Bath · 10 ft away',
        targetRoomId: 'spa-bath',
      },
      {
        id: 'hs-bed-to-terrace',
        type: 'portal',
        x: 78,
        y: 52,
        title: 'Step out to Balcony →',
        subtitle: 'Skyline Rooftop Terrace · 14 ft away',
        targetRoomId: 'rooftop-terrace',
      },
      {
        id: 'hs-bed-wardrobe',
        type: 'info',
        x: 14,
        y: 44,
        title: 'Inspect Walk-in Wardrobe',
        subtitle: 'Poliform custom cabinetry · Biometric safe',
        infoData: {
          category: 'Joinery & Storage',
          specs: [
            'Italian smoked walnut finish',
            'Integrated 3000K sensor LED rails',
            'Velvet-lined jewelry vitrines',
            'Biometric concealed safe',
          ],
          description:
            'Custom fitted Italian dressing suite designed by Poliform with motion-activated illumination and climate-regulated storage.',
          highlight: '120 sq ft custom dressing suite',
          material: 'Smoked Walnut & Velvet',
        },
      },
      {
        id: 'hs-bed-acoustic',
        type: 'info',
        x: 52,
        y: 40,
        title: 'Inspect King Headboard & Shades',
        subtitle: 'Lutron motorized shades · Soundproofing',
        infoData: {
          category: 'Acoustics & Automation',
          specs: [
            'NRC 0.85 acoustic dampening',
            'Lutron Sivoia QS dual blackout shades',
            'Integrated USB-C & Qi fast charging',
            'Solid white oak fluted slats',
          ],
          description:
            'Architectural acoustic slatted wall treatment behind king suite paired with dual motorized solar and blackout drapery.',
          highlight: 'Lutron HomeWorks Integrated',
          material: 'White Oak & Bouclé Fabric',
        },
      },
    ],
    measurements: [
      {
        id: 'm-bed-ceiling',
        title: 'Ceiling Height',
        imperial: '10.5 ft',
        metric: '3.20 m',
        x1: 50,
        y1: 18,
        x2: 50,
        y2: 82,
        labelX: 52,
        labelY: 48,
      },
      {
        id: 'm-bed-span',
        title: 'Room Span',
        imperial: '24.8 ft',
        metric: '7.56 m',
        x1: 16,
        y1: 76,
        x2: 84,
        y2: 76,
        labelX: 50,
        labelY: 80,
      },
      {
        id: 'm-bed-window',
        title: 'Window Wall',
        imperial: '14.0 ft',
        metric: '4.27 m',
        x1: 64,
        y1: 30,
        x2: 92,
        y2: 30,
        labelX: 78,
        labelY: 26,
      },
    ],
    features: [
      { label: 'Flooring', value: 'Wide-plank European White Oak (Herringbone)' },
      { label: 'Soundproofing', value: 'STC 58 Acoustic Double Glazing' },
      { label: 'Climate Zone', value: 'Independent Nest Pro Heat Pump Zone' },
      { label: 'Lighting', value: 'Warm-Dim 2200K-3000K Architectural Recessed' },
    ],
  },
  {
    id: 'living-room',
    name: 'Living Room',
    badgeName: 'Grand Living Salon',
    floor: 'Level 14',
    area: '680 sq ft (63.2 m²)',
    exposure: 'South-West Horizon',
    ceilingHeight: '11.2 ft (3.41 m)',
    description:
      'Open-concept grand entertainment salon with double-height volume, continuous Calacatta marble slab flooring, custom dual-sided linear bioethanol fireplace, and panoramic sunset skyline vistas.',
    skylineStyle: 'from-amber-950/40 via-purple-950 to-zinc-950',
    floorPlanCoords: { cx: 65, cy: 46, x: 10, y: 10, w: 108, h: 72, label: 'Living Salon' },
    hotspots: [
      {
        id: 'hs-liv-to-kit',
        type: 'portal',
        x: 22,
        y: 54,
        title: 'Enter Gourmet Kitchen →',
        subtitle: 'Chef prep & dining · 8 ft away',
        targetRoomId: 'gourmet-kitchen',
      },
      {
        id: 'hs-liv-to-bed',
        type: 'portal',
        x: 82,
        y: 56,
        title: 'Go to Master Bedroom →',
        subtitle: 'Master Penthouse Wing · 16 ft away',
        targetRoomId: 'master-bedroom',
      },
      {
        id: 'hs-liv-fireplace',
        type: 'info',
        x: 50,
        y: 64,
        title: 'Inspect Linear Fireplace Hearth',
        subtitle: 'Calacatta gold marble · Eco-bioethanol',
        infoData: {
          category: 'Architectural Feature',
          specs: [
            '72-inch Planika bioethanol burner',
            'Full bookmatched Calacatta slab',
            'Zero-emission clean burn technology',
            'Smartphone & remote flame modulation',
          ],
          description:
            'Dramatic 72-inch dual-sided architectural fireplace framed in hand-selected bookmatched Italian Calacatta gold marble.',
          highlight: 'Remote Flame Modulation',
          material: 'Bookmatched Calacatta Gold',
        },
      },
      {
        id: 'hs-liv-audio',
        type: 'info',
        x: 68,
        y: 38,
        title: 'Architectural Audio & Smart Hub',
        subtitle: 'Bang & Olufsen · Crestron Touchpanel',
        infoData: {
          category: 'Smart Home & Audio',
          specs: [
            '6x B&O flush architectural transducers',
            'Crestron 10.1” wall touch interface',
            '4K ultra-short laser cinema ready',
            'Multi-zone scene preset lighting',
          ],
          description:
            'Invisible architectural sound system with studio acoustic calibration and centralized whole-home automation.',
          highlight: 'Whole-Home B&O Acoustic Sync',
          material: 'Titanium & Acoustical Plaster',
        },
      },
    ],
    measurements: [
      {
        id: 'm-liv-ceiling',
        title: 'Double-Height Ceiling',
        imperial: '11.2 ft',
        metric: '3.41 m',
        x1: 50,
        y1: 14,
        x2: 50,
        y2: 84,
        labelX: 52,
        labelY: 46,
      },
      {
        id: 'm-liv-span',
        title: 'Main Salon Span',
        imperial: '32.0 ft',
        metric: '9.75 m',
        x1: 12,
        y1: 78,
        x2: 88,
        y2: 78,
        labelX: 50,
        labelY: 82,
      },
      {
        id: 'm-liv-slider',
        title: 'Terrace Pocket Glazing',
        imperial: '16.0 ft',
        metric: '4.88 m',
        x1: 60,
        y1: 30,
        x2: 94,
        y2: 30,
        labelX: 77,
        labelY: 26,
      },
    ],
    features: [
      { label: 'Flooring', value: 'Honed Calacatta Marble with Inset Wool Rug' },
      { label: 'Fireplace', value: 'Planika 72" Automatic Bioethanol Hearth' },
      { label: 'Glazing', value: 'Motorized Sliding Minimal Pocket Doors' },
      { label: 'AV Hub', value: 'Bang & Olufsen Architectural Ceiling Sync' },
    ],
  },
  {
    id: 'gourmet-kitchen',
    name: 'Gourmet Kitchen',
    badgeName: "Chef's Gourmet Kitchen",
    floor: 'Level 14',
    area: '320 sq ft (29.7 m²)',
    exposure: 'North-East Morning Light',
    ceilingHeight: '10.5 ft (3.20 m)',
    description:
      'Culinary centerpiece anchored by a 12-foot honed quartzite waterfall island, seamless matte charcoal cabinetry, integrated Gaggenau 400 Series cooking appliances, and temperature-controlled wine storage.',
    skylineStyle: 'from-slate-900 via-zinc-900 to-emerald-950/30',
    floorPlanCoords: { cx: 42, cy: 122, x: 10, y: 92, w: 65, h: 58, label: 'Kitchen' },
    hotspots: [
      {
        id: 'hs-kit-to-liv',
        type: 'portal',
        x: 80,
        y: 54,
        title: 'Return to Living Room →',
        subtitle: 'Grand Salon · 8 ft away',
        targetRoomId: 'living-room',
      },
      {
        id: 'hs-kit-island',
        type: 'info',
        x: 46,
        y: 60,
        title: 'Inspect Waterfall Quartzite Island',
        subtitle: '12ft Honed Nuvolato quartzite · Downdraft induction',
        infoData: {
          category: 'Countertops & Prep',
          specs: [
            'Seamless bookmatched mitered edges',
            'Gaggenau induction with downdraft ventilation',
            'Concealed power docks with fast Qi charging',
            'Counter-height bar seating for four',
          ],
          description:
            'Monolithic 12-foot island sculpted from rare Brazilian Nuvolato quartzite with integrated smart touch induction surface.',
          highlight: '12-Foot Monolithic Slab',
          material: 'Honed Nuvolato Quartzite',
        },
      },
      {
        id: 'hs-kit-appliances',
        type: 'info',
        x: 20,
        y: 46,
        title: 'Appliance Suite & Wine Reserve',
        subtitle: 'Gaggenau 400 & Sub-Zero column · 102 bottles',
        infoData: {
          category: 'Professional Appliances',
          specs: [
            'Gaggenau 400 Series combi-steam & pyrolytic ovens',
            'Sub-Zero 36” refrigeration column',
            'Sub-Zero dual-zone 102-bottle wine vault',
            'Miele Knock2Open fully integrated dishwasher',
          ],
          description:
            'Fully integrated chef-grade culinary appliances with custom paneled facades and Sommelier wine preservation cellaring.',
          highlight: 'Gaggenau 400 Collection',
          material: 'Matte Charcoal & Fluted Bronze Glass',
        },
      },
    ],
    measurements: [
      {
        id: 'm-kit-ceiling',
        title: 'Ceiling Height',
        imperial: '10.5 ft',
        metric: '3.20 m',
        x1: 50,
        y1: 18,
        x2: 50,
        y2: 82,
        labelX: 52,
        labelY: 48,
      },
      {
        id: 'm-kit-island',
        title: 'Quartzite Island Span',
        imperial: '12.0 ft',
        metric: '3.66 m',
        x1: 28,
        y1: 72,
        x2: 72,
        y2: 72,
        labelX: 50,
        labelY: 76,
      },
      {
        id: 'm-kit-cabinet',
        title: 'Custom Cabinetry Run',
        imperial: '18.5 ft',
        metric: '5.64 m',
        x1: 14,
        y1: 36,
        x2: 58,
        y2: 36,
        labelX: 36,
        labelY: 32,
      },
    ],
    features: [
      { label: 'Cabinetry', value: 'Custom Matte Fenix Soft-Close Charcoal' },
      { label: 'Appliances', value: 'Gaggenau 400 Series + Sub-Zero Columns' },
      { label: 'Wine Storage', value: '102-Bottle Dual Temperature Cellar' },
      { label: 'Island', value: '12ft Nuvolato Quartzite Waterfall' },
    ],
  },
  {
    id: 'rooftop-terrace',
    name: 'Rooftop Terrace',
    badgeName: 'Skyline Rooftop Terrace',
    floor: 'Level 15 (Private Rooftop)',
    area: '540 sq ft (50.2 m²)',
    exposure: '360° Panoramic Skyline',
    ceilingHeight: 'Open Air (Skyline)',
    description:
      'Private top-tier sky oasis featuring heated saltwater infinity plunge pool, frameless tempered glass balustrades, Lynx outdoor kitchen BBQ suite, and 360-degree unobstructed horizon skyline.',
    skylineStyle: 'from-blue-950/80 via-slate-900 to-indigo-950',
    floorPlanCoords: { cx: 185, cy: 122, x: 140, y: 92, w: 90, h: 58, label: 'Sky Terrace' },
    hotspots: [
      {
        id: 'hs-ter-to-bed',
        type: 'portal',
        x: 20,
        y: 56,
        title: 'Enter Master Bedroom →',
        subtitle: 'Master Penthouse Suite · 14 ft away',
        targetRoomId: 'master-bedroom',
      },
      {
        id: 'hs-ter-to-bath',
        type: 'portal',
        x: 38,
        y: 52,
        title: 'Explore Spa Bath →',
        subtitle: 'Spa En-suite · 18 ft away',
        targetRoomId: 'spa-bath',
      },
      {
        id: 'hs-ter-pool',
        type: 'info',
        x: 74,
        y: 64,
        title: 'Inspect Infinity Plunge Pool',
        subtitle: 'Heated saltwater · Underwater LED · Counter-current',
        infoData: {
          category: 'Aquatics & Wellness',
          specs: [
            '14ft × 8ft heated infinity edge',
            'Automated saltwater electrolytic chlorination',
            'Fastlane counter-current swim jet module',
            'Color-tunable RGBW underwater fiber optics',
          ],
          description:
            'Custom cantilevered infinity-edge plunge pool with panoramic city views, integrated spa massage jets, and year-round automated heating.',
          highlight: 'Heated Infinity Plunge Pool',
          material: 'Custom Glass Mosaic & Teak Decking',
        },
      },
      {
        id: 'hs-ter-bbq',
        type: 'info',
        x: 52,
        y: 48,
        title: 'Outdoor Kitchen & BBQ Lounge',
        subtitle: 'Lynx Sedona Grill · Teak joinery · Granite bar',
        infoData: {
          category: 'Outdoor Entertaining',
          specs: [
            'Lynx 36” pro sear gas grill',
            'Marine-grade 316 stainless cabinetry',
            'Under-counter beverage cooler & ice maker',
            'Motorized louvered pergola canopy',
          ],
          description:
            'All-weather al fresco culinary station with marine-grade steel, weatherproof teak millwork, and automated rain-sensing pergola.',
          highlight: 'Lynx Pro Sear Stainless',
          material: '316 Marine Steel & Natural Teak',
        },
      },
    ],
    measurements: [
      {
        id: 'm-ter-span',
        title: 'Sky Deck Span',
        imperial: '36.0 ft',
        metric: '10.97 m',
        x1: 10,
        y1: 76,
        x2: 90,
        y2: 76,
        labelX: 50,
        labelY: 80,
      },
      {
        id: 'm-ter-pool',
        title: 'Plunge Pool Width',
        imperial: '14.0 ft',
        metric: '4.27 m',
        x1: 62,
        y1: 58,
        x2: 88,
        y2: 58,
        labelX: 75,
        labelY: 62,
      },
      {
        id: 'm-ter-balustrade',
        title: 'Glass Balustrade Height',
        imperial: '4.2 ft',
        metric: '1.28 m',
        x1: 88,
        y1: 44,
        x2: 88,
        y2: 72,
        labelX: 84,
        labelY: 58,
      },
    ],
    features: [
      { label: 'Decking', value: 'Sustainably Harvested Burmese Marine Teak' },
      { label: 'Pool Type', value: 'Heated Saltwater Infinity Edge with Swim Jet' },
      { label: 'Outdoor BBQ', value: 'Lynx Pro 36" Infrared Gas Rotisserie' },
      { label: 'Pergola', value: 'Renson Automated Motorized Louvers' },
    ],
  },
  {
    id: 'spa-bath',
    name: 'Spa Bath',
    badgeName: 'Master Spa Bath',
    floor: 'Level 14',
    area: '280 sq ft (26.0 m²)',
    exposure: 'Private Zen Courtyard',
    ceilingHeight: '10.5 ft (3.20 m)',
    description:
      'Serene stone retreat with bookmatched Fior di Bosco marble, freestanding Boffi soaking tub, dual floating vanities with brushed brass Dornbracht fixtures, and glass-enclosed thermostatic steam rain shower.',
    skylineStyle: 'from-zinc-900 via-neutral-900 to-amber-950/30',
    floorPlanCoords: { cx: 107, cy: 122, x: 80, y: 92, w: 55, h: 58, label: 'Spa Bath' },
    hotspots: [
      {
        id: 'hs-bath-to-bed',
        type: 'portal',
        x: 78,
        y: 56,
        title: 'Return to Master Bedroom →',
        subtitle: 'Master Penthouse Suite · 10 ft away',
        targetRoomId: 'master-bedroom',
      },
      {
        id: 'hs-bath-to-terrace',
        type: 'portal',
        x: 22,
        y: 52,
        title: 'Step out to Balcony →',
        subtitle: 'Rooftop Terrace · 18 ft away',
        targetRoomId: 'rooftop-terrace',
      },
      {
        id: 'hs-bath-tub',
        type: 'info',
        x: 50,
        y: 62,
        title: 'Inspect Boffi Freestanding Tub',
        subtitle: 'Sculpted Cristalplant stone · Floor-mounted Dornbracht',
        infoData: {
          category: 'Sanitaryware & Bath',
          specs: [
            'Boffi Iceland oval matte stone tub',
            'Dornbracht MEM floor-mount thermostatic mixer',
            'Integrated gentle chromotherapy glow',
            'Adjacent skyline picture view window',
          ],
          description:
            'Sculptural freestanding oval tub crafted from solid matte Cristalplant stone with dedicated floor-mounted brushed brass mixer.',
          highlight: 'Boffi Designer Soaking Tub',
          material: 'Cristalplant & Brushed Brass',
        },
      },
      {
        id: 'hs-bath-shower',
        type: 'info',
        x: 26,
        y: 44,
        title: 'Thermostatic Steam Rain Shower',
        subtitle: 'Dual rain heads · Steam generator · Heated teak bench',
        infoData: {
          category: 'Hydrotherapy Suite',
          specs: [
            'Kaldewei thermostatic steam generator (45°C)',
            'Dual 16” flush ceiling rain shower modules',
            'Frameless anti-fog heated glass enclosure',
            'Slip-resistant fluted marble base with radiant heating',
          ],
          description:
            'Spa-grade steam enclosure with multi-jet hydrotherapy, Scottish rain shower simulator, and heated ergonomic teak bench.',
          highlight: 'Dual Steam & Rain Hydrotherapy',
          material: 'Fior di Bosco Marble & Heated Glass',
        },
      },
    ],
    measurements: [
      {
        id: 'm-bath-ceiling',
        title: 'Ceiling Height',
        imperial: '10.5 ft',
        metric: '3.20 m',
        x1: 50,
        y1: 18,
        x2: 50,
        y2: 82,
        labelX: 52,
        labelY: 48,
      },
      {
        id: 'm-bath-vanity',
        title: 'Dual Floating Vanity',
        imperial: '9.0 ft',
        metric: '2.74 m',
        x1: 58,
        y1: 64,
        x2: 90,
        y2: 64,
        labelX: 74,
        labelY: 68,
      },
      {
        id: 'm-bath-shower',
        title: 'Steam Enclosure',
        imperial: '7.5 ft',
        metric: '2.28 m',
        x1: 16,
        y1: 38,
        x2: 38,
        y2: 38,
        labelX: 27,
        labelY: 34,
      },
    ],
    features: [
      { label: 'Stone', value: 'Full-slab Italian Fior di Bosco Marble' },
      { label: 'Fixtures', value: 'Dornbracht MEM Series in Brushed Durabrass' },
      { label: 'Tub', value: 'Boffi Iceland Cristalplant Matte Stone Soaker' },
      { label: 'Radiant Heat', value: 'NuHeat Thermostatic In-Floor Heating' },
    ],
  },
]

export function VirtualTourPanorama() {
  const [currentRoomId, setCurrentRoomId] = React.useState<string>('master-bedroom')
  const [yaw, setYaw] = React.useState<number>(0)
  const [pitch, setPitch] = React.useState<number>(0)
  const [zoom, setZoom] = React.useState<number>(1.0)

  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const [dragStartX, setDragStartX] = React.useState<number>(0)
  const [dragStartY, setDragStartY] = React.useState<number>(0)
  const [startYaw, setStartYaw] = React.useState<number>(0)
  const [startPitch, setStartPitch] = React.useState<number>(0)

  const [isAutoRotating, setIsAutoRotating] = React.useState<boolean>(false)
  const [isMinimapOpen, setIsMinimapOpen] = React.useState<boolean>(true)
  const [isMeasurementMode, setIsMeasurementMode] = React.useState<boolean>(false)
  const [measurementUnit, setMeasurementUnit] = React.useState<'imperial' | 'metric'>('imperial')
  const [isVrMode, setIsVrMode] = React.useState<boolean>(false)
  const [isAudioActive, setIsAudioActive] = React.useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)
  const [copiedToast, setCopiedToast] = React.useState<boolean>(false)
  const [isRoomTransitioning, setIsRoomTransitioning] = React.useState<boolean>(false)
  const [activeInfoHotspot, setActiveInfoHotspot] = React.useState<RoomHotspot | null>(null)
  const [hoveredHotspotId, setHoveredHotspotId] = React.useState<string | null>(null)

  const currentRoom = React.useMemo(() => {
    return rooms.find((r) => r.id === currentRoomId) || rooms[0]
  }, [currentRoomId])

  const compassHeading = React.useMemo(() => {
    const normalized = ((yaw % 360) + 360) % 360
    return Math.round(normalized)
  }, [yaw])

  const compassDirection = React.useMemo(() => {
    const h = compassHeading
    if (h >= 337.5 || h < 22.5) return 'N'
    if (h >= 22.5 && h < 67.5) return 'NE'
    if (h >= 67.5 && h < 112.5) return 'E'
    if (h >= 112.5 && h < 157.5) return 'SE'
    if (h >= 157.5 && h < 202.5) return 'S'
    if (h >= 202.5 && h < 247.5) return 'SW'
    if (h >= 247.5 && h < 292.5) return 'W'
    return 'NW'
  }, [compassHeading])

  // Auto-rotation effect
  React.useEffect(() => {
    let rafId: number
    const rotateLoop = () => {
      if (isAutoRotating && !isDragging) {
        setYaw((prev) => (prev + 0.18) % 360)
      }
      rafId = requestAnimationFrame(rotateLoop)
    }
    rafId = requestAnimationFrame(rotateLoop)
    return () => cancelAnimationFrame(rafId)
  }, [isAutoRotating, isDragging])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === 'ArrowLeft') setYaw((y) => (y - 15 + 3600) % 360)
      if (e.key === 'ArrowRight') setYaw((y) => (y + 15 + 3600) % 360)
      if (e.key === 'ArrowUp') setPitch((p) => Math.min(22, p + 5))
      if (e.key === 'ArrowDown') setPitch((p) => Math.max(-22, p - 5))
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(1.5, z + 0.1))
      if (e.key === '-' || e.key === '_') setZoom((z) => Math.max(0.85, z - 0.1))
      if (e.key === 'm' || e.key === 'M') setIsMinimapOpen((m) => !m)
      if (e.key === 'r' || e.key === 'R') setIsMeasurementMode((r) => !r)
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const switchRoom = React.useCallback(
    (roomId: string) => {
      if (roomId === currentRoomId) return
      setIsRoomTransitioning(true)
      setActiveInfoHotspot(null)

      setTimeout(() => {
        setCurrentRoomId(roomId)
        setYaw(0)
        setPitch(0)
        setTimeout(() => {
          setIsRoomTransitioning(false)
        }, 280)
      }, 220)
    },
    [currentRoomId],
  )

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStartX(clientX)
    setDragStartY(clientY)
    setStartYaw(yaw)
    setStartPitch(pitch)
  }

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const deltaX = clientX - dragStartX
    const deltaY = clientY - dragStartY

    setYaw((startYaw - deltaX * 0.25 + 3600) % 360)
    setPitch(Math.max(-22, Math.min(22, startPitch + deltaY * 0.18)))
  }

  const onPointerUp = () => {
    setIsDragging(false)
  }

  const panStep = (dx: number, dy: number) => {
    setYaw((y) => (y + dx + 3600) % 360)
    setPitch((p) => Math.max(-22, Math.min(22, p + dy)))
  }

  const zoomStep = (delta: number) => {
    setZoom((z) => Math.max(0.85, Math.min(1.5, z + delta)))
  }

  const resetView = () => {
    setYaw(0)
    setPitch(0)
    setZoom(1.0)
  }

  const copyTourShareLink = () => {
    setCopiedToast(true)
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://uipkge.dev/tour/742-evergreen-terrace')
    }
    setTimeout(() => {
      setCopiedToast(false)
    }, 3200)
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  const getHotspotStyle = (hotspot: RoomHotspot) => {
    // Clamp both axes so a marker can never be placed half outside the viewport bounds
    const relativeX = Math.max(8, Math.min(92, (hotspot.x - (yaw / 360) * 100 + 150) % 100))
    const relativeY = Math.max(8, Math.min(88, hotspot.y + pitch * 0.4))
    return {
      left: `${relativeX}%`,
      top: `${relativeY}%`,
    }
  }

  const getRoomIcon = (roomId: string) => {
    switch (roomId) {
      case 'master-bedroom':
        return <Bed className="size-3.5" />
      case 'living-room':
        return <Sofa className="size-3.5" />
      case 'gourmet-kitchen':
        return <Utensils className="size-3.5" />
      case 'rooftop-terrace':
        return <Sun className="size-3.5" />
      case 'spa-bath':
        return <Bath className="size-3.5" />
      default:
        return <Home className="size-3.5" />
    }
  }

  return (
    <div
      data-slot="virtual-tour-panorama"
      className={`bg-background text-foreground w-full space-y-4 font-sans transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-black p-4 sm:p-6' : ''
      }`}
    >
      {/* Top Header Bar */}
      <header className="bg-card rounded-xl border p-3.5 shadow-xs sm:px-5 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Property Identity & Room Badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary border-primary/30 flex size-8 items-center justify-center rounded-lg border shadow-xs">
                <Compass className="size-4 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-foreground text-sm font-bold tracking-tight sm:text-base">
                    742 Evergreen Terrace
                  </h2>
                  <span className="text-muted-foreground hidden text-xs font-medium sm:inline">360° Virtual Tour</span>
                </div>
                <p className="text-muted-foreground text-xs">Penthouse Residence 14B · The Evergreen Collection</p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-6 sm:block" />

            {/* Dynamic Active Room Badge */}
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary gap-1.5 px-2.5 py-1 text-xs font-semibold"
            >
              {getRoomIcon(currentRoom.id)}
              <span>{currentRoom.badgeName}</span>
            </Badge>

            {/* Resolution & Live Feed Indicator */}
            <div className="text-muted-foreground hidden items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium md:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>8K Ultra-HD Pano</span>
              <span>·</span>
              <span>{currentRoom.floor}</span>
            </div>
          </div>

          {/* Top Right Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Ambience Audio Toggle */}
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 px-2.5 text-xs transition-colors ${
                isAudioActive ? 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400' : ''
              }`}
              aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Play ambient soundscape'}
              onClick={() => setIsAudioActive(!isAudioActive)}
            >
              {isAudioActive ? (
                <Volume2 className="size-3.5 text-sky-500" />
              ) : (
                <VolumeX className="text-muted-foreground size-3.5" />
              )}
              <span className="hidden md:inline">{isAudioActive ? 'Sound On' : 'Ambience'}</span>
            </Button>

            {/* Gyroscope / VR Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 px-2.5 text-xs transition-colors ${
                isVrMode ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : ''
              }`}
              aria-label={isVrMode ? 'Exit VR mode' : 'Enter VR mode'}
              onClick={() => setIsVrMode(!isVrMode)}
            >
              <Glasses className="size-3.5" />
              <span className="hidden sm:inline">{isVrMode ? 'VR Active' : 'VR Mode'}</span>
            </Button>

            {/* Share Tour Link Button */}
            <Button
              variant="outline"
              size="sm"
              className="relative h-8 gap-1.5 px-2.5 text-xs"
              aria-label="Share 360 Tour"
              onClick={copyTourShareLink}
            >
              {copiedToast ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
              <span className="hidden sm:inline">{copiedToast ? 'Copied!' : 'Share'}</span>
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* 360 Panorama Viewport Container */}
      <div
        className="relative aspect-video min-h-[480px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-white shadow-sm select-none sm:min-h-[580px]"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        {/* Simulated 360 High-Resolution Architectural Panorama Art Canvas */}
        <div
          className={`absolute inset-0 size-full transition-all duration-300 ease-out ${
            isRoomTransitioning ? 'scale-105 opacity-20 blur-md' : 'opacity-100 blur-none'
          }`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background Gradient Ambience Layer */}
          <div className={`absolute inset-0 bg-gradient-to-b ${currentRoom.skylineStyle}`} />

          {/* Architectural Wireframe / Perspective Room Illustration */}
          <svg
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="sunGlowReact" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Panoramic Window Skyline & Perspective Architecture (Parallax shifting with yaw) */}
            <g transform={`translate(${-(yaw / 360) * 320}, ${-pitch * 2})`}>
              {/* Horizon Skybox Glow */}
              <rect x="-300" y="80" width="1600" height="340" fill="url(#sunGlowReact)" />

              {/* Skyline Cityscape Silhouettes */}
              <path
                d="M-200 320 L-180 260 L-150 260 L-150 320 L-120 320 L-110 220 L-80 220 L-70 320 L-40 320 L-30 200 L0 200 L10 320 L50 320 L60 170 L90 170 L100 320 L150 320 L160 240 L190 240 L200 320 L260 320 L270 190 L310 190 L320 320 L380 320 L390 210 L430 210 L440 320 L500 320 L510 160 L540 160 L560 320 L620 320 L630 230 L670 230 L680 320 L740 320 L750 180 L790 180 L800 320 L860 320 L870 250 L910 250 L920 320 L980 320 L990 200 L1030 200 L1040 320 L1100 320 L1120 230 L1160 230 L1180 320 L1240 320 L1250 190 L1290 190 L1300 320 Z"
                fill="#1e1b4b"
                fillOpacity="0.4"
              />
              <path
                d="M-150 320 L-140 280 L-110 280 L-100 320 L-50 320 L-40 240 L-10 240 L0 320 L70 320 L80 220 L120 220 L130 320 L210 320 L220 250 L250 250 L260 320 L340 320 L350 210 L380 210 L390 320 L460 320 L470 240 L500 240 L510 320 L580 320 L590 200 L630 200 L640 320 L710 320 L720 260 L750 260 L760 320 L830 320 L840 220 L880 220 L890 320 L960 320 L970 260 L1000 260 L1010 320 L1080 320 L1090 220 L1130 220 L1140 320 Z"
                fill="#0f172a"
                fillOpacity="0.65"
              />

              {/* Architectural Window Mullions */}
              <line x1="0" y1="90" x2="0" y2="400" stroke="#334155" strokeWidth="6" />
              <line x1="250" y1="90" x2="250" y2="400" stroke="#334155" strokeWidth="6" />
              <line x1="500" y1="90" x2="500" y2="400" stroke="#475569" strokeWidth="8" />
              <line x1="750" y1="90" x2="750" y2="400" stroke="#334155" strokeWidth="6" />
              <line x1="1000" y1="90" x2="1000" y2="400" stroke="#334155" strokeWidth="6" />
              <line x1="1250" y1="90" x2="1250" y2="400" stroke="#334155" strokeWidth="6" />
              <line x1="-300" y1="90" x2="1300" y2="90" stroke="#334155" strokeWidth="6" />
              <line x1="-300" y1="400" x2="1300" y2="400" stroke="#334155" strokeWidth="8" />

              {/* Room-Specific Detailed Focal Art Piece */}
              {currentRoom.id === 'master-bedroom' && (
                <g>
                  {/* King Upholstered Bed & Acoustic Slat Headboard */}
                  <rect
                    x="360"
                    y="310"
                    width="280"
                    height="90"
                    rx="4"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  <rect
                    x="380"
                    y="240"
                    width="240"
                    height="70"
                    rx="6"
                    fill="#334155"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <line x1="400" y1="240" x2="400" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="420" y1="240" x2="420" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="440" y1="240" x2="440" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="460" y1="240" x2="460" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="480" y1="240" x2="480" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="500" y1="240" x2="500" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="520" y1="240" x2="520" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="540" y1="240" x2="540" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="560" y1="240" x2="560" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="580" y1="240" x2="580" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <line x1="600" y1="240" x2="600" y2="310" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx="430" cy="330" rx="35" ry="15" fill="#e2e8f0" fillOpacity="0.8" />
                  <ellipse cx="570" cy="330" rx="35" ry="15" fill="#e2e8f0" fillOpacity="0.8" />
                  <rect x="300" y="340" width="50" height="45" rx="3" fill="#0f172a" stroke="#334155" />
                  <rect x="650" y="340" width="50" height="45" rx="3" fill="#0f172a" stroke="#334155" />
                  <circle cx="325" cy="315" r="8" fill="#f59e0b" fillOpacity="0.6" />
                  <circle cx="675" cy="315" r="8" fill="#f59e0b" fillOpacity="0.6" />
                </g>
              )}

              {currentRoom.id === 'living-room' && (
                <g>
                  {/* Curved Sectional Sofa & Travertine Hearth */}
                  <path
                    d="M320 380 Q500 360 680 380 L660 430 Q500 410 340 430 Z"
                    fill="#334155"
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <rect
                    x="420"
                    y="400"
                    width="160"
                    height="40"
                    rx="8"
                    fill="#475569"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="400"
                    y="270"
                    width="200"
                    height="35"
                    rx="4"
                    fill="#09090b"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M420 292 Q430 280 440 292 Q450 276 460 292 Q470 282 480 292 Q490 278 500 292 Q510 280 520 292 Q530 276 540 292 Q550 280 560 292 Q570 278 580 292"
                    stroke="#f97316"
                    strokeWidth="3"
                    fill="none"
                  />
                </g>
              )}

              {currentRoom.id === 'gourmet-kitchen' && (
                <g>
                  {/* 12ft Waterfall Island & High Barstools */}
                  <path
                    d="M300 340 L700 340 L740 420 L260 420 Z"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="400 4"
                  />
                  <rect x="360" y="325" width="280" height="15" rx="3" fill="#1e293b" stroke="#64748b" />
                  <circle cx="340" cy="425" r="14" fill="#334155" stroke="#94a3b8" />
                  <circle cx="450" cy="425" r="14" fill="#334155" stroke="#94a3b8" />
                  <circle cx="550" cy="425" r="14" fill="#334155" stroke="#94a3b8" />
                  <circle cx="660" cy="425" r="14" fill="#334155" stroke="#94a3b8" />
                </g>
              )}

              {currentRoom.id === 'rooftop-terrace' && (
                <g>
                  {/* Infinity Plunge Pool & Lounges */}
                  <rect
                    x="520"
                    y="340"
                    width="340"
                    height="90"
                    rx="8"
                    fill="#0369a1"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <path
                    d="M540 370 Q600 360 660 370 Q720 380 780 370 Q820 360 840 370"
                    stroke="#7dd3fc"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M540 395 Q600 385 660 395 Q720 405 780 395 Q820 385 840 395"
                    stroke="#7dd3fc"
                    strokeWidth="2"
                    fill="none"
                  />
                  <rect
                    x="220"
                    y="360"
                    width="100"
                    height="40"
                    rx="4"
                    fill="#78350f"
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="350"
                    y="360"
                    width="100"
                    height="40"
                    rx="4"
                    fill="#78350f"
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {currentRoom.id === 'spa-bath' && (
                <g>
                  {/* Freestanding Oval Soaking Tub & Dual Mirror Wall */}
                  <ellipse cx="500" cy="380" rx="140" ry="45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                  <ellipse cx="500" cy="380" rx="115" ry="32" fill="#0284c7" fillOpacity="0.4" />
                  <circle cx="340" cy="240" r="45" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="660" cy="240" r="45" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                </g>
              )}
            </g>

            {/* Perspective Floor Grid */}
            <path
              d="M-200 600 L300 400 M0 600 L400 400 M200 600 L500 400 M400 600 L500 400 M600 600 L500 400 M800 600 L600 400 M1000 600 L700 400 M1200 600 L800 400"
              stroke="#334155"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <line x1="-200" y1="440" x2="1200" y2="440" stroke="#334155" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="-200" y1="490" x2="1200" y2="490" stroke="#334155" strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="-200" y1="545" x2="1200" y2="545" stroke="#334155" strokeOpacity="0.25" strokeWidth="1.5" />

            {/* Ceiling Cove Recessed Glow line */}
            <line x1="0" y1="40" x2="1000" y2="40" stroke="#fbbf24" strokeOpacity="0.3" strokeWidth="2" />
          </svg>

          {/* Dynamic Laser Measurement Overlay (When enabled) */}
          {isMeasurementMode && (
            <svg
              className="pointer-events-none absolute inset-0 size-full transition-opacity duration-300"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              {currentRoom.measurements.map((m) => (
                <g key={m.id}>
                  <line
                    x1={m.x1}
                    y1={m.y1}
                    x2={m.x2}
                    y2={m.y2}
                    stroke="#f43f5e"
                    strokeWidth="0.75"
                    strokeDasharray="2 1.5"
                  />
                  <circle cx={m.x1} cy={m.y1} r="1.5" fill="#f43f5e" />
                  <circle cx={m.x2} cy={m.y2} r="1.5" fill="#f43f5e" />
                </g>
              ))}
            </svg>
          )}

          {/* Measurement Pill Badges (HTML Overlay) */}
          {isMeasurementMode && (
            <div className="pointer-events-none absolute inset-0 size-full">
              {currentRoom.measurements.map((m) => (
                <div
                  key={'badge-' + m.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${m.labelX}%`, top: `${m.labelY}%` }}
                >
                  <div className="flex items-center gap-1.5 rounded-md border border-rose-500/80 bg-zinc-950/90 px-2 py-0.5 font-mono text-xs font-bold text-rose-400 shadow-xl backdrop-blur-md">
                    <Ruler className="size-3" />
                    <span>{m.title}:</span>
                    <span className="text-white">{measurementUnit === 'imperial' ? m.imperial : m.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Hotspot Pins Layer */}
        <div className="pointer-events-auto absolute inset-0 size-full">
          {currentRoom.hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
              style={getHotspotStyle(hotspot)}
              onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
              onMouseLeave={() => setHoveredHotspotId(null)}
            >
              {/* PORTAL HOTSPOT: Room Navigation */}
              {hotspot.type === 'portal' && (
                <div className="group relative flex flex-col items-center">
                  <span className="absolute -inset-2.5 rounded-full bg-emerald-400 opacity-60 duration-1000" />
                  <span className="absolute -inset-1 rounded-full bg-emerald-500/40 opacity-80 blur-xs" />

                  <button
                    type="button"
                    className="relative flex size-9 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-600/90 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-115 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    aria-label={hotspot.title}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (hotspot.targetRoomId) switchRoom(hotspot.targetRoomId)
                    }}
                  >
                    <Navigation className="size-4" />
                  </button>

                  <div
                    className={`pointer-events-none absolute top-11 z-30 flex w-52 flex-col items-center rounded-lg border border-emerald-500/40 bg-zinc-950/95 p-2 text-center shadow-sm backdrop-blur-md transition-all duration-200 ${
                      hoveredHotspotId === hotspot.id ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <span>{hotspot.title}</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">{hotspot.subtitle}</p>
                    <span className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-300">
                      Click to Transition <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* INFO HOTSPOT: Feature Inspection */}
              {hotspot.type === 'info' && (
                <div className="group relative flex flex-col items-center">
                  <span className="absolute -inset-2.5 rounded-full bg-sky-400 opacity-60 duration-1000" />
                  <span className="absolute -inset-1 rounded-full bg-sky-500/40 opacity-80 blur-xs" />

                  <button
                    type="button"
                    className="relative flex size-9 items-center justify-center rounded-full border-2 border-sky-400 bg-sky-600/90 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-115 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                    aria-label={hotspot.title}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveInfoHotspot(hotspot)
                    }}
                  >
                    <Sparkles className="size-4" />
                  </button>

                  <div
                    className={`pointer-events-none absolute top-11 z-30 flex w-52 flex-col items-center rounded-lg border border-sky-500/40 bg-zinc-950/95 p-2 text-center shadow-sm backdrop-blur-md transition-all duration-200 ${
                      hoveredHotspotId === hotspot.id ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold text-sky-400">
                      <Info className="size-3" />
                      <span>{hotspot.title}</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">{hotspot.subtitle}</p>
                    <span className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-semibold text-sky-300">
                      Click to Inspect Specs
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Top Overlay HUD: Compass, Pitch, FOV & Controls */}
        <div className="pointer-events-none absolute inset-x-3.5 top-3.5 z-20 flex flex-wrap items-start justify-between gap-2">
          {/* Compass & Angle HUD Indicator */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-zinc-700/60 bg-zinc-900/85 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-100">
              <Compass
                className="text-primary size-3.5 transition-transform duration-100"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              />
              <span>
                {compassHeading}° {compassDirection}
              </span>
            </div>
            <Separator orientation="vertical" className="h-3.5 bg-zinc-700" />
            <span className="font-mono text-xs text-zinc-400">FOV 85°</span>
            <Separator orientation="vertical" className="h-3.5 bg-zinc-700" />
            <span className="font-mono text-xs text-zinc-400">
              Pitch {pitch > 0 ? `+${Math.round(pitch)}°` : `${Math.round(pitch)}°`}
            </span>
          </div>

          {/* Canvas Top Right Action Badges */}
          <div className="pointer-events-auto flex items-center gap-2">
            {isVrMode && (
              <div className="flex items-center gap-1.5 rounded-lg border border-indigo-500/50 bg-indigo-950/80 px-2.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Glasses className="size-3.5 animate-pulse" />
                <span>Gyroscope / VR Sensor Active</span>
              </div>
            )}

            {isMeasurementMode && (
              <div className="flex items-center gap-1 rounded-lg border border-rose-500/50 bg-zinc-900/90 p-1 backdrop-blur-md">
                <Button
                  size="sm"
                  variant={measurementUnit === 'imperial' ? 'destructive' : 'ghost'}
                  className="h-6 px-2 text-xs"
                  onClick={() => setMeasurementUnit('imperial')}
                >
                  Imperial (ft)
                </Button>
                <Button
                  size="sm"
                  variant={measurementUnit === 'metric' ? 'destructive' : 'ghost'}
                  className="h-6 px-2 text-xs"
                  onClick={() => setMeasurementUnit('metric')}
                >
                  Metric (m)
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Floating 360 Pan & Zoom Controls (Center-Right overlay) */}
        <div className="pointer-events-auto absolute top-16 right-3.5 z-20 hidden flex-col items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/85 p-1 shadow-xl backdrop-blur-md sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            aria-label="Pan Up"
            onClick={() => panStep(0, 8)}
          >
            <ChevronUp className="size-4" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              aria-label="Pan Left"
              onClick={() => panStep(-15, 0)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              aria-label="Reset View"
              onClick={resetView}
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              aria-label="Pan Right"
              onClick={() => panStep(15, 0)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            aria-label="Pan Down"
            onClick={() => panStep(0, -8)}
          >
            <ChevronDown className="size-4" />
          </Button>
          <Separator className="my-0.5 bg-zinc-800" />
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            aria-label="Zoom In"
            onClick={() => zoomStep(0.15)}
          >
            <ZoomIn className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            aria-label="Zoom Out"
            onClick={() => zoomStep(-0.15)}
          >
            <ZoomOut className="size-3.5" />
          </Button>
        </div>

        {/* 2D Floor Plan Minimap Overlay (Top-Left corner dock) */}
        {isMinimapOpen && (
          <div className="pointer-events-auto absolute top-14 left-3.5 z-30 w-56 overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950/90 shadow-sm backdrop-blur-md transition-all sm:w-64">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <MapIcon className="text-primary size-3.5" />
                <span className="text-xs font-bold text-zinc-200">Floor Plan Minimap</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-5 text-zinc-400 hover:text-white"
                aria-label="Close minimap"
                onClick={() => setIsMinimapOpen(false)}
              >
                <X className="size-3" />
              </Button>
            </div>

            <div className="relative p-2.5">
              {/* 2D CAD Blueprint Floor Plan SVG */}
              <svg className="w-full" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="fovGradientReact" cx="0" cy="0" r="100%" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Floor Plan Room Outlines */}
                {rooms.map((r) => (
                  <g key={'map-r-' + r.id} className="cursor-pointer" onClick={() => switchRoom(r.id)}>
                    <rect
                      x={r.floorPlanCoords.x}
                      y={r.floorPlanCoords.y}
                      width={r.floorPlanCoords.w}
                      height={r.floorPlanCoords.h}
                      className={`transition-colors duration-200 ${
                        currentRoomId === r.id
                          ? 'fill-emerald-500/25 stroke-emerald-400 stroke-2'
                          : 'fill-zinc-900/80 stroke-zinc-700 stroke-1 hover:fill-zinc-800'
                      }`}
                      rx="3"
                    />
                  </g>
                ))}

                {/* Dynamic Field of View (FOV) Radar Cone Indicator */}
                <g
                  transform={`translate(${currentRoom.floorPlanCoords.cx}, ${currentRoom.floorPlanCoords.cy}) rotate(${yaw + 180})`}
                >
                  <path d="M 0 0 L -22 -44 A 48 48 0 0 1 22 -44 Z" fill="url(#fovGradientReact)" />
                  <line x1="0" y1="0" x2="-22" y2="-44" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="0" x2="22" y2="-44" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* Active Viewpoint Marker with Pulsing Ping */}
                <circle
                  cx={currentRoom.floorPlanCoords.cx}
                  cy={currentRoom.floorPlanCoords.cy}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Room Labels (painted last so the FOV cone and viewpoint marker never cover them) */}
                {rooms.map((r) => (
                  <text
                    key={'map-l-' + r.id}
                    x={r.floorPlanCoords.cx}
                    y={r.floorPlanCoords.cy + 4}
                    textAnchor="middle"
                    className={`pointer-events-none text-xs font-semibold select-none ${
                      currentRoomId === r.id ? 'fill-emerald-300 font-bold' : 'fill-zinc-400'
                    }`}
                    style={{ fontSize: 9.5 }}
                  >
                    {r.floorPlanCoords.label}
                  </text>
                ))}
              </svg>

              <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono">North ↑</span>
                <span>Click room zone to jump</span>
              </div>
            </div>
          </div>
        )}

        {/* Feature Inspection Floating Detail Card Modal (When info hotspot clicked) */}
        {activeInfoHotspot && activeInfoHotspot.infoData && (
          <div className="pointer-events-auto absolute inset-x-4 top-14 z-40 mx-auto max-w-md rounded-xl border border-sky-500/40 bg-zinc-950/95 p-4 shadow-sm backdrop-blur-xl sm:top-20">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-sky-500/50 bg-sky-500/10 text-xs font-semibold text-sky-400"
                  >
                    {activeInfoHotspot.infoData.category}
                  </Badge>
                  <span className="font-mono text-xs text-zinc-400">{activeInfoHotspot.infoData.highlight}</span>
                </div>
                <h3 className="text-sm font-bold text-white sm:text-base">{activeInfoHotspot.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-zinc-400 hover:text-white"
                aria-label="Close feature modal"
                onClick={() => setActiveInfoHotspot(null)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <p className="leading-relaxed text-zinc-300">{activeInfoHotspot.infoData.description}</p>

              <div className="space-y-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  Architectural Specifications
                </span>
                <ul className="grid grid-cols-1 gap-1 text-zinc-200 sm:grid-cols-2">
                  {activeInfoHotspot.infoData.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 shrink-0 text-sky-400" />
                      <span className="truncate">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-2 text-xs text-zinc-400">
                <span>
                  Finishes: <strong className="text-zinc-200">{activeInfoHotspot.infoData.material}</strong>
                </span>
                <Button size="sm" className="h-7 text-xs" onClick={() => setActiveInfoHotspot(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Floating Navigation Dock (Room Switcher & Tool Controls) */}
        <div className="pointer-events-auto absolute inset-x-3.5 bottom-3.5 z-30 flex items-center justify-center">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-zinc-700/80 bg-zinc-950/90 p-2 shadow-sm backdrop-blur-xl sm:px-4">
            {/* Auto-Rotate 360 Toggle */}
            <Button
              variant={isAutoRotating ? 'default' : 'secondary'}
              size="sm"
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium"
              aria-label={isAutoRotating ? 'Pause 360 auto rotate' : 'Play 360 auto rotate'}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
            >
              {isAutoRotating ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span className="hidden sm:inline">{isAutoRotating ? 'Pause Tour' : 'Auto Tour'}</span>
            </Button>

            <Separator orientation="vertical" className="hidden h-5 bg-zinc-800 sm:block" />

            {/* Room Switcher Thumbnails Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`group flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    currentRoomId === r.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                  onClick={() => switchRoom(r.id)}
                >
                  {getRoomIcon(r.id)}
                  <span className="whitespace-nowrap">{r.name}</span>
                </button>
              ))}
            </div>

            <Separator orientation="vertical" className="hidden h-5 bg-zinc-800 sm:block" />

            {/* Minimap Toggle Button */}
            <Button
              variant={isMinimapOpen ? 'default' : 'secondary'}
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-xs"
              aria-label={isMinimapOpen ? 'Hide floor plan minimap' : 'Show floor plan minimap'}
              onClick={() => setIsMinimapOpen(!isMinimapOpen)}
            >
              <MapIcon className="size-3.5" />
              <span className="hidden md:inline">Minimap</span>
            </Button>

            {/* Laser Measurement Toggle Button */}
            <Button
              variant={isMeasurementMode ? 'destructive' : 'secondary'}
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-xs"
              aria-label={isMeasurementMode ? 'Turn off measurement mode' : 'Turn on measurement mode'}
              onClick={() => setIsMeasurementMode(!isMeasurementMode)}
            >
              <Ruler className="size-3.5" />
              <span className="hidden md:inline">Measure</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Architectural Deep Dive Specs & Floor Schedule Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Active Room Overview Card */}
        <Card className="shadow-xs lg:col-span-8">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold sm:text-lg">
                  {getRoomIcon(currentRoom.id)}
                  <span>{currentRoom.badgeName}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentRoom.exposure} · {currentRoom.floor} · Verified Architectural Plan
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {currentRoom.area}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{currentRoom.description}</p>

            {/* Room Architectural Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-muted/40 space-y-1 rounded-lg border p-2.5 text-xs">
                <span className="text-muted-foreground block">Ceiling Height</span>
                <span className="text-foreground font-mono font-bold">{currentRoom.ceilingHeight}</span>
              </div>
              <div className="bg-muted/40 space-y-1 rounded-lg border p-2.5 text-xs">
                <span className="text-muted-foreground block">Floor Area</span>
                <span className="text-foreground font-mono font-bold">{currentRoom.area.split(' ')[0]} sq ft</span>
              </div>
              <div className="bg-muted/40 space-y-1 rounded-lg border p-2.5 text-xs">
                <span className="text-muted-foreground block">Solar Aspect</span>
                <span className="text-foreground font-semibold">{currentRoom.exposure.split(' ')[0]}</span>
              </div>
              <div className="bg-muted/40 space-y-1 rounded-lg border p-2.5 text-xs">
                <span className="text-muted-foreground block">Tour Hotspots</span>
                <span className="text-foreground font-mono font-bold">{currentRoom.hotspots.length} Viewpoints</span>
              </div>
            </div>

            {/* Feature Bullet List */}
            <div className="space-y-2 border-t pt-3">
              <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Finishes & Smart Building Integration
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {currentRoom.features.map((f, i) => (
                  <div key={i} className="bg-muted/20 flex items-start gap-2 rounded-md border p-2 text-xs">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                    <div>
                      <span className="text-muted-foreground font-medium">{f.label}: </span>
                      <span className="text-foreground font-semibold">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Penthouse Residence Quick Facts & Viewing Inquire Card */}
        <Card className="shadow-xs lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Residence 14B Specs</CardTitle>
            <CardDescription className="text-xs">The Evergreen Penthouse Collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Total Living Area</span>
                <span className="font-mono font-bold">2,270 sq ft (210.8 m²)</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Bedrooms / Baths</span>
                <span className="font-semibold">3 Bed · 3.5 Bath</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Private Outdoor Sky Deck</span>
                <span className="font-mono font-bold">540 sq ft (Level 15)</span>
              </div>
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Dedicated Valet EV Parking</span>
                <span className="font-semibold">2 Stalls (Level P1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly HOA & Concierge</span>
                <span className="font-mono font-bold">$1,840 / mo</span>
              </div>
            </div>

            <div className="bg-primary/5 border-primary/20 space-y-1 rounded-lg border p-3">
              <div className="text-primary flex items-center gap-1.5 font-semibold">
                <Sparkles className="size-3.5" />
                <span>Private VIP Walkthroughs</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                In-person appointments available Tuesdays & Thursdays by private broker registration.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full gap-2 text-xs font-semibold shadow-xs">
              <span>Schedule In-Person Penthouse Tour</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default VirtualTourPanorama

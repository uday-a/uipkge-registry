import Story from '../../components/story/Story'
import { HotelBookingReservation } from '@react-registry-blocks/hotel-booking-reservation/HotelBookingReservation'

export default function HotelBookingReservationDemo() {
  return (
    <>
      <Story
        title="Default Reservation"
        description="Standard 5-night stay at The Ritz-Carlton Bal Harbour, Miami with live date picker, guest steppers, upgrade checkboxes, and sticky instant price breakdown."
      >
        <HotelBookingReservation />
      </Story>

      <Story
        title="Weekend Getaway"
        description="3-night romantic weekend getaway preset with custom arrival dates and adult occupancy."
      >
        <HotelBookingReservation
          initialCheckIn="2026-08-28"
          initialCheckOut="2026-08-31"
          initialAdults={2}
          initialChildren={0}
          initialRooms={1}
        />
      </Story>

      <Story
        title="Family Vacation Multi-Suite"
        description="Family vacation booking with 2 adults, 2 children, and 2 connecting suites over a 7-night summer stay."
      >
        <HotelBookingReservation
          roomTitle="Two-Bedroom Oceanfront Family Residence"
          basePrice={780}
          initialCheckIn="2026-07-10"
          initialCheckOut="2026-07-17"
          initialAdults={2}
          initialChildren={2}
          initialRooms={2}
        />
      </Story>

      <Story
        title="Presidential Penthouse"
        description="High-tier presidential oceanfront penthouse with premium nightly rates and full VIP amenities."
      >
        <HotelBookingReservation
          roomTitle="The Grand Presidential Penthouse Suite"
          hotelName="The Ritz-Carlton Bal Harbour, Miami"
          location="Bal Harbour Top Floor, Miami Beach, FL"
          rating={5.0}
          reviewsCount={86}
          basePrice={1450}
          initialCheckIn="2026-09-01"
          initialCheckOut="2026-09-05"
          initialAdults={2}
          initialChildren={0}
          initialRooms={1}
        />
      </Story>
    </>
  )
}

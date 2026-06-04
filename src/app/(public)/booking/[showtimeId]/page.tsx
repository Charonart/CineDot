import { BookingSeatSelectionPageClient } from '@/modules/booking/components';

interface BookingShowtimePageProps {
  params: Promise<{
    showtimeId?: string;
  }>;
}

export default async function BookingShowtimePage({ params }: BookingShowtimePageProps) {
  const { showtimeId } = await params;
  return <BookingSeatSelectionPageClient showtimeId={showtimeId ?? ''} />;
}

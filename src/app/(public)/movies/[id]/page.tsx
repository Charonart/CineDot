import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPageLegacyRedirect({ params }: Props) {
  const { id } = await params;
  // Redirect legacy /movies/[id] requests to /movies/detail/[slug_or_id]
  redirect(`/movies/detail/${id}`);
}

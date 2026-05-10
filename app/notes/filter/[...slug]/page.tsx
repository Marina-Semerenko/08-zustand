import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: Props):
Promise<Metadata>  {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';
  const title = tag === 'all' ? 'All Notes' : `Notes tagged with "${tag}"`;
  return {
    title: `Notes - ${tag}`,
    description: `Viewing notes filtered by ${tag}`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Viewing notes filtered by ${tag}`,
      url: `https://notehub.app/notes/filter/${tag}`,
      images: [
        {url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 650,
        alt: title,
    }
      ],
    },
  };
}

export default async function Page({
  params }: Props) {
  const { slug } = await params;

    const tag = slug?.[0];
    
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tag],
      queryFn: () =>
          fetchNotes(1, tag === 'all' ? '' : tag ?? ''),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
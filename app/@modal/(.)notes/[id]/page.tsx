import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotePreview from './NotePreview.client';
import { fetchNoteById } from '@/lib/api';


interface Props {
    params: Promise<{ id: string }>;
}

export default async function ModalNotePage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
     await queryClient.prefetchQuery({
    queryKey: ['note', id ],
    queryFn: () => fetchNoteById(id),
  });
  } catch (e) {
    console.error('Prefetch error:', e);
  }

  return (
      <HydrationBoundary state={dehydrate(queryClient)}>
          
              <NotePreview id={id} /> 
          
    </HydrationBoundary>
  );
};
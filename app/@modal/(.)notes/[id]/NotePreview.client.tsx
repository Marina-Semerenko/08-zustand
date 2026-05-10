'use client';

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewProps {
    id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
    const router = useRouter();
    const handleClose = () =>  router.back();
    const { data, isLoading, isError } =
        useQuery({
            queryKey: ['note', id],
            queryFn: () => fetchNoteById(id),          
    })      

    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
             <button className={css.backBtn} onClick={close}>Close</button>   
             {isLoading &&  <p>Loading, please wait...</p>}
                {isError && <p>Error loading note.</p>}
                    {data && (
                        <div className={css.item}>
                            <div className={css.header}>
                            <h2>{data.title}</h2>
                            </div>                               
                            <p className={css.tag}>{data.tag}</p>
                            <p className={css.content}>{data.content}</p>
                            <p className={css.date}>{data.createdAt}</p>
                        </div>                
                   
                    )}
            </div>
        </Modal>
    )
    }
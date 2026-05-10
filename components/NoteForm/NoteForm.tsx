'use client';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import { createNote } from '@/lib/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { NoteTag } from '@/types/note';




export default function NoteForm() {

    const queryClient = useQueryClient();
    const { draft, setDraft, clearDraft } = useNoteStore();
    const router = useRouter();

    
    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            clearDraft();
            router.push("/notes/filter/all");
        }
    })

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        mutation.mutate(
            {
                title: draft.title,
                content: draft.content,
                tag: draft.tag as NoteTag,
            }
        )
    };
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        
        setDraft({
            ...draft,
            [event.target.name]: event.target.value
        });
    };
    
    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    value={draft.title}
                    onChange={ handleChange }
                    
                        />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    value={draft.content}
                    onChange={ handleChange }
                    
                        />
            </div>
            
            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={draft.tag}
                    onChange={ handleChange }
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>
            
            <div className={css.actions}>

                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={mutation.isPending}
                >
                    Create note
                </button>
                <button type="button"
                    className={css.cancelButton}
                    onClick={() => {
                        clearDraft();
                        router.back();
                    }}
                    disabled={mutation.isPending}
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
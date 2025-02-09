import Notes from "@/components/features/Notes";
import { fetchNotes } from "@/lib/actions/notesActions";

export default async function NotesPage() {
  const notes = await fetchNotes();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">My Notes</h1>
      <Notes initialNotes={notes} />
    </>
  );
}

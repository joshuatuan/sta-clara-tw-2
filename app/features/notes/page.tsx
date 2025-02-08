import Notes from "@/components/features/Notes";
import { fetchNotes } from "@/lib/actions/notesActions";

export default async function NotesPage() {
  const notes = await fetchNotes();

  console.log("notes: ", notes);

  return (
    <div>
      <Notes initialNotes={notes} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { upsertNote } from "@/lib/actions/notesActions";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
import { type Notes as NotesType } from "@/app/types/globals";

export default function Notes({
  initialNotes,
}: {
  initialNotes: NotesType | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes?.content ?? "");
  const [tempNotes, setTempNotes] = useState(notes);
  const router = useRouter();

  const isNotesEmpty = notes.trim() === "";

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await upsertNote(tempNotes);
    setNotes(tempNotes);
    setIsEditing(false);
    router.refresh();
  };

  const handleCancel = () => {
    setTempNotes(notes); // sets it back to the original note, prior cancel
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">My Notes</h1>
      <div className="space-y-4">
        {isEditing ? (
          <form className="space-y-2" onSubmit={handleSave}>
            <p className="text-sm italic text-muted-foreground">
              Editing in markdown mode
            </p>
            <Textarea
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              rows={10}
              name="notes"
              placeholder="Enter notes"
              className="mb-6"
            />
            <div className="flex justify-end space-x-2">
              <Button>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            {!isNotesEmpty && (
              <div className="prose prose-sm rounded-md border p-2 dark:prose-invert md:prose-base">
                <Markdown>{notes}</Markdown>
              </div>
            )}

            <Button variant="outline" onClick={() => setIsEditing(true)}>
              {isNotesEmpty ? "Create Note" : "Edit Notes"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

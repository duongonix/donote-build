<script>
  import NoteDB from "$lib/lib/note-db";
  import {
    ChevronLeft,
    CirclePlus,
    Trash,
    ArchiveRestore,
  } from "lucide-svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index";

  let notes = $state(null);
  let isDel = $state(null);
  let isDelAll = $state(false);

  $effect(async () => {
    notes = await NoteDB.getTrashNotes();
  });

  NoteDB.onc(async () => {
    notes = await NoteDB.getTrashNotes();
  });

  const onRestoreNote = async (id) => {
    await NoteDB.editNote(id, { trash: false });
  };

  const onRemoveNote = async () => {
    await NoteDB.deleteNoteById(isDel);
    isDel = null;
  };

  const onRemoveAllNotes = async () => {
    for(const note of notes){
      await NoteDB.deleteNoteById(note.id)
    }

    isDelAll = false
  }
</script>

<div class="">
  <div class="w-full">
    <div class="border-b flex items-center justify-between p-3 text-gray-400">
      <a href="/" class="flex items-center space-x-2 text-xs"
        ><ChevronLeft size={16} /> Back</a>
      <div class="text-lg text-gray-300 font-bold">Trash</div>

      <button onclick={() => isDelAll = true} class="text-red-500 text-xs font-bold">Delete All</button>
    </div>

    <div class="max-w-[500px] w-full mx-auto p-4">
      <div class="space-y-3">
        {#each notes as note (note.id)}
          <div class="flex items-center space-x-2">
            <div class="bg-gray-800 rounded-sm p-2 flex-1">{note.title}</div>
            <button
              onclick={() => onRestoreNote(note.id)}
              class="bg-green-500 hover:bg-green-600 p-2 rounded-sm"
              ><ArchiveRestore /></button>
            <button
              onclick={() => (isDel = note.id)}
              class="bg-red-500 hover:bg-red-600 p-2 rounded-sm"
              ><Trash /></button>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<Dialog.Root open={isDel == null ? false : true}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete</Dialog.Title>
      <Dialog.Description>Are you sure delete this note ?.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button onclick={() => (isDel = null)} variant="outline" type="submit"
        >Cannel</Button
      ><Button onclick={onRemoveNote} variant="destructive">Yes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root open={isDelAll}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete All</Dialog.Title>
      <Dialog.Description>Are you sure delete all notes ?.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button onclick={() => (isDelAll = false)} variant="outline" type="submit"
        >Cannel</Button
      ><Button onclick={onRemoveAllNotes} variant="destructive">Yes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

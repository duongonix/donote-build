<script>
  import { goto } from "$app/navigation";
  import NoteDB from "$lib/lib/note-db";
  import { sidebarOpen } from "$lib/store/app-store";
  import { formatTime } from "$lib/utils";

  import {
    TextAlignStart,
    SquarePen,
    X,
    Search,
    Tag,
    Pin,
  } from "lucide-svelte";

  const { noteId, route = null } = $props();

  let notes = $state([]);
  let allNotes = [];
  let header = $state("");

  // tương đương useEffect(() => {...}, [])
  $effect(async () => {
    if (route === "pin") {
      notes = await NoteDB.getPinnedNotes();
      header = "Pin Notes";
    } else {
      notes = await NoteDB.getAllNotes();
      header = "All Notes";
    }
  });

  NoteDB.onc(async (c) => {
    notes = await NoteDB.getAllNotes();
    allNotes = [...notes];
  });

  const onSearch = async (e) => {
    const q = e.target.value;
    notes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );

    if (q == "") {
      if (route === "pin") {
        notes = await NoteDB.getPinnedNotes();
      } else {
        notes = await NoteDB.getAllNotes();
      }
    }
  };
</script>

<div
  class="w-86 max-lg:w-full h-full overflow-hidden border-r border-[#27272a]">
  <!-- Header -->
  <div
    class="flex items-center justify-between text-gray-400 p-4 border-b border-[#27272a]">
    <button class="sm:hidden" onclick={() => ($sidebarOpen = !$sidebarOpen)}>
      {#if $sidebarOpen}
        <X size={16} />
      {:else}
        <TextAlignStart size={16} />
      {/if}
    </button>
    <span class="text-sm font-semibold text-gray-300">{header}</span>
    <a href="/note/new">
      <SquarePen size={16} />
    </a>
  </div>

  <!-- Search -->
  <div class="px-2 border-b border-[#27272a] flex items-center space-x-2">
    <Search size={16} />
    <input
      oninput={onSearch}
      class="p-2 w-full outline-0"
      type="text"
      placeholder="Search ..." />
  </div>

  <!-- Notes list -->
  <div class="overflow-auto flex-1 h-[calc(100vh-130px)] scrollbar-custom">
    <div class="columns-2 gap-2 p-2">
      {#each notes as note (note.id)}
        <a href="/note/{note.id}">
          <div
            style={`border: 1px solid ${note.color}; border-radius: 8px;`}
            class="mb-2 break-inside-avoid p-4 border-2 rounded-sm hover:bg-[#25292d] {note.id ===
            noteId
              ? 'bg-[#26282a]'
              : ''}">
            <h1 class="truncate">{note.title}</h1>
            <div class="text-gray-400 text-xs mt-1 mb-3 overflow-x-hidden">
              {note.content.length < 100
                ? note.content
                : note.content.slice(0, 100) + "..."}
            </div>
            <div
              class="flex items-center justify-between space-x-2 text-gray-300">
              <div class="text-[10px]">{formatTime(note.createdAt)}</div>
              <div class="flex items-center space-x-1">
                {#if note.tag}
                  <Tag size={13} />
                  <span class="text-xs">{note.tag}</span>
                {/if}
                {#if note.pin}
                  <Pin class="text-red-600" size={13} />
                {/if}
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>

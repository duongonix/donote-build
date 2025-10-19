<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { marked } from "marked";

  import NoteDB from "$lib/lib/note-db";
  import TagDB from "$lib/lib/tag-db";

  import ListNote from "$lib/components/layout/list-note.svelte";

  import * as Popover from "$lib/components/ui/popover";

  import {
    CircleQuestionMark,
    Ellipsis,
    Save,
    Eye,
    Pen,
    ChevronLeft,
    Trash,
    Tag,
    Camera,
    Link as LinkI,
    List,
  } from "lucide-svelte";

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import { Switch } from "$lib/components/ui/switch";
  import * as Select from "$lib/components/ui/select";

  import { toast } from "svelte-sonner";

  let noteId = $derived($page.params.id);
  let note = $state({});
  let ismd = $state(false);
  let pin = $derived(note.pin);

  let tags = $state(null);
  let tag = $state("");

  const onSave = async () => {
    if (noteId === "new") {
      const { id } = await NoteDB.addNote(note.title, note.content);
      goto("/note/" + id);
    } else {
      NoteDB.editNote(noteId, {
        title: note.title,
        content: note.content,
        tag: tag == "All" ? null : tag,
      });
    }
    toast.success("Note saved successfully !.");
  };

  const toggleMD = () => (ismd = !ismd);

  const onPin = async () => {
    if (noteId != "new") {
      pin = !pin;

      await NoteDB.editNote(noteId, {
        pin,
      });
    }
  };

  const onToTrash = async () => {
    if (noteId != "new") {
      await NoteDB.editNote(noteId, {
        trash: true,
      });

      goto("/");
    }
  };

  $effect(async () => {
    if (noteId === "new") {
      note.title = "",
      note.content = ""
      tag = "All";

      return
    }

    const n = await NoteDB.getNoteById(noteId);
    tags = await TagDB.getAllTags();

    if (n) {
      note = n;
      tag = note.tag || "All";
    }
  });

  $effect(async () => {
    if (tag != "All") await NoteDB.editNote(noteId, { tag });
    if(noteId != "new"){
      note = await NoteDB.getNoteById(noteId);
    }
  });
</script>

<div class="flex h-full w-full">
  <!-- Sidebar -->
  <div class="max-lg:hidden">
    <ListNote noteId={noteId} />
  </div>

  <!-- Main -->
  <div class="flex flex-col w-full">
    <div
      class="flex items-center justify-between text-gray-400 p-[14px] border-b border-[#27272a]">
      <a href="/">
        <button class="lg:hidden flex items-center">
          <ChevronLeft size={16} />
          <span class="text-xs">Back</span>
        </button>
      </a>

      <div class="space-x-4">
        <button onclick={onSave}><Save size={16} /></button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button><Ellipsis size={16} /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-64 mr-4">
            <DropdownMenuGroup>
              <DropdownMenuItem onclick={onPin}>
                <span>Pin to top</span>
                <DropdownMenuShortcut>
                  <Switch class="h-5 w-8" id="pin" checked={pin} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onclick={onToTrash} class="text-red-500">
                <span>Move to trash</span>
                <DropdownMenuShortcut><Trash /></DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <button><CircleQuestionMark size={16} /></button>
      </div>
    </div>

    <div class="flex-1 flex flex-col relative">
      <div class="flex items-center justify-between p-3 text-gray-400">
        <div class="text-xs font-semibold">
          {#if note}
            {new Date(
              noteId === "new" ? Date.now() : note.createdAt,
            ).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          {/if}
        </div>
        <div class="flex items-center space-x-2">
          <Tag size={16} />
          <span class="font-semibold">{note ? note.tag : tag}</span>
        </div>
      </div>

      <div class="p-2">
        <input
          bind:value={note.title}
          class="outline-0 w-full p-2 text-3xl"
          type="text"
          placeholder="Type title ..." />
      </div>

      <div class="overflow-hidden flex-1 flex flex-col p-2">
        {#if ismd}
          <div
            class="pb-20 h-[calc(100vh-220px)] overflow-auto scrollbar-custom p-2">
            {@html marked(note.content)}
          </div>
        {:else}
          <textarea
            bind:value={note.content}
            class="pb-15 resize-none scrollbar-custom outline-0 w-full h-full p-2"
            placeholder="Type content ..."></textarea>
        {/if}
      </div>

      <div class="absolute bottom-0 left-0 flex justify-center p-3 w-full">
        <div
          class="w-[90%] max-w-70 bg-black rounded-full flex items-center justify-around py-1">
          <button class="p-3 rounded-full bg-[#171C1F]"><Camera /></button>
          <button onclick={toggleMD} class="p-3 rounded-full bg-[#171C1F]">
            {#if ismd}
              <Pen />
            {:else}
              <Eye />
            {/if}
          </button>

          <button class="p-3 rounded-full bg-[#171C1F]"><LinkI /></button>
          <button class="p-3 rounded-full bg-[#171C1F]"><List /></button>
          <Popover.Root>
            <Popover.Trigger>
              <button class="p-3 rounded-full bg-[#171C1F]"><Tag /></button>
            </Popover.Trigger>
            <Popover.Content class="w-60 mb-2">
              <Select.Root type="single" name="tag" bind:value={tag}>
                <Select.Trigger class="w-full">
                  {tag}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Tags</Select.Label>
                    {#each tags as tag (tag.id)}
                      <Select.Item value={tag.name} label={tag.name}>
                        {tag.name}
                      </Select.Item>
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import TagDB from "$lib/lib/tag-db";
  import { ChevronLeft, CirclePlus, Trash } from "lucide-svelte";

  import { Button, buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index";

  let tags = $state(null);
  let name = $state("")

  $effect(async () => {
    tags = await TagDB.getAllTags();
  });

  TagDB.onc(async () => {
    tags = await TagDB.getAllTags();
  });


  const onAddTag = async () => {
    await TagDB.addTag(name)
    name = ""
  }
  
  const onRemoveTag = async id => {
    await TagDB.deleteTagById(id)
  }
</script>

<div class="">
  <div class="w-full">
    <div class="border-b flex items-center justify-between p-3 text-gray-400">
      <a href="/" class="flex items-center space-x-2 text-xs"
        ><ChevronLeft size={16} /> Back</a>
      <div class="text-lg text-gray-300 font-bold">Tags</div>
      

      <Dialog.Root>
        <Dialog.Trigger><button><CirclePlus /></button></Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title>Add Tag</Dialog.Title>
            <Dialog.Description>
            </Dialog.Description>
          </Dialog.Header>
          <div class="grid gap-4 py-4">
            <input bind:value={name} type="text" placeholder="Type name tag ..." class="w-full p-2 outline-0 border-2 border-border rounded-lg">
          </div>
          <Dialog.Footer>
            <Dialog.Close><Button onclick={() => (name = "")} variant="outline" type="submit">Cannel</Button></Dialog.Close>
            <Dialog.Close><Button onclick={onAddTag} type="submit">Add</Button></Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>

    <div class="max-w-[500px] w-full mx-auto p-4">
      <div class="space-y-3">
        <div class="bg-gray-800 rounded-sm p-2">All</div>

        {#each tags as tag (tag.id)}
          <div class="flex items-center space-x-2">
            <div class="bg-gray-800 rounded-sm p-2 flex-1">{tag.name}</div>
            <button onclick={() => onRemoveTag(tag.id)} class="bg-red-500 hover:bg-red-600 p-2 rounded-sm"><Trash /></button>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

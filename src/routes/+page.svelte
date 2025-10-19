<script>
  import { page } from "$app/stores";
  import { derived } from "svelte/store";

  import ListNote from "$lib/components/layout/list-note.svelte";

  // Lấy pathname từ page store
  const pathname = derived(page, ($page) => $page.url.pathname);

</script>

<div class="flex h-full w-full">
  <!-- ListNote -->

  <div class="{$pathname.startsWith('/note/') ? "hidden lg:flex" : "flex"} flex-col max-lg:w-full">
    <ListNote />
  </div>
</div>

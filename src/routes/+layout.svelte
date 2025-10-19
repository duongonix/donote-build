<script>
  import "../app.css";

  import { platform } from "@tauri-apps/plugin-os";

  import { Toaster } from "$lib/components/ui/sonner";

  import Titlebar from "$lib/components/layout/titlebar.svelte";

  import Menu from "$lib/components/layout/menu.svelte";
  import { sidebarOpen } from "$lib/store/app-store";

  import { afterNavigate } from "$app/navigation";

  afterNavigate(() => {
    $sidebarOpen = false;
  });

  let { children } = $props();
</script>

<div class="fixed h-full w-full top-0 left-0 flex flex-col">
  {#if platform() === "windows" || platform() === "macos" || platform() === "linux"}
    <Titlebar />
  {/if}

  <main class="flex-1 flex">
    <Menu />
    <div class="min-w-[340px] w-full">
      {@render children?.()}
    </div>
  </main>
  <Toaster richColors />
</div>

<script>
  import { getCurrentWindow } from "@tauri-apps/api/window"
</script>

<div
  class="flex p-2.5 items-center justify-between drag border-b border-[#27272a]"
>
  <div class="flex flex-row space-x-2 no-drag">
    <button
      title="close"
      onclick={() => getCurrentWindow().close()}
      class="h-3 w-3 rounded-full bg-red-500"
    ></button>
    <button
      title="toggle"
      onclick={() => getCurrentWindow().toggleMaximize()}
      class="h-3 w-3 rounded-full bg-orange-400"
    ></button>
    <button
      title="minimize"
      onclick={() => getCurrentWindow().minimize()}
      class="h-3 w-3 rounded-full bg-green-400"
    ></button>
  </div>
</div>

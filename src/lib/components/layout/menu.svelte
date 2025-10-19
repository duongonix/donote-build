<script>
  import { page } from "$app/stores"
  import { sidebarOpen } from "$lib/store/app-store"
  import {
    FileText,
    Bell,
    Settings,
    Tag,
    HelpCircle,
    Trash2,
    ChevronRight,
    Pin
  } from "lucide-svelte"

  const mainItems = [
    { id: 1, name: "All Notes", icon: FileText, path: "/" },
    { id: 2, name: "Pined", icon: Pin, path: "/pin" },
    { id: 3, name: "All Tags", icon: Tag, path: "/tag" },
    { id: 4, name: "Notifications", icon: Bell, path: "/notif" },
    { id: 5, name: "Settings", icon: Settings, path: "/setting" },
    { id: 6, name: "Help & Support", icon: HelpCircle, path: "/help" },
    { id: 7, name: "Trash", icon: Trash2, path: "/trash" },
  ]
</script>

<div
  class={`transition-all duration-300 min-w-[200px] h-full border-r border-[#27272a] flex flex-col justify-between bg-[#1E2327] p-3 sm:ml-0
    ${$sidebarOpen ? 'ml-0' : 'ml-[-200px]'}
  `}
>
  <div class="text-gray-400 font-semibold space-y-1">
    {#each mainItems as item}
      {@const Icon = item.icon}

      <a
        href={item.path}
        class={`flex items-center p-1.5 hover:bg-[#353E45] rounded cursor-pointer
          ${
            (item.path === '/' && ($page.url.pathname === '/' || $page.url.pathname.startsWith('/note/')))
              || $page.url.pathname === item.path
              ? 'bg-[#353E45]'
              : ''
          }
        `}
      >
        <Icon class="w-4 h-4 mr-2" />
        <span class="text-xs">{item.name}</span>
      </a>
    {/each}
  </div>

  <div class="p-2">
    <span class="text-xs">Donote @2025</span>
  </div>
</div>

import { LazyStore } from "@tauri-apps/plugin-store"
import { nanoid } from "nanoid"

const noteStore = new LazyStore("notes.json")

export default new class NoteDB {
  onc(c) {
    noteStore.onChange((changes) => {
      c(changes)
    })
  }
  async addNote(title, content) {
    const colors = [
      "#fecaca", "#fca5a5", "#f87171",
      "#bbf7d0", "#86efac", "#4ade80",
      "#bfdbfe", "#93c5fd", "#60a5fa",
      "#fef08a", "#fde047", "#facc15",
      "#e9d5ff", "#d8b4fe", "#c084fc",
      "#fbcfe8", "#f9a8d4", "#f472b6",
      "#fed7aa", "#fdba74", "#fb923c",
      "#99f6e4", "#5eead4", "#2dd4bf",
      "#a5f3fc", "#67e8f9", "#22d3ee",
      "#c7d2fe", "#a5b4fc", "#818cf8"
    ]


    // Nếu không có id → tạo mới
    const noteId = nanoid()

    const note = {
      title,
      content,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: Date.now(),
    }

    await noteStore.set(noteId, note)
    await noteStore.save()

    return { id: noteId, ...note }
  }

  async getAllNotes() {
    const entries = await noteStore.entries() // [ [id, note], ... ]

    const notes = entries
      .filter(([_, note]) => !note.trash) // bỏ qua note có trash:true
      .map(([id, note]) => ({ id, ...note }))
      .sort((a, b) => {
        // 1️⃣ note pin:true lên đầu
        if (a.pin && !b.pin) return -1
        if (!a.pin && b.pin) return 1
        // 2️⃣ nếu cùng pin trạng thái, sort theo createdAt giảm dần
        return b.createdAt - a.createdAt
      })

    return notes
  }

  async getPinnedNotes() {
    const entries = await noteStore.entries() // [ [id, note], ... ]

    const pinnedNotes = entries
      .filter(([_, note]) => !note.trash && note.pin) // chỉ note chưa trash và pin:true
      .map(([id, note]) => ({ id, ...note }))
      .sort((a, b) => b.createdAt - a.createdAt) // mới nhất lên đầu

    return pinnedNotes
  }

  async getTrashNotes() {
    const entries = await noteStore.entries() // [ [id, note], ... ]

    const pinnedNotes = entries
      .filter(([_, note]) => note.trash) // chỉ note chưa trash và pin:true
      .map(([id, note]) => ({ id, ...note }))
      .sort((a, b) => b.createdAt - a.createdAt) // mới nhất lên đầu

    return pinnedNotes
  }



  async getNoteById(id) {
    const note = await noteStore.get(id)
    if (!note) return null
    return { id, ...note }
  }

  async editNote(id, fields) {
    const existing = await noteStore.get(id)
    if (!existing) return null

    const updatedNote = {
      ...existing,
      ...fields,
      updatedAt: Date.now(), // optional
    }

    await noteStore.set(id, updatedNote)
    await noteStore.save()

    return { id, ...updatedNote }
  }

  async deleteNoteById(id) {
    const exists = await noteStore.has(id)
    if (!exists) {
      throw new Error(`Note with id "${id}" not found`)
    }

    await noteStore.delete(id)
    await noteStore.save()
    return true
  }

}
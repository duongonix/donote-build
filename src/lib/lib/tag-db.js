import { LazyStore } from "@tauri-apps/plugin-store"
import { nanoid } from "nanoid"

import NoteDB from "./note-db"

const noteStore = new LazyStore("tags.json")

export default new class TagDB {
  onc(c) {
    noteStore.onChange((changes) => {
      c(changes)
    })
  }

  async getAllTags() {
    const entries = await noteStore.entries() // [ [id, note], ... ]

    // lọc bỏ note có trash: true, sau đó map và sort theo createdAt giảm dần
    const notes = entries
      .map(([id, note]) => ({ id, ...note }))
      .sort((a, b) => b.createdAt - a.createdAt)

    return notes
  }

  async addTag(name) {
    const noteId = nanoid()

    const note = {
      name,
      createdAt: Date.now(),
    }

    await noteStore.set(noteId, note)
    await noteStore.save()

    return { id: noteId, ...note }
  }

  async getTagById(id) {
    const note = await noteStore.get(id)
    if (!note) return null
    return { id, ...note }
  }

  async deleteTagById(id) {
    const exists = await noteStore.has(id)
    const tag = await this.getTagById(id)
    const notes = await NoteDB.getAllNotes()

    if (!exists) {
      throw new Error(`Tag with id "${id}" not found`)
    }

    await noteStore.delete(id)
    await noteStore.save()

    for(var note of notes){
      if(note.tag === tag.name){
        NoteDB.editNote(note.id, { tag: null })
      }
    }
    return true
  }
}
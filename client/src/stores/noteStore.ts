import { create } from 'zustand';
import type { Note } from '../types';
import { noteService } from '../services/noteService';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: (params?: { search?: string; tag?: string }) => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const notes = await noteService.getAll(params);
      set({ notes, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch notes', isLoading: false });
    }
  },

  createNote: async (note) => {
    try {
      const newNote = await noteService.create(note);
      set((state) => ({ notes: [newNote, ...state.notes] }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create note');
    }
  },

  updateNote: async (id, updates) => {
    try {
      const updated = await noteService.update(id, updates);
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? updated : n)),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update note');
    }
  },

  deleteNote: async (id) => {
    try {
      await noteService.delete(id);
      set((state) => ({ notes: state.notes.filter((n) => n._id !== id) }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete note');
    }
  },
}));

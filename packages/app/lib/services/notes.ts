import { supabase } from '../supabase'

// Note type based on the database schema
export interface Note {
  id: string
  name: string
  subject: string
  branch: string
  year: string
  semester: string
  price: number
  pdfUrl: string[] // Array of PDF URLs to match existing interface
  isPurchased?: boolean // Whether the current user has purchased this note
  createdAt?: string
  updated_at?: string
}

// Response type for API calls
export interface NotesResponse {
  data: Note[] | null
  error: string | null
  loading: boolean
}

// Helper function to transform database note to app note format
const transformNote = (dbNote: any): Note => {
  return {
    ...dbNote,
    pdfUrl: dbNote.pdfUrl ? [dbNote.pdfUrl] : [], // Convert single URL to array
    isPurchased: !!dbNote.purchase_id // Convert purchase_id existence to boolean
  }
}

// Fetch all notes with purchase status for current user
export const fetchNotes = async (): Promise<{ data: Note[] | null; error: string | null }> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        purchases!left(id)
      `)
      .eq('purchases.user_id', user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return { data: null, error: error.message }
    }

    // Transform the data to include purchase status
    const transformedData = data?.map(note => ({
      ...transformNote(note),
      isPurchased: note.purchases && note.purchases.length > 0
    })) || []
    
    return { data: transformedData, error: null }
  } catch (err) {
    console.error('Unexpected error fetching notes:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Search notes by query (searches in name, subject, branch)
export const searchNotes = async (query: string): Promise<{ data: Note[] | null; error: string | null }> => {
  try {
    if (!query.trim()) {
      return await fetchNotes()
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .or(`name.ilike.%${query}%,subject.ilike.%${query}%,branch.ilike.%${query}%`)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error searching notes:', error)
      return { data: null, error: error.message }
    }

    const transformedData = data?.map(transformNote) || []
    return { data: transformedData, error: null }
  } catch (err) {
    console.error('Unexpected error searching notes:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Filter notes by subject
export const filterNotesBySubject = async (subject: string): Promise<{ data: Note[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('subject', subject)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering notes by subject:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Note[], error: null }
  } catch (err) {
    console.error('Unexpected error filtering notes:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Filter notes by branch
export const filterNotesByBranch = async (branch: string): Promise<{ data: Note[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('branch', branch)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering notes by branch:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Note[], error: null }
  } catch (err) {
    console.error('Unexpected error filtering notes:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Get note by ID
export const getNoteById = async (id: string): Promise<{ data: Note | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching note by ID:', error)
      return { data: null, error: error.message }
    }

    return { data: data as Note, error: null }
  } catch (err) {
    console.error('Unexpected error fetching note:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Get unique subjects for filtering
export const getUniqueSubjects = async (): Promise<{ data: string[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('subject')
      .order('subject')

    if (error) {
      console.error('Error fetching subjects:', error)
      return { data: null, error: error.message }
    }

    // Extract unique subjects
    const uniqueSubjects = [...new Set(data.map(item => item.subject))]
    return { data: uniqueSubjects, error: null }
  } catch (err) {
    console.error('Unexpected error fetching subjects:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

// Get unique branches for filtering
export const getUniqueBranches = async (): Promise<{ data: string[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('branch')
      .order('branch')

    if (error) {
      console.error('Error fetching branches:', error)
      return { data: null, error: error.message }
    }

    // Extract unique branches
    const uniqueBranches = [...new Set(data.map(item => item.branch))]
    return { data: uniqueBranches, error: null }
  } catch (err) {
    console.error('Unexpected error fetching branches:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}
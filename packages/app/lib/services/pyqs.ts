import { supabase } from '../supabase'

// PYQ interface matching the database structure
export interface PYQ {
  id: string
  name: string
  subject: string
  branch: string
  year: string
  semester: string
  pdfUrl: string // Single string, not array
  createdAt?: string
}

// Response type for API calls
export interface PYQsResponse {
  data: PYQ[] | null
  error: any
}

/**
 * Fetch all PYQs from the database
 */
export async function fetchPYQs(): Promise<PYQsResponse> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching PYQs:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching PYQs:', error)
    return { data: null, error }
  }
}

/**
 * Search PYQs by query (name, subject, branch)
 */
export async function searchPYQs(query: string): Promise<PYQsResponse> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('*')
      .or(`name.ilike.%${query}%,subject.ilike.%${query}%,branch.ilike.%${query}%`)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error searching PYQs:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error searching PYQs:', error)
    return { data: null, error }
  }
}

/**
 * Filter PYQs by subject
 */
export async function filterPYQsBySubject(subject: string): Promise<PYQsResponse> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('*')
      .eq('subject', subject)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering PYQs by subject:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error filtering PYQs by subject:', error)
    return { data: null, error }
  }
}

/**
 * Filter PYQs by branch
 */
export async function filterPYQsByBranch(branch: string): Promise<PYQsResponse> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('*')
      .eq('branch', branch)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering PYQs by branch:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error filtering PYQs by branch:', error)
    return { data: null, error }
  }
}

/**
 * Get a single PYQ by ID
 */
export async function getPYQById(id: string): Promise<{ data: PYQ | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching PYQ by ID:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching PYQ by ID:', error)
    return { data: null, error }
  }
}

/**
 * Get unique subjects for filtering
 */
export async function getUniqueSubjects(): Promise<{ data: string[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('subject')
      .order('subject')

    if (error) {
      console.error('Error fetching unique subjects:', error)
      return { data: null, error }
    }

    const uniqueSubjects = [...new Set(data?.map(item => item.subject) || [])]
    return { data: uniqueSubjects, error: null }
  } catch (error) {
    console.error('Unexpected error fetching unique subjects:', error)
    return { data: null, error }
  }
}

/**
 * Get unique branches for filtering
 */
export async function getUniqueBranches(): Promise<{ data: string[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pyqs')
      .select('branch')
      .order('branch')

    if (error) {
      console.error('Error fetching unique branches:', error)
      return { data: null, error }
    }

    const uniqueBranches = [...new Set(data?.map(item => item.branch) || [])]
    return { data: uniqueBranches, error: null }
  } catch (error) {
    console.error('Unexpected error fetching unique branches:', error)
    return { data: null, error }
  }
}
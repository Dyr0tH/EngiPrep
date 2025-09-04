import { supabase } from '../supabase'

// QuestionBank interface matching the database structure
export interface QuestionBank {
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
export interface QuestionBanksResponse {
  data: QuestionBank[] | null
  error: any
}

/**
 * Fetch all Question Banks from the database
 */
export async function fetchQuestionBanks(): Promise<QuestionBanksResponse> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching Question Banks:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching Question Banks:', error)
    return { data: null, error }
  }
}

/**
 * Search Question Banks by query (name, subject, branch)
 */
export async function searchQuestionBanks(query: string): Promise<QuestionBanksResponse> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
      .select('*')
      .or(`name.ilike.%${query}%,subject.ilike.%${query}%,branch.ilike.%${query}%`)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error searching Question Banks:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error searching Question Banks:', error)
    return { data: null, error }
  }
}

/**
 * Filter Question Banks by subject
 */
export async function filterQuestionBanksBySubject(subject: string): Promise<QuestionBanksResponse> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
      .select('*')
      .eq('subject', subject)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering Question Banks by subject:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error filtering Question Banks by subject:', error)
    return { data: null, error }
  }
}

/**
 * Filter Question Banks by branch
 */
export async function filterQuestionBanksByBranch(branch: string): Promise<QuestionBanksResponse> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
      .select('*')
      .eq('branch', branch)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error filtering Question Banks by branch:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error filtering Question Banks by branch:', error)
    return { data: null, error }
  }
}

/**
 * Get a single Question Bank by ID
 */
export async function getQuestionBankById(id: string): Promise<{ data: QuestionBank | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching Question Bank by ID:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching Question Bank by ID:', error)
    return { data: null, error }
  }
}

/**
 * Get unique subjects for filtering
 */
export async function getUniqueSubjects(): Promise<{ data: string[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('question_banks')
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
      .from('question_banks')
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
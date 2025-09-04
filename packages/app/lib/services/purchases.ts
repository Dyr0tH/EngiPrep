import { supabase } from '../supabase'

// Purchase interface matching the database structure
export interface Purchase {
  id: string
  user_id: string
  note_id: string
  purchase_price: number
  created_at?: string
}

// Purchase with note data for purchases screen
export interface PurchaseWithNote {
  id: string
  user_id: string
  note_id: string
  purchase_price: number
  created_at: string
  notes: {
    id: string
    name: string
    subject: string
    branch: string
    year: string
    semester: string
    price: number
    pdfUrl: string[]
  }
}

// Response type for API calls
export interface PurchaseResponse {
  data: Purchase | null
  error: any
}

export interface PurchasesResponse {
  data: Purchase[] | null
  error: any
}

export interface PurchasesWithNotesResponse {
  data: PurchaseWithNote[] | null
  error: any
}

/**
 * Create a new purchase record
 */
export async function createPurchase(
  noteId: string,
  purchasePrice: number
): Promise<PurchaseResponse> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { data: null, error: 'User not authenticated' }
    }

    // Create the purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        note_id: noteId,
        purchase_price: purchasePrice
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating purchase:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error creating purchase:', error)
    return { data: null, error }
  }
}

/**
 * Fetch all purchases for the current user
 */
export async function fetchUserPurchases(): Promise<PurchasesResponse> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user purchases:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching user purchases:', error)
    return { data: null, error }
  }
}

/**
 * Fetch user purchases with note details for purchases screen
 */
export async function fetchUserPurchasesWithNotes(): Promise<PurchasesWithNotesResponse> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        notes (
          id,
          name,
          subject,
          branch,
          year,
          semester,
          price,
          pdfUrl
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user purchases with notes:', error)
      return { data: null, error }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching user purchases with notes:', error)
    return { data: null, error }
  }
}

/**
 * Check if user has already purchased a specific note
 */
export async function checkIfPurchased(noteId: string): Promise<{ purchased: boolean; error: any }> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { purchased: false, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('note_id', noteId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking purchase status:', error)
      return { purchased: false, error }
    }

    return { purchased: !!data, error: null }
  } catch (error) {
    console.error('Unexpected error checking purchase status:', error)
    return { purchased: false, error }
  }
}

/**
 * Get purchase details by ID
 */
export async function getPurchaseById(purchaseId: string): Promise<PurchaseResponse> {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        notes (
          id,
          name,
          subject,
          branch,
          year,
          semester,
          price,
          pdfUrl
        )
      `)
      .eq('id', purchaseId)
      .single()

    if (error) {
      console.error('Error fetching purchase by ID:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching purchase by ID:', error)
    return { data: null, error }
  }
}
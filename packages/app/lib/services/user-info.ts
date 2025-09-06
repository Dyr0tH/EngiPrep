import { supabase } from '../supabase'

// UserInfo interface matching the database structure
export interface UserInfo {
  id: string
  name: string
  email: string
  collegeName: string
  semester: string
  created_at?: string
  updated_at?: string
}

// Response type for API calls
export interface UserInfoResponse {
  data: UserInfo | null
  error: any
}

/**
 * Fetch current user's info from user_info table
 */
export async function fetchUserInfo(): Promise<UserInfoResponse> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user info:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching user info:', error)
    return { data: null, error }
  }
}

/**
 * Update current user's info in user_info table
 */
export async function updateUserInfo(
  name: string,
  collegeName: string,
  semester: string
): Promise<UserInfoResponse> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return { data: null, error: 'User not authenticated' }
    }

    const { data, error } = await supabase
      .from('user_info')
      .update({
        name,
        collegeName,
        semester,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user info:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error updating user info:', error)
    return { data: null, error }
  }
}
import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { YStack, Spinner } from '@my/ui'
import { getSession } from 'app/lib/supabase'

export default function Screen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [router])

  const checkAuthStatus = async () => {
    try {
      const { session, error } = await getSession()
      
      if (error) {
        console.error('Error checking session:', error)
        router.replace('/auth/sign-in')
        return
      }
      
      if (session?.user) {
        // User is authenticated, redirect to notes tab
        router.replace('/(tabs)/notes')
      } else {
        // User is not authenticated, redirect to sign-in
        router.replace('/auth/sign-in')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      router.replace('/auth/sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'EngiPrep',
          headerShown: false,
        }}
      />
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
      </YStack>
    </>
  )
}

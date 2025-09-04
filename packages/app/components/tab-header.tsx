import { YStack, XStack, H2, Button } from '@my/ui'
import { Plus, Search, Filter, PersonStanding, User, User2, LogOut } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { signOut } from '../lib/supabase'

interface TabHeaderProps {
  page_name: string
}

export function TabHeader({ page_name }: TabHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Logout error:', error)
        return
      }
      // Navigate to sign-in screen after successful logout
      router.replace('/auth/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <YStack p="$4" bg="black" borderBottomWidth={1} borderBottomColor="$borderColor">
      <XStack alignItems="center" justifyContent="space-between">
        <H2 color="white">{page_name}</H2>
        <XStack gap="$2">
          <Button size="$3" circular icon={User2} />
          <Button size="$3" circular icon={LogOut} onPress={handleLogout} />
        </XStack>
      </XStack>
    </YStack>
  )
}
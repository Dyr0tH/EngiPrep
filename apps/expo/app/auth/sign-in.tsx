import { SignInScreen } from 'app/features/auth/sign-in-screen'
import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SignInScreen />
      </ScrollView>
    </>
  )
}
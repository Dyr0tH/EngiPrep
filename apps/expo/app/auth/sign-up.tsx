import { SignUpScreen } from 'app/features/auth/sign-up-screen'
import { Stack } from 'expo-router'
import { ScrollView } from 'react-native'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SignUpScreen />
      </ScrollView>
    </>
  )
}
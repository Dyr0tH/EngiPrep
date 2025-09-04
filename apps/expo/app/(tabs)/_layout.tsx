import { Tabs } from 'expo-router'
import { Home, BookOpen, FileText, Brain, ShoppingBag } from '@tamagui/lucide-icons'
import { useColorScheme } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          color: '#ffffff',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="pyqs"
        options={{
          title: 'PYQs',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="question-banks"
        options={{
          title: 'Question Banks',
          tabBarIcon: ({ color, size }) => (
            <Brain size={size} color={color as any} />
          ),
        }}
      />
      <Tabs.Screen
        name="purchases"
        options={{
          title: 'Purchases',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color as any} />
          ),
        }}
      />
    </Tabs>
  )
}
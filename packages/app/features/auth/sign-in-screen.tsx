import {
  Button,
  Form,
  H1,
  Input,
  Label,
  Paragraph,
  Separator,
  Spinner,
  YStack,
  XStack,
} from '@my/ui'
import { Eye, EyeOff, Mail, Lock } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { signIn } from '../../lib/supabase'

export function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        setErrors({ general: error.message })
        return
      }
      
      if (data.user) {
        // Navigate to home screen after successful sign in
        router.push('/notes')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = () => {
    // Navigate to sign up screen
    router.push('/auth/sign-up')
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      paddingVertical="$2"
      gap="$3"
      backgroundColor="#ffffff"
      maxWidth={400}
      width="100%"
      alignSelf="center"
    >
      <YStack gap="$2" alignItems="center">
        <H1 color="#1a1a1a" textAlign="center" fontWeight="700">
          Welcome Back
        </H1>
        <Paragraph color="#6b7280" textAlign="center" size="$4">
          Sign in to your account to continue
        </Paragraph>
      </YStack>

      <Separator width="100%" backgroundColor="#e5e7eb" />

      <Form width="100%" gap="$2" onSubmit={handleSignIn}>
        {errors.general && (
          <YStack
            backgroundColor="#fef2f2"
            borderColor="#f87171"
            borderWidth={1}
            borderRadius={8}
            padding="$3"
          >
            <Paragraph color="#dc2626" size="$3" textAlign="center">
              {errors.general}
            </Paragraph>
          </YStack>
        )}
        
        <YStack gap="$2">
          <YStack gap="$1">
            <Label htmlFor="email" color="#374151" fontWeight="600" size="$3">
              Email Address
            </Label>
            <XStack
              borderWidth={1}
              borderColor={errors.email ? '#f87171' : '#d1d5db'}
              borderRadius={8}
              backgroundColor="#ffffff"
              focusStyle={{
                borderColor: '#1a1a1a',
                shadowColor: '#f3f4f6',
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              <XStack padding="$2" alignItems="center">
                <Mail size={16} color="$color10" />
              </XStack>
              <Input
                id="email"
                flex={1}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                borderWidth={0}
                backgroundColor="transparent"
                focusStyle={{ borderWidth: 0 }}
                color="#1a1a1a"
                placeholderTextColor="#9ca3af"
                padding="$1"
                fontSize="$3"
              />
            </XStack>
            {errors.email && (
              <Paragraph color="#dc2626" size="$2" marginTop="$0">
                {errors.email}
              </Paragraph>
            )}
          </YStack>

          <YStack gap="$1">
            <Label htmlFor="password" color="#374151" fontWeight="600" size="$3">
              Password
            </Label>
            <XStack
              borderWidth={1}
              borderColor={errors.password ? '#f87171' : '#d1d5db'}
              borderRadius={8}
              backgroundColor="#ffffff"
              focusStyle={{
                borderColor: '#1a1a1a',
                shadowColor: '#f3f4f6',
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              <XStack padding="$2" alignItems="center">
                <Lock size={16} color="$color10" />
              </XStack>
              <Input
                id="password"
                flex={1}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                borderWidth={0}
                backgroundColor="transparent"
                focusStyle={{ borderWidth: 0 }}
                color="#1a1a1a"
                placeholderTextColor="#9ca3af"
                padding="$1"
                fontSize="$3"
              />
              <Button
                chromeless
                padding="$2"
                onPress={() => setShowPassword(!showPassword)}
                icon={showPassword ? EyeOff : Eye}
                color="#6b7280"
              />
            </XStack>
            {errors.password && (
              <Paragraph color="#dc2626" size="$2" marginTop="$0">
                {errors.password}
              </Paragraph>
            )}
          </YStack>
        </YStack>

        <Button
          size="$4"
          backgroundColor="#1a1a1a"
          color="#ffffff"
          onPress={handleSignIn}
          disabled={isLoading}
          marginTop="$2"
          borderRadius={8}
          fontWeight="600"
          pressStyle={{
            backgroundColor: '#374151',
            transform: [{ scale: 0.98 }]
          }}
          icon={isLoading ? <Spinner color="white" /> : undefined}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>

      <Separator width="100%" backgroundColor="#e5e7eb" />

      <YStack gap="$3" alignItems="center">
        <Paragraph color="#6b7280" size="$3">
          Don't have an account?
        </Paragraph>
        <Button
          backgroundColor="transparent"
          borderColor="#d1d5db"
          borderWidth={1}
          color="#1a1a1a"
          size="$3"
          onPress={handleCreateAccount}
          borderRadius={8}
          fontWeight="600"
          pressStyle={{
            backgroundColor: '#f9fafb',
            borderColor: '#1a1a1a'
          }}
        >
          Create Account
        </Button>
      </YStack>
    </YStack>
  )
}
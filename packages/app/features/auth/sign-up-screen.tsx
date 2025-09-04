import {
  Button,
  Form,
  H1,
  Input,
  Label,
  Paragraph,
  Select,
  Separator,
  Spinner,
  YStack,
  XStack,
} from '@my/ui'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Calendar } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { signUp } from '../../lib/supabase'

export function SignUpScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    semester: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    collegeName?: string
    semester?: string
    general?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      collegeName?: string
      semester?: string
    } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required'
    }
    
    if (!formData.semester) {
      newErrors.semester = 'Semester is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const userData = {
        name: formData.name,
        college_name: formData.collegeName,
        semester: formData.semester,
      }
      
      const { data, error } = await signUp(formData.email, formData.password, userData)
      
      if (error) {
        setErrors({ general: error.message })
        return
      }
      
      if (data.user) {
        // Navigate to home screen after successful sign up
        router.push('/notes')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    // Navigate to sign in screen
    router.push('/auth/sign-in')
  }

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const semesterOptions = [
    { value: '1', label: '1st Semester' },
    { value: '2', label: '2nd Semester' },
    { value: '3', label: '3rd Semester' },
    { value: '4', label: '4th Semester' },
    { value: '5', label: '5th Semester' },
    { value: '6', label: '6th Semester' },
    { value: '7', label: '7th Semester' },
    { value: '8', label: '8th Semester' },
  ]

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$6"
      backgroundColor="#ffffff"
      maxWidth={400}
      width="100%"
      alignSelf="center"
    >
      <YStack gap="$3" alignItems="center">
        <H1 color="#1a1a1a" textAlign="center" fontWeight="700">
          Create Account
        </H1>
        <Paragraph color="#6b7280" textAlign="center" size="$4">
          Join EngiPrep to access premium study materials
        </Paragraph>
      </YStack>

      <Separator width="100%" backgroundColor="#e5e7eb" />

      <Form width="100%" gap="$4" onSubmit={handleSignUp}>
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
        
        <YStack gap="$3">
            <YStack gap="$2">
              <Label htmlFor="name" color="#374151" fontWeight="600">
                Full Name
              </Label>
              <XStack
                borderWidth={1}
                borderColor={errors.name ? '#f87171' : '#d1d5db'}
                borderRadius={8}
                backgroundColor="#ffffff"
                focusStyle={{
                  borderColor: '#1a1a1a',
                  shadowColor: '#f3f4f6',
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <XStack padding="$3" alignItems="center">
                <User size={20} color="$color10" />
              </XStack>
              <Input
                id="name"
                flex={1}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoComplete="name"
                borderWidth={0}
                backgroundColor="transparent"
                focusStyle={{ borderWidth: 0 }}
                color="#1a1a1a"
                placeholderTextColor="#9ca3af"
              />
            </XStack>
            {errors.name && (
              <Paragraph color="#dc2626" size="$2">
                {errors.name}
              </Paragraph>
            )}
          </YStack>

          {/* Email Field */}
          <YStack gap="$2">
            <Label htmlFor="email" color="#374151" fontWeight="600">
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
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <XStack padding="$3" alignItems="center">
                <Mail size={20} color="$color10" />
              </XStack>
              <Input
                id="email"
                flex={1}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                borderWidth={0}
                backgroundColor="transparent"
                focusStyle={{ borderWidth: 0 }}
                color="#1a1a1a"
                placeholderTextColor="#9ca3af"
              />
            </XStack>
            {errors.email && (
                <Paragraph color="#dc2626" size="$2">
                  {errors.email}
                </Paragraph>
              )}
          </YStack>

          {/* Password Field */}
          <YStack gap="$2">
              <Label htmlFor="password" color="#374151" fontWeight="600">
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
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <XStack padding="$3" alignItems="center">
                <Lock size={20} color="$color10" />
              </XStack>
              <Input
                  id="password"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  borderWidth={0}
                  backgroundColor="transparent"
                  focusStyle={{ borderWidth: 0 }}
                  color="#1a1a1a"
                  placeholderTextColor="#9ca3af"
                />
              <Button
                  chromeless
                  padding="$3"
                  onPress={() => setShowPassword(!showPassword)}
                  icon={showPassword ? EyeOff : Eye}
                  color="#6b7280"
                />
            </XStack>
            {errors.password && (
              <Paragraph color="#dc2626" size="$2">
                {errors.password}
              </Paragraph>
            )}
          </YStack>

          {/* College Name Field */}
          <YStack gap="$2">
            <Label htmlFor="collegeName" color="#374151" fontWeight="600">
              College Name
            </Label>
            <XStack
              borderWidth={1}
              borderColor={errors.collegeName ? '#f87171' : '#d1d5db'}
              borderRadius={8}
              backgroundColor="#ffffff"
              focusStyle={{
                borderColor: '#1a1a1a',
                shadowColor: '#f3f4f6',
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <XStack padding="$3" alignItems="center">
                <GraduationCap size={20} color="$color10" />
              </XStack>
              <Input
                id="collegeName"
                flex={1}
                value={formData.collegeName}
                onChangeText={(value) => updateFormData('collegeName', value)}
                placeholder="Enter your college name"
                autoCapitalize="words"
                borderWidth={0}
                backgroundColor="transparent"
                focusStyle={{ borderWidth: 0 }}
                color="#1a1a1a"
                placeholderTextColor="#9ca3af"
              />
            </XStack>
            {errors.collegeName && (
              <Paragraph color="#dc2626" size="$2">
                {errors.collegeName}
              </Paragraph>
            )}
          </YStack>

          {/* Semester Field */}
          <YStack gap="$2">
            <Label htmlFor="semester" color="#374151" fontWeight="600">
              Current Semester
            </Label>
            <XStack
              borderWidth={1}
              borderColor={errors.semester ? '#f87171' : '#d1d5db'}
              borderRadius={8}
              backgroundColor="#ffffff"
              focusStyle={{
                borderColor: '#1a1a1a',
                shadowColor: '#f3f4f6',
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <XStack padding="$3" alignItems="center">
                <Calendar size={20} color="$color10" />
              </XStack>
              <Select
                id="semester"
                value={formData.semester}
                onValueChange={(value) => updateFormData('semester', value)}
              >
                <Select.Trigger flex={1} borderWidth={0} backgroundColor="transparent">
                  <Select.Value placeholder="Select your semester" />
                </Select.Trigger>
                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {semesterOptions.map((option) => (
                      <Select.Item key={option.value} value={option.value} index={semesterOptions.indexOf(option)}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
            </XStack>
            {errors.semester && (
              <Paragraph color="#dc2626" size="$2">
                {errors.semester}
              </Paragraph>
            )}
          </YStack>
        </YStack>

        <Button
          size="$5"
          backgroundColor="#1a1a1a"
          color="#ffffff"
          onPress={handleSignUp}
          disabled={isLoading}
          marginTop="$4"
          borderRadius={8}
          fontWeight="600"
          pressStyle={{
            backgroundColor: '#374151',
            transform: [{ scale: 0.98 }]
          }}
          icon={isLoading ? <Spinner color="white" /> : undefined}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <Separator width="100%" backgroundColor="#e5e7eb" />

      <YStack gap="$3" alignItems="center">
        <Paragraph color="#6b7280" size="$3">
          Already have an account?
        </Paragraph>
        <Button
          backgroundColor="transparent"
          borderColor="#d1d5db"
          borderWidth={1}
          color="#1a1a1a"
          size="$4"
          onPress={handleSignIn}
          borderRadius={8}
          fontWeight="600"
          pressStyle={{
            backgroundColor: '#f9fafb',
            borderColor: '#1a1a1a'
          }}
        >
          Sign In
        </Button>
      </YStack>
    </YStack>
  )
}
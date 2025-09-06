import { YStack, XStack, Text, Button, Sheet, Input, Label, Spinner } from '@my/ui'
import { X, Save, User, Building, Calendar } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { fetchUserInfo, updateUserInfo, UserInfo } from '../../lib/services/user-info'

interface UserInfoDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function UserInfoDrawer({ isOpen, onClose }: UserInfoDrawerProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    semester: ''
  })

  // Load user info when drawer opens
  useEffect(() => {
    if (isOpen) {
      loadUserInfo()
    }
  }, [isOpen])

  const loadUserInfo = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await fetchUserInfo()
      
      if (error) {
        setError('Failed to load user information')
        return
      }
      
      if (data) {
        setUserInfo(data)
        setFormData({
          name: data.name || '',
          collegeName: data.collegeName || '',
          semester: data.semester || ''
        })
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.collegeName.trim() || !formData.semester.trim()) {
      setError('Please fill in all fields')
      return
    }

    setSaving(true)
    setError(null)
    
    try {
      const { data, error } = await updateUserInfo(
        formData.name.trim(),
        formData.collegeName.trim(),
        formData.semester.trim()
      )
      
      if (error) {
        setError('Failed to update user information')
        return
      }
      
      if (data) {
        setUserInfo(data)
        onClose()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[100]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding="$4"
        backgroundColor="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        flex={1}
      >
        <YStack flex={1} gap="$4">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$color12">
              User Information
            </Text>
            <Button
              size="$3"
              circular
              icon={X}
              onPress={onClose}
              backgroundColor="$color3"
              borderColor="$color6"
            />
          </XStack>

          {/* Content */}
          <YStack flex={1} gap="$4">
            {loading ? (
              <YStack alignItems="center" justifyContent="center" flex={1}>
                <Spinner size="large" color="$blue10" />
                <Text fontSize="$4" color="$color10" mt="$3">
                  Loading user information...
                </Text>
              </YStack>
            ) : (
              <YStack gap="$4" flex={1}>
                {/* Error Message */}
                {error && (
                  <YStack
                    backgroundColor="$red2"
                    borderColor="$red6"
                    borderWidth={1}
                    borderRadius="$4"
                    padding="$3"
                  >
                    <Text color="$red11" fontSize="$3">
                      {error}
                    </Text>
                  </YStack>
                )}

                {/* Email Field (Read-only) */}
                <YStack gap="$2">
                  <Label htmlFor="email" fontSize="$4" fontWeight="600" color="$color11">
                    Email
                  </Label>
                  <XStack alignItems="center" gap="$2">
                    <User size={20} color="$color10" />
                    <Input
                      id="email"
                      value={userInfo?.email || ''}
                      editable={false}
                      backgroundColor="$color3"
                      color="$color10"
                      borderColor="$color6"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                {/* Name Field */}
                <YStack gap="$2">
                  <Label htmlFor="name" fontSize="$4" fontWeight="600" color="$color11">
                    Name
                  </Label>
                  <XStack alignItems="center" gap="$2">
                    <User size={20} color="$color10" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      placeholder="Enter your name"
                      backgroundColor="$background"
                      borderColor="$color6"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                {/* College Name Field */}
                <YStack gap="$2">
                  <Label htmlFor="collegeName" fontSize="$4" fontWeight="600" color="$color11">
                    College Name
                  </Label>
                  <XStack alignItems="center" gap="$2">
                    <Building size={20} color="$color10" />
                    <Input
                      id="collegeName"
                      value={formData.collegeName}
                      onChangeText={(value) => handleInputChange('collegeName', value)}
                      placeholder="Enter your college name"
                      backgroundColor="$background"
                      borderColor="$color6"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                {/* Semester Field */}
                <YStack gap="$2">
                  <Label htmlFor="semester" fontSize="$4" fontWeight="600" color="$color11">
                    Semester
                  </Label>
                  <XStack alignItems="center" gap="$2">
                    <Calendar size={20} color="$color10" />
                    <Input
                      id="semester"
                      value={formData.semester}
                      onChangeText={(value) => handleInputChange('semester', value)}
                      placeholder="Enter your semester"
                      backgroundColor="$background"
                      borderColor="$color6"
                      flex={1}
                    />
                  </XStack>
                </YStack>

                {/* Save Button */}
                <YStack mt="$4">
                  <Button
                    size="$4"
                    backgroundColor="black"
                    color="white"
                    onPress={handleSave}
                    disabled={saving}
                    icon={saving ? undefined : Save}
                  >
                    {saving ? (
                      <XStack alignItems="center" gap="$2">
                        <Spinner size="small" color="white" />
                        <Text color="white">Saving...</Text>
                      </XStack>
                    ) : (
                      <Text color="white">Save Changes</Text>
                    )}
                  </Button>
                </YStack>
              </YStack>
            )}
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
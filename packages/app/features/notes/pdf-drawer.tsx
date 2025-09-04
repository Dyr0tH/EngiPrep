import { YStack, XStack, Text, Button, Card, ScrollView, Sheet } from '@my/ui'
import { X } from '@tamagui/lucide-icons'
import { useState } from 'react'

interface PdfDrawerProps {
  isOpen: boolean
  onClose: () => void
  pdfUrls: string[]
}

// Helper function to extract filename from URL or generate a name
const getPdfName = (url: string, index: number): string => {
  try {
    const urlParts = url.split('/')
    const filename = urlParts[urlParts.length - 1]
    if (filename && filename.includes('.pdf')) {
      // Decode URL-encoded characters
      const decodedFilename = decodeURIComponent(filename)
      return decodedFilename.replace('.pdf', '')
    }
  } catch (error) {
    // Fallback to generic name
  }
  return `PDF Document ${index + 1}`
}

export function PdfDrawer({ isOpen, onClose, pdfUrls }: PdfDrawerProps) {
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[85]}
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
      >
        <YStack flex={1} gap="$4">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="bold" color="$color12">
              PDF Documents
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

          {/* PDF List */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack gap="$3">
              {pdfUrls.length === 0 ? (
                <Card p="$4" backgroundColor="$color2" borderColor="$color6">
                  <YStack alignItems="center" gap="$2">
                    <Text fontSize={48} color="$color8">📄</Text>
                    <Text fontSize="$4" color="$color10" textAlign="center">
                      No PDF documents available
                    </Text>
                  </YStack>
                </Card>
              ) : (
                pdfUrls.map((url, index) => (
                  <Card
                    key={index}
                    elevate
                    size="$4"
                    bordered
                    backgroundColor="$background"
                    padding="$4"
                    pressStyle={{ scale: 0.98 }}
                    animation="bouncy"
                  >
                    <Text fontSize="$4" fontWeight="600" color="$color12">
                       {getPdfName(url, index)}
                     </Text>
                  </Card>
                ))
              )}
            </YStack>
          </ScrollView>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
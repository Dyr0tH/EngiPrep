import React, { useState } from 'react'
import { Sheet, YStack, XStack, Text, Button, ScrollView } from '@my/ui'
import { X, ChevronLeft, FileText } from '@tamagui/lucide-icons'
import { Dimensions, Platform } from 'react-native'

// Platform-specific PDF import
let Pdf: any = null
if (Platform.OS !== 'web') {
  try {
    const ReactNativePdf = require('react-native-pdf')
    Pdf = ReactNativePdf.default || ReactNativePdf
  } catch (error) {
    console.warn('react-native-pdf not available on this platform')
  }
}

// Define isWeb based on Platform.OS
const isWeb = Platform.OS === 'web'

interface PdfViewerProps {
  isOpen: boolean
  pdfUrls: string[]
  noteTitle: string
  onClose: () => void
}

export function PdfViewer({ isOpen, pdfUrls, noteTitle, onClose }: PdfViewerProps) {
  const [selectedPdfIndex, setSelectedPdfIndex] = useState<number | null>(null)
  const screenWidth = Dimensions.get('window').width

  const handleSelectPdf = (index: number) => {
    setSelectedPdfIndex(index)
  }

  const handleBackToList = () => {
    setSelectedPdfIndex(null)
  }

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[100]}
      dismissOnSnapToBottom
      disableDrag={selectedPdfIndex !== null}
    >
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <Sheet.Handle />

        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="bold" color="$color">
              {noteTitle}
            </Text>
            <Text fontSize="$3" color="$color11">
              {pdfUrls.length} PDF{pdfUrls.length !== 1 ? 's' : ''} available
            </Text>
          </YStack>
          <Button
            size="$3"
            circular
            icon={X}
            onPress={onClose}
            backgroundColor="$red10"
            color="$white1"
          />
        </XStack>

        {selectedPdfIndex === null ? (
          /* PDF List */
          <ScrollView flex={1}>
            <YStack space="$3">
              {pdfUrls.map((pdfUrl, index) => {
                // Extract filename from URL or create a default name
                const fileName = pdfUrl.split('/').pop() || `PDF ${index + 1}`
                // Decode URL-encoded characters
                const decodedFileName = decodeURIComponent(fileName)
                const displayName = decodedFileName.includes('.pdf')
                  ? decodedFileName
                  : `${decodedFileName}.pdf`

                return (
                  <XStack
                    key={index}
                    padding="$4"
                    backgroundColor="white"
                    borderRadius={8}
                    alignItems="center"
                    justifyContent="space-between"
                    borderWidth={1}
                    marginBottom={12}
                    borderColor="#d1d5db"
                  >
                    <XStack alignItems="center" space="$3" flex={1}>
                      <FileText size={24} color="#6b7280" />
                      <YStack flex={1}>
                        <Text fontSize="$4" fontWeight="500" color="#1a1a1a">
                          {displayName}
                        </Text>
                        <Text fontSize="$2" color="#6b7280">
                          PDF Document
                        </Text>
                      </YStack>
                    </XStack>

                    <Button
                      size="$3"
                      onPress={() => handleSelectPdf(index)}
                      backgroundColor="#1a1a1a"
                      color="#ffffff"
                      borderRadius={8}
                      pressStyle={{
                        backgroundColor: '#374151',
                        transform: [{ scale: 0.98 }],
                      }}
                    >
                      Read
                    </Button>
                  </XStack>
                )
              })}

              {pdfUrls.length === 0 && (
                <YStack alignItems="center" padding="$6">
                  <FileText size={48} color="#9ca3af" />
                  <Text fontSize="$4" color="#6b7280" textAlign="center" marginTop="$3">
                    No PDFs available
                  </Text>
                </YStack>
              )}
            </YStack>
          </ScrollView>
        ) : (
          /* PDF Viewer */
          <YStack flex={1}>
            {/* PDF Viewer Header */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Button
                size="$3"
                icon={ChevronLeft}
                onPress={handleBackToList}
                backgroundColor="black"
                color="$white1"
              >
                <Text color="white">Back</Text>
              </Button>
              <YStack width={80} /> {/* Spacer for alignment */}
            </XStack>

            {/* PDF Display - Platform Specific */}
            <YStack flex={1} borderRadius={8} overflow="hidden">
              {isWeb ? (
                /* Web: Use iframe for PDF display */
                <iframe
                  src={pdfUrls[selectedPdfIndex]}
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: 8,
                  }}
                  title="PDF Viewer"
                />
              ) : Pdf ? (
                /* Native: Use react-native-pdf for PDF display */
                <Pdf
                  source={{ uri: pdfUrls[selectedPdfIndex], cache: true }}
                  trustAllCerts={false}
                  style={{ flex: 1, width: '100%', height: '100%' }}
                  enablePaging={true}
                  enableRTL={false}
                  enableAnnotationRendering={true}
                  enableAntialiasing={true}
                  fitPolicy={0}
                  spacing={10}
                  password=""
                  scale={1.0}
                  minScale={1.0}
                  maxScale={3.0}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`)
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`)
                  }}
                  onError={(error) => {
                    console.log('PDF Error:', error)
                  }}
                />
              ) : (
                /* Fallback: Show error message */
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
                  <Text fontSize="$4" color="$red10" textAlign="center">
                    PDF viewer not available
                  </Text>
                  <Text fontSize="$3" color="$color11" textAlign="center" marginTop="$2">
                    Unable to load react-native-pdf library
                  </Text>
                </YStack>
              )}
            </YStack>
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  )
}

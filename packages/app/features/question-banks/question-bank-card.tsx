import { YStack, XStack, Text, Button, Card } from '@my/ui'
import { Download, Calendar, BookOpen, Building, GraduationCap } from '@tamagui/lucide-icons'
import { useState } from 'react'

export interface QuestionBank {
  id: string
  name: string
  subject: string
  branch: string
  year: string
  semester: string
  pdfUrl: string
}

interface QuestionBankCardProps {
  questionBank: QuestionBank
  onDownload: (pdfUrl: string) => void
}

export function QuestionBankCard({ questionBank, onDownload }: QuestionBankCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      backgroundColor="white"
      borderColor="#e5e5e5"
      borderWidth={1}
      padding="$4"
      marginBottom="$3"
      pressStyle={{ 
        scale: 0.98,
        backgroundColor: "#fafafa",
        borderColor: "#d1d5db"
      }}
      animation="bouncy"
      shadowColor="#000000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}
    >
      <YStack gap="$3">
        {/* Header with Name */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="bold" color="#1a1a1a" numberOfLines={2}>
              {questionBank.name}
            </Text>
            <XStack alignItems="center" gap="$2">
              <BookOpen size={16} color="#6b7280" />
              <Text fontSize="$3" color="#6b7280">{questionBank.subject}</Text>
            </XStack>
          </YStack>
        </XStack>

        {/* Details Grid */}
        <YStack gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2" flex={1}>
              <Building size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Branch:</Text>
              <Text fontSize="$2" color="#9ca3af">{questionBank.branch}</Text>
            </XStack>
            <XStack alignItems="center" gap="$2" flex={1}>
              <Calendar size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Year:</Text>
              <Text fontSize="$2" color="#9ca3af">{questionBank.year}</Text>
            </XStack>
          </XStack>
          
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2" flex={1}>
              <GraduationCap size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Semester:</Text>
              <Text fontSize="$2" color="#9ca3af">{questionBank.semester}</Text>
            </XStack>
          </XStack>
        </YStack>

        {/* Action Button */}
        <XStack justifyContent="flex-end" marginTop="$2">
          <Button
            size="$3"
            backgroundColor="#1a1a1a"
            color="white"
            onPress={() => onDownload(questionBank.pdfUrl)}
            borderRadius="$2"
            fontWeight="500"
            fontSize="$2"
            icon={Download}
            pressStyle={{ backgroundColor: "#333333" }}
            borderWidth={0}
          >
            Download
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}
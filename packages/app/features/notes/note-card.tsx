import { YStack, XStack, Text, Button, Card } from '@my/ui'
import { FileText, IndianRupee, Calendar, BookOpen, Building, GraduationCap, ShoppingCart } from '@tamagui/lucide-icons'
import { useState } from 'react'

export interface Note {
  id: string
  name: string
  subject: string
  branch: string
  year: string
  semester: string
  price: number
  pdfUrl: string[]
  isPurchased?: boolean
}

interface NoteCardProps {
  note: Note
  onShowContent: (pdfUrls: string[]) => void
  onPurchase?: (noteId: string) => void
  isPurchasing?: boolean
  isPurchased?: boolean
}

export function NoteCard({ note, onShowContent, onPurchase, isPurchasing = false, isPurchased = false }: NoteCardProps) {
  return (
    <Card
      size="$4"
      backgroundColor="white"
      borderColor="#e5e5e5"
      borderWidth={1}
      padding="$4"
      marginBottom="$3"
      pressStyle={{ scale: 0.98, backgroundColor: "#fafafa" }}
      animation="bouncy"
      shadowColor="#00000008"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}
    >
      <YStack gap="$3">
        {/* Header with Name and Price */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} gap="$1">
            <Text fontSize="$5" fontWeight="600" color="#1a1a1a" numberOfLines={2}>
              {note.name}
            </Text>
            <XStack alignItems="center" gap="$2">
              <BookOpen size={16} color="#6b7280" />
              <Text fontSize="$3" color="#6b7280">{note.subject}</Text>
            </XStack>
          </YStack>
          <YStack alignItems="flex-end" gap="$1">
            <XStack alignItems="center" gap="$1">
              <IndianRupee size={16} color="#1a1a1a" />
              <Text fontSize="$4" fontWeight="600" color="#1a1a1a">
                ₹{note.price}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        {/* Details Grid */}
        <YStack gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2" flex={1}>
              <Building size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Branch:</Text>
              <Text fontSize="$2" color="#9ca3af">{note.branch}</Text>
            </XStack>
            <XStack alignItems="center" gap="$2" flex={1}>
              <Calendar size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Year:</Text>
              <Text fontSize="$2" color="#9ca3af">{note.year}</Text>
            </XStack>
          </XStack>
          
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2" flex={1}>
              <GraduationCap size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">Semester:</Text>
              <Text fontSize="$2" color="#9ca3af">{note.semester}</Text>
            </XStack>
            <XStack alignItems="center" gap="$2" flex={1}>
              <FileText size={14} color="#9ca3af" />
              <Text fontSize="$2" color="#6b7280" fontWeight="500">PDFs:</Text>
              <Text fontSize="$2" color="#9ca3af">{note.pdfUrl.length}</Text>
            </XStack>
          </XStack>
        </YStack>

        {/* Action Buttons */}
        <XStack justifyContent="flex-end" gap="$2" marginTop="$2">
          <Button
            size="$3"
            backgroundColor={isPurchased ? "#9ca3af" : isPurchasing ? "#666666" : "#1a1a1a"}
            color="white"
            onPress={() => !isPurchasing && !isPurchased && onPurchase?.(note.id)}
            borderRadius="$2"
            fontWeight="500"
            fontSize="$2"
            icon={isPurchased ? undefined : isPurchasing ? undefined : ShoppingCart}
            pressStyle={{ backgroundColor: isPurchased ? "#9ca3af" : isPurchasing ? "#666666" : "#333333" }}
            borderWidth={0}
            disabled={isPurchasing || isPurchased}
          >
            {isPurchased ? 'Purchased' : isPurchasing ? 'Purchasing...' : 'Purchase'}
          </Button>
          <Button
            size="$3"
            backgroundColor="white"
            color="#1a1a1a"
            borderColor="#e5e5e5"
            borderWidth={1}
            onPress={() => onShowContent(note.pdfUrl)}
            borderRadius="$2"
            fontWeight="500"
            fontSize="$2"
            icon={FileText}
            pressStyle={{ backgroundColor: "#f9f9f9" }}
          >
            Show Content
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}
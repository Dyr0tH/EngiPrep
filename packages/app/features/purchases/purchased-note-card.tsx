import { YStack, XStack, Text, Button, Card } from '@my/ui'
import { FileText, IndianRupee, Calendar, BookOpen, Building, GraduationCap, Eye } from '@tamagui/lucide-icons'
import { useState } from 'react'

export interface PurchasedNote {
  id: string
  name: string
  subject: string
  branch: string
  year: string
  semester: string
  purchasePrice: number
  purchaseDate: string
  pdfUrl: string[]
}

// Transform function to convert PurchaseWithNote to PurchasedNote
export function transformPurchaseToNote(purchase: any): PurchasedNote {
  return {
    id: purchase.notes.id,
    name: purchase.notes.name,
    subject: purchase.notes.subject,
    branch: purchase.notes.branch,
    year: purchase.notes.year,
    semester: purchase.notes.semester,
    purchasePrice: purchase.purchase_price,
    purchaseDate: new Date(purchase.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    pdfUrl: purchase.notes.pdfUrl
  }
}

interface PurchasedNoteCardProps {
  note: PurchasedNote
  onRead: (pdfUrls: string[], noteTitle: string) => void
}

export function PurchasedNoteCard({ note, onRead }: PurchasedNoteCardProps) {
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
        {/* Header with Name and Purchase Info */}
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
              <IndianRupee size={16} color="#16a34a" />
              <Text fontSize="$4" fontWeight="600" color="#16a34a">
                ₹{note.purchasePrice}
              </Text>
            </XStack>
            <Text fontSize="$2" color="#6b7280">
              {note.purchaseDate}
            </Text>
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

        {/* Action Button */}
        <XStack justifyContent="flex-end" marginTop="$2">
          <Button
            size="$3"
            backgroundColor="#1a1a1a"
            color="white"
            onPress={() => onRead(note.pdfUrl, note.name)}
            borderRadius={8}
            fontWeight="500"
            fontSize="$2"
            icon={Eye}
            pressStyle={{ backgroundColor: "#333333" }}
            borderWidth={0}
          >
            Read
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}
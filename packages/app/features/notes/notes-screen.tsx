import { YStack, XStack, H2, Text, Button, ScrollView, Input, Spinner } from '@my/ui'
import { useState, useMemo, useEffect } from 'react'
import { Search, AlertCircle, CheckCircle } from '@tamagui/lucide-icons'
import FuzzySearch from 'fuzzy-search'
import { NoteCard, Note } from './note-card'
import { PdfDrawer } from './pdf-drawer'
import { TabHeader } from '../../components/tab-header'
import { fetchNotes } from '../../lib/services/notes'
import { createPurchase } from '../../lib/services/purchases'

export function NotesScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPdfUrls, setSelectedPdfUrls] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [purchasingNoteId, setPurchasingNoteId] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)

  // Fetch notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await fetchNotes()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setNotes(data || [])
      }
      
      setLoading(false)
    }

    loadNotes()
  }, [])

  const handleShowContent = (pdfUrls: string[]) => {
    setSelectedPdfUrls(pdfUrls)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedPdfUrls([])
  }

  const handlePurchase = async (noteId: string) => {
    try {
      setPurchasingNoteId(noteId)
      setPurchaseSuccess(null)
      
      // Find the note to get its price
      const note = notes.find(n => n.id === noteId)
      if (!note) {
        console.error('Note not found')
        return
      }

      // Create the purchase
      const { data, error } = await createPurchase(noteId, note.price)
      
      if (error) {
        console.error('Purchase failed:', error)
        // You could show an error toast here
      } else {
        console.log('Purchase successful:', data)
        setPurchaseSuccess(noteId)
        // Refresh notes to update purchase status
        const { data: updatedNotes } = await fetchNotes()
        if (updatedNotes) {
          setNotes(updatedNotes)
        }
        // Auto-hide success message after 3 seconds
        setTimeout(() => setPurchaseSuccess(null), 3000)
      }
    } catch (err) {
      console.error('Unexpected error during purchase:', err)
    } finally {
      setPurchasingNoteId(null)
    }
  }

  // fuzzy-search configuration
  const fuzzySearcher = useMemo(() => {
    return new FuzzySearch(notes, ['name', 'subject', 'branch', 'year'], {
      caseSensitive: false,
      sort: true
    })
  }, [notes])

  // Filter notes using fuzzy search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes
    }
    
    return fuzzySearcher.search(searchQuery.trim())
  }, [searchQuery, fuzzySearcher])

  return (
    <YStack flex={1} bg="$background">
      <TabHeader page_name="Notes" />

      {/* Content */}
      <ScrollView flex={1} p="$4">
        <YStack gap="$4">
          {/* Search Bar */}
          <XStack alignItems="center" gap="$2" p="$2" bg="$color2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <Search size={20} color="$color10" />
            <Input
              flex={1}
              placeholder="Search notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              bg="transparent"
              borderWidth={0}
              fontSize="$4"
            />
          </XStack>

          {/* Loading State */}
          {loading && (
            <YStack alignItems="center" py="$6">
              <Spinner size="large" color="$blue10" />
              <Text fontSize="$4" color="$color10" mt="$3">
                Loading notes...
              </Text>
            </YStack>
          )}

          {/* Error State */}
          {error && !loading && (
            <YStack alignItems="center" py="$6" gap="$3">
              <AlertCircle size={48} color="$red10" />
              <Text fontSize="$4" color="$red10" textAlign="center">
                Error loading notes
              </Text>
              <Text fontSize="$3" color="$color8" textAlign="center">
                {error}
              </Text>
              <Button
                size="$3"
                theme="blue"
                onPress={() => {
                  const loadNotes = async () => {
                    setLoading(true)
                    setError(null)
                    const { data, error: fetchError } = await fetchNotes()
                    if (fetchError) {
                      setError(fetchError)
                    } else {
                      setNotes(data || [])
                    }
                    setLoading(false)
                  }
                  loadNotes()
                }}
              >
                Retry
              </Button>
            </YStack>
          )}

          {/* Notes List */}
          {!loading && !error && (
            <YStack gap="$3">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <YStack key={note.id} gap="$2">
                    <NoteCard
                       note={note}
                       onShowContent={handleShowContent}
                       onPurchase={handlePurchase}
                       isPurchasing={purchasingNoteId === note.id}
                       isPurchased={note.isPurchased}
                     />
                    {/* Purchase Success Message */}
                    {purchaseSuccess === note.id && (
                      <XStack
                        alignItems="center"
                        gap="$2"
                        bg="$green2"
                        p="$3"
                        borderRadius="$3"
                        borderWidth={1}
                        borderColor="$green8"
                      >
                        <CheckCircle size={20} color="$green10" />
                        <Text color="$green11" fontSize="$3" fontWeight="500">
                          Purchase successful! Check your purchases tab.
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                ))
              ) : (
                <YStack alignItems="center" py="$6">
                  <Text textAlign="center" color="$color10" fontSize="$4">
                    {searchQuery ? `No notes found matching "${searchQuery}"` : 'No notes available'}
                  </Text>
                  {!searchQuery && (
                    <Text fontSize="$3" color="$color8" textAlign="center" mt="$2">
                      Notes will appear here once they are added to the database.
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* PDF Drawer */}
      <PdfDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        pdfUrls={selectedPdfUrls}
      />
    </YStack>
  )
}
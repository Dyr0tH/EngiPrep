import { YStack, XStack, H2, Text, Button, Card, ScrollView, Input, Spinner } from '@my/ui'
import { ShoppingBag, CreditCard, Download, Star, Crown, Search, AlertCircle } from '@tamagui/lucide-icons'
import { useState, useMemo, useEffect } from 'react'
import FuzzySearch from 'fuzzy-search'
import { TabHeader } from '../../components/tab-header'
import { PurchasedNoteCard, PurchasedNote, transformPurchaseToNote } from './purchased-note-card'
import { PdfViewer } from './pdf-viewer'
import { fetchUserPurchasesWithNotes } from '../../lib/services/purchases'

export function PurchasesScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false)
  const [selectedPdfUrls, setSelectedPdfUrls] = useState<string[]>([])
  const [selectedNoteTitle, setSelectedNoteTitle] = useState('')
  const [purchasedNotes, setPurchasedNotes] = useState<PurchasedNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch purchased notes on component mount
  useEffect(() => {
    const loadPurchasedNotes = async () => {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await fetchUserPurchasesWithNotes()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        const transformedNotes = (data || []).map(transformPurchaseToNote)
        setPurchasedNotes(transformedNotes)
      }
      
      setLoading(false)
    }

    loadPurchasedNotes()
  }, [])

  const handleReadPdf = (pdfUrls: string[], noteTitle: string) => {
    setSelectedPdfUrls(pdfUrls)
    setSelectedNoteTitle(noteTitle)
    setIsPdfViewerOpen(true)
  }

  const handleClosePdfViewer = () => {
    setIsPdfViewerOpen(false)
    setSelectedPdfUrls([])
    setSelectedNoteTitle('')
  }

  // fuzzy-search configuration
  const fuzzySearcher = useMemo(() => {
    return new FuzzySearch(purchasedNotes, ['name', 'subject', 'branch', 'year'], {
      caseSensitive: false,
      sort: true
    })
  }, [purchasedNotes])

  // Filter notes using fuzzy search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return purchasedNotes
    }
    
    return fuzzySearcher.search(searchQuery.trim())
  }, [searchQuery, fuzzySearcher])

  return (
    <YStack flex={1} bg="$background">
      <TabHeader page_name="My Purchases" />

      {/* Content */}
      <ScrollView flex={1} p="$4">
        <YStack gap="$4">
          {/* Search Bar */}
          <XStack alignItems="center" gap="$2" p="$2" bg="$color2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <Search size={20} color="$color10" />
            <Input
              flex={1}
              placeholder="Search purchased notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              bg="transparent"
              borderWidth={0}
              fontSize="$4"
            />
          </XStack>

          {/* Loading State */}
          {loading && (
            <YStack alignItems="center" justifyContent="center" p="$6">
              <Spinner size="large" color="$blue10" />
              <Text fontSize="$4" color="$color10" mt="$3">
                Loading your purchases...
              </Text>
            </YStack>
          )}

          {/* Error State */}
          {error && (
            <YStack alignItems="center" gap="$3" p="$6">
              <AlertCircle size={48} color="$red10" />
              <Text fontSize="$4" color="$red10" textAlign="center">
                Failed to load purchases
              </Text>
              <Text fontSize="$3" color="$color8" textAlign="center">
                {error}
              </Text>
              <Button
                size="$3"
                theme="blue"
                onPress={() => {
                  const loadPurchasedNotes = async () => {
                    setLoading(true)
                    setError(null)
                    const { data, error: fetchError } = await fetchUserPurchasesWithNotes()
                    if (fetchError) {
                      setError(fetchError)
                    } else {
                      const transformedNotes = (data || []).map(transformPurchaseToNote)
                      setPurchasedNotes(transformedNotes)
                    }
                    setLoading(false)
                  }
                  loadPurchasedNotes()
                }}
              >
                Retry
              </Button>
            </YStack>
          )}

          {/* Quick Stats */}
          {!loading && !error && (
            <XStack gap="$3">
              <Card flex={1} p="$3" bg="#f0f9ff" borderColor="#0ea5e9">
                <YStack alignItems="center" gap="$2">
                  <Text fontSize="$6" fontWeight="bold" color="#0ea5e9">
                    {purchasedNotes.length}
                  </Text>
                  <Text fontSize="$2" color="#0369a1">
                    Total Items
                  </Text>
                </YStack>
              </Card>
              <Card flex={1} p="$3" bg="#f0fdf4" borderColor="#16a34a">
                <YStack alignItems="center" gap="$2">
                  <Text fontSize="$6" fontWeight="bold" color="#16a34a">
                    ₹{purchasedNotes.reduce((sum, note) => sum + note.purchasePrice, 0).toFixed(2)}
                  </Text>
                  <Text fontSize="$2" color="#15803d">
                    Total Spent
                  </Text>
                </YStack>
              </Card>
            </XStack>
          )}

          {/* Purchased Notes List */}
          {!loading && !error && (
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="bold" color="#1a1a1a">
                My Purchased Notes
              </Text>
              
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <PurchasedNoteCard
                    key={note.id}
                    note={note}
                    onRead={handleReadPdf}
                  />
                ))
              ) : (
                <Card p="$6" alignItems="center">
                  <YStack alignItems="center" gap="$3">
                    <ShoppingBag size={48} color="$color8" />
                    <Text fontSize="$4" color="$color10" textAlign="center">
                      {searchQuery ? 'No purchased notes found matching your search.' : 'No purchased notes yet.'}
                    </Text>
                    {!searchQuery && (
                      <Text fontSize="$3" color="$color8" textAlign="center">
                        Purchase some notes to see them here!
                      </Text>
                    )}
                  </YStack>
                </Card>
              )}
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* PDF Viewer */}
      <PdfViewer
        isOpen={isPdfViewerOpen}
        onClose={handleClosePdfViewer}
        pdfUrls={selectedPdfUrls}
        noteTitle={selectedNoteTitle}
      />
    </YStack>
  )
}

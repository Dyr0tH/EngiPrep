import { YStack, XStack, H2, Text, Button, ScrollView, Input, Spinner } from '@my/ui'
import { useState, useMemo, useEffect } from 'react'
import { Search, AlertCircle } from '@tamagui/lucide-icons'
import FuzzySearch from 'fuzzy-search'
import { PYQCard, PYQ } from './pyq-card'
import { TabHeader } from '../../components/tab-header'
import { fetchPYQs } from '../../lib/services/pyqs'

export function PYQsScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pyqs, setPyqs] = useState<PYQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch PYQs data on component mount
  useEffect(() => {
    const loadPYQs = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await fetchPYQs()
        
        if (fetchError) {
          setError('Failed to load PYQs. Please try again.')
        } else {
          setPyqs(data || [])
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error('Error loading PYQs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPYQs()
  }, [])

  const handleDownload = (pdfUrl: string) => {
    // TODO: Implement PDF download logic
    console.log('Download PDF:', pdfUrl)
  }

  const handleRetry = () => {
    const loadPYQs = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await fetchPYQs()
        
        if (fetchError) {
          setError('Failed to load PYQs. Please try again.')
        } else {
          setPyqs(data || [])
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error('Error loading PYQs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPYQs()
  }

  // Configure fuzzy search
  const fuzzySearch = useMemo(() => {
    return new FuzzySearch(pyqs, ['name', 'subject', 'branch', 'year'], {
      caseSensitive: false,
      sort: true
    })
  }, [pyqs])

  // Filter PYQs based on search query
  const filteredPYQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return pyqs
    }
    return fuzzySearch.search(searchQuery)
  }, [searchQuery, fuzzySearch, pyqs])

  return (
    <YStack flex={1} bg="$background">
      <TabHeader page_name="Previous Year Questions" />

      {/* Content */}
      <ScrollView flex={1} p="$4">
        <YStack gap="$4">
          {/* Search Bar */}
          <XStack alignItems="center" gap="$2" p="$2" bg="$color2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <Search size={20} color="$color10" />
            <Input
              flex={1}
              placeholder="Search PYQs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              bg="transparent"
              borderWidth={0}
              fontSize="$4"
            />
          </XStack>

          {/* PYQs List */}
          {loading ? (
            <YStack alignItems="center" py="$8">
              <Spinner size="large" color="$blue10" />
              <Text fontSize="$4" color="$color10" mt="$3">
                Loading PYQs...
              </Text>
            </YStack>
          ) : error ? (
            <YStack alignItems="center" py="$6" gap="$3">
              <AlertCircle size={48} color="$red10" />
              <Text fontSize="$4" color="$red10" textAlign="center">
                Error loading PYQs
              </Text>
              <Text fontSize="$3" color="$color8" textAlign="center">
                {error}
              </Text>
              <Button
                size="$3"
                backgroundColor="$blue10"
                color="white"
                onPress={handleRetry}
                mt="$2"
              >
                Try Again
              </Button>
            </YStack>
          ) : (
            <YStack gap="$3">
              {filteredPYQs.length > 0 ? (
                filteredPYQs.map((pyq) => (
                  <PYQCard
                    key={pyq.id}
                    pyq={pyq}
                    onDownload={handleDownload}
                  />
                ))
              ) : (
                <YStack alignItems="center" py="$8">
                  <Text fontSize="$4" color="$color10" textAlign="center">
                    {searchQuery.trim() ? 'No PYQs found matching your search.' : 'No PYQs available.'}
                  </Text>
                  {!searchQuery.trim() && (
                    <Text fontSize="$3" color="$color8" textAlign="center" mt="$2">
                      PYQs will appear here once they are added to the database.
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
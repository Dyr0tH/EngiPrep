import { YStack, XStack, H2, Text, Button, ScrollView, Input, Spinner } from '@my/ui'
import { useState, useMemo, useEffect } from 'react'
import { Search, AlertCircle } from '@tamagui/lucide-icons'
import FuzzySearch from 'fuzzy-search'
import { QuestionBankCard, QuestionBank } from './question-bank-card'
import { TabHeader } from '../../components/tab-header'
import { fetchQuestionBanks } from '../../lib/services/question-banks'

export function QuestionBanksScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Question Banks data on component mount
  useEffect(() => {
    const loadQuestionBanks = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await fetchQuestionBanks()
        
        if (fetchError) {
          setError('Failed to load question banks. Please try again.')
        } else {
          setQuestionBanks(data || [])
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error('Error loading question banks:', err)
      } finally {
        setLoading(false)
      }
    }

    loadQuestionBanks()
  }, [])

  const handleDownload = (pdfUrl: string) => {
    // TODO: Implement PDF download logic
    console.log('Download PDF:', pdfUrl)
  }

  const handleRetry = () => {
    const loadQuestionBanks = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await fetchQuestionBanks()
        
        if (fetchError) {
          setError('Failed to load question banks. Please try again.')
        } else {
          setQuestionBanks(data || [])
        }
      } catch (err) {
        setError('An unexpected error occurred.')
        console.error('Error loading question banks:', err)
      } finally {
        setLoading(false)
      }
    }

    loadQuestionBanks()
  }

  // Configure fuzzy search
  const fuzzySearch = useMemo(() => {
    return new FuzzySearch(questionBanks, ['name', 'subject', 'branch', 'year'], {
      caseSensitive: false,
      sort: true
    })
  }, [questionBanks])

  // Filter Question Banks based on search query
  const filteredQuestionBanks = useMemo(() => {
    if (!searchQuery.trim()) {
      return questionBanks
    }
    return fuzzySearch.search(searchQuery)
  }, [searchQuery, fuzzySearch])
  return (
    <YStack flex={1} bg="$background">
      <TabHeader page_name="Question Banks" />

      {/* Content */}
      <ScrollView flex={1} p="$4">
        <YStack gap="$4">
          {/* Search Bar */}
          <XStack alignItems="center" gap="$2" p="$2" bg="$color2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <Search size={20} color="$color10" />
            <Input
              flex={1}
              placeholder="Search question banks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              bg="transparent"
              borderWidth={0}
              fontSize="$4"
            />
          </XStack>

          {/* Question Banks List */}
          {loading ? (
            <YStack alignItems="center" py="$8">
              <Spinner size="large" color="$blue10" />
              <Text fontSize="$4" color="$color10" mt="$4">
                Loading question banks...
              </Text>
            </YStack>
          ) : error ? (
            <YStack alignItems="center" py="$8">
              <AlertCircle size={48} color="$red10" />
              <Text fontSize="$4" color="$red10" textAlign="center" mt="$4">
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
              {filteredQuestionBanks.length > 0 ? (
                filteredQuestionBanks.map((questionBank) => (
                  <QuestionBankCard
                    key={questionBank.id}
                    questionBank={questionBank}
                    onDownload={handleDownload}
                  />
                ))
              ) : (
                <YStack alignItems="center" py="$8">
                  <Text fontSize="$4" color="$color10" textAlign="center">
                    {searchQuery.trim() ? 'No question banks found matching your search.' : 'No question banks available.'}
                  </Text>
                  {!searchQuery.trim() && (
                    <Text fontSize="$3" color="$color8" textAlign="center" mt="$2">
                      Question banks will appear here once they are added to the database.
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
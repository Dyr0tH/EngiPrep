import { supabase } from '../supabase'

export interface PdfPageImage {
  pageNumber: number
  imageUrl: string // base64 data URL (data:image/png;base64,...)
  width: number
  height: number
}

export interface PdfConversionResult {
  success: boolean
  pages: PdfPageImage[]
  totalPages: number
  error?: string
}

/**
 * Convert PDF pages to images using canvas rendering
 * This service handles PDF to image conversion on the client side
 */
export class PdfService {
  private static pdfLib: any = null

  /**
   * Dynamically import PDF.js library
   */
  private static async loadPdfLib() {
    if (!this.pdfLib) {
      // For React Native, we'll need to use a different approach
      // This is a placeholder for the PDF processing logic
      throw new Error('PDF processing library not implemented yet')
    }
    return this.pdfLib
  }

  /**
   * Convert PDF from URL to array of image URLs
   */
  static async convertPdfToImages(
    pdfUrl: string,
    options: {
      scale?: number
      maxPages?: number
      startPage?: number
    } = {}
  ): Promise<PdfConversionResult> {
    try {
      // Send PDF URL to backend for conversion
      const response = await fetch('http://localhost:3000/api/pdf-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl: pdfUrl,
          options: {
            returnBase64: true, // Request base64 encoded images
            ...options
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'PDF conversion failed');
      }

      // Convert base64 strings to data URLs if needed
      const processedPages = data.pages.map((page: PdfPageImage) => ({
        ...page,
        imageUrl: page.imageUrl.startsWith('data:') 
          ? page.imageUrl 
          : `data:image/png;base64,${page.imageUrl}`
      }));

      return {
        success: true,
        pages: processedPages,
        totalPages: data.totalPages
      };

    } catch (error) {
      console.error('PDF conversion error:', error)
      return {
        success: false,
        pages: [],
        totalPages: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get secure PDF URL with authentication
   */
  static async getSecurePdfUrl(noteId: string): Promise<string | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Check if user has purchased this note
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('note_id', noteId)
        .single()

      if (purchaseError || !purchase) {
        throw new Error('Note not purchased by user')
      }

      // Get the note's PDF URL
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .select('pdf_url')
        .eq('id', noteId)
        .single()

      if (noteError || !note) {
        throw new Error('Note not found')
      }

      return note.pdf_url

    } catch (error) {
      console.error('Error getting secure PDF URL:', error)
      return null
    }
  }

  /**
   * Cache converted images in memory for better performance
   */
  private static imageCache = new Map<string, PdfPageImage[]>()

  /**
   * Get cached images or convert PDF if not cached
   */
  static async getCachedPdfImages(
    pdfUrl: string,
    options?: { scale?: number; maxPages?: number; startPage?: number }
  ): Promise<PdfConversionResult> {
    const cacheKey = `${pdfUrl}_${JSON.stringify(options)}`
    
    if (this.imageCache.has(cacheKey)) {
      const cachedPages = this.imageCache.get(cacheKey)!
      return {
        success: true,
        pages: cachedPages,
        totalPages: cachedPages.length
      }
    }

    const result = await this.convertPdfToImages(pdfUrl, options)
    
    if (result.success) {
      this.imageCache.set(cacheKey, result.pages)
    }

    return result
  }

  /**
   * Clear image cache to free memory
   */
  static clearCache(): void {
    this.imageCache.clear()
  }
}
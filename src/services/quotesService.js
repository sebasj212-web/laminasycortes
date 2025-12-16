import { storage } from '../utils/storage.js';

// Storage key for quotes
const QUOTES_KEY = 'quotes_app_quotes';

/**
 * Generate a unique ID for quotes
 */
function generateId() {
  return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a quote number (sequential)
 */
function generateQuoteNumber(existingQuotes) {
  if (!existingQuotes || existingQuotes.length === 0) {
    return 'COT-001';
  }

  const lastNumber = existingQuotes
    .map(q => {
      const match = q.number.match(/COT-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .reduce((max, num) => Math.max(max, num), 0);

  const nextNumber = lastNumber + 1;
  return `COT-${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Quotes Service
 * Manages quote creation, retrieval, update, and deletion
 */
const QuotesService = {
  /**
   * Create a new quote
   * @param {Object} quoteData - Quote data
   * @param {Object} quoteData.client - Client information
   * @param {string} quoteData.client.name - Client name
   * @param {string} quoteData.client.email - Client email
   * @param {string} quoteData.client.phone - Client phone
   * @param {Object} quoteData.product - Product information
   * @param {string} quoteData.product.description - Product description
   * @param {number} quoteData.product.quantity - Quantity
   * @param {number} quoteData.product.unitPrice - Unit price
   * @param {string} currentUserEmail - Email of the user creating the quote
   * @returns {Object} Created quote
   */
  createQuote(quoteData, currentUserEmail) {
    if (!quoteData) {
      throw new Error('Quote data is required');
    }

    if (!quoteData.client || !quoteData.client.name) {
      throw new Error('Client name is required');
    }

    if (!quoteData.product || !quoteData.product.description) {
      throw new Error('Product description is required');
    }

    if (!quoteData.product.quantity || quoteData.product.quantity <= 0) {
      throw new Error('Valid product quantity is required');
    }

    if (!quoteData.product.unitPrice || quoteData.product.unitPrice <= 0) {
      throw new Error('Valid product unit price is required');
    }

    const existingQuotes = this.getAllQuotes();

    const newQuote = {
      id: generateId(),
      number: generateQuoteNumber(existingQuotes),
      client: {
        name: quoteData.client.name,
        email: quoteData.client.email || '',
        phone: quoteData.client.phone || ''
      },
      product: {
        description: quoteData.product.description,
        quantity: Number(quoteData.product.quantity),
        unitPrice: Number(quoteData.product.unitPrice),
        subtotal: Number(quoteData.product.quantity) * Number(quoteData.product.unitPrice),
        iva: (Number(quoteData.product.quantity) * Number(quoteData.product.unitPrice)) * 0.16,
        total: (Number(quoteData.product.quantity) * Number(quoteData.product.unitPrice)) * 1.16
      },
      createdAt: new Date().toISOString(),
      createdBy: currentUserEmail || 'anonymous'
    };

    const quotes = [...existingQuotes, newQuote];
    storage.setItem(QUOTES_KEY, quotes);

    return newQuote;
  },

  /**
   * Get all quotes
   * @returns {Array} Array of quotes
   */
  getAllQuotes() {
    return storage.getItem(QUOTES_KEY, []);
  },

  /**
   * Get a quote by ID
   * @param {string} quoteId - Quote ID
   * @returns {Object|null} Quote or null if not found
   */
  getQuoteById(quoteId) {
    if (!quoteId) {
      return null;
    }

    const quotes = this.getAllQuotes();
    return quotes.find(quote => quote.id === quoteId) || null;
  },

  /**
   * Update a quote
   * @param {string} quoteId - Quote ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated quote or null if not found
   */
  updateQuote(quoteId, updates) {
    if (!quoteId) {
      throw new Error('Quote ID is required');
    }

    const quotes = this.getAllQuotes();
    const quoteIndex = quotes.findIndex(quote => quote.id === quoteId);

    if (quoteIndex === -1) {
      return null;
    }

    // Validate updates if they include product data
    if (updates.product) {
      if (updates.product.quantity !== undefined && updates.product.quantity <= 0) {
        throw new Error('Valid product quantity is required');
      }
      if (updates.product.unitPrice !== undefined && updates.product.unitPrice <= 0) {
        throw new Error('Valid product unit price is required');
      }
    }

    const quantity = updates.product?.quantity || quotes[quoteIndex].product.quantity;
    const unitPrice = updates.product?.unitPrice || quotes[quoteIndex].product.unitPrice;
    const subtotal = quantity * unitPrice;

    const updatedQuote = {
      ...quotes[quoteIndex],
      ...updates,
      // Recalculate subtotal, IVA, and total if product data changes
      product: updates.product ? {
        ...quotes[quoteIndex].product,
        ...updates.product,
        subtotal: subtotal,
        iva: subtotal * 0.16,
        total: subtotal * 1.16
      } : quotes[quoteIndex].product
    };

    quotes[quoteIndex] = updatedQuote;
    storage.setItem(QUOTES_KEY, quotes);

    return updatedQuote;
  },

  /**
   * Delete a quote
   * @param {string} quoteId - Quote ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteQuote(quoteId) {
    if (!quoteId) {
      return false;
    }

    const quotes = this.getAllQuotes();
    const filteredQuotes = quotes.filter(quote => quote.id !== quoteId);

    if (filteredQuotes.length === quotes.length) {
      return false; // Quote not found
    }

    storage.setItem(QUOTES_KEY, filteredQuotes);
    return true;
  },

  /**
   * Clear all quotes (useful for testing)
   * @returns {void}
   */
  clearAllQuotes() {
    storage.setItem(QUOTES_KEY, []);
  }
};

export default QuotesService;

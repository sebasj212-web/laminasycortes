/**
 * Quotes Service - Database Version
 * Manages quote operations using Supabase PostgreSQL database
 *
 * This replaces the localStorage-based quotesService.js with real database operations.
 */

import { supabase, TABLES, getCurrentUserId } from '../config/supabase.js';

/**
 * Helper to handle Supabase errors
 */
function handleSupabaseError(error, operation) {
  console.error(`Error in ${operation}:`, error);
  throw new Error(`Database error: ${error.message || 'Unknown error occurred'}`);
}

/**
 * Helper to validate quote data
 */
function validateQuoteData(quoteData) {
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

  if (quoteData.product.unitPrice === undefined || quoteData.product.unitPrice === null || quoteData.product.unitPrice < 0) {
    throw new Error('Valid product unit price is required');
  }
}

/**
 * Calculate product totals (subtotal, IVA, total)
 */
function calculateTotals(quantity, unitPrice) {
  const subtotal = Number(quantity) * Number(unitPrice);
  const iva = subtotal * 0.16;
  const total = subtotal * 1.16;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}

/**
 * Quotes Service (Database Version)
 * All methods are async and interact with Supabase
 */
const QuotesServiceDB = {
  /**
   * Create a new quote in the database
   * @param {Object} quoteData - Quote data
   * @param {Object} quoteData.client - Client information
   * @param {string} quoteData.client.name - Client name
   * @param {string} quoteData.client.email - Client email (optional)
   * @param {string} quoteData.client.phone - Client phone (optional)
   * @param {Object} quoteData.product - Product information
   * @param {string} quoteData.product.description - Product description
   * @param {number} quoteData.product.quantity - Quantity
   * @param {number} quoteData.product.unitPrice - Unit price
   * @returns {Promise<Object>} Created quote
   */
  async createQuote(quoteData) {
    // Validate input
    validateQuoteData(quoteData);

    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to create quotes');
    }

    // Calculate totals
    const totals = calculateTotals(
      quoteData.product.quantity,
      quoteData.product.unitPrice
    );

    // Get next quote number using database function
    const { data: numberData, error: numberError } = await supabase
      .rpc('get_next_quote_number');

    if (numberError) {
      handleSupabaseError(numberError, 'getting next quote number');
    }

    const quoteNumber = numberData || 'COT-001';

    // Prepare quote data for database
    const newQuote = {
      number: quoteNumber,
      user_id: userId,
      client_name: quoteData.client.name,
      client_email: quoteData.client.email || '',
      client_phone: quoteData.client.phone || '',
      product_description: quoteData.product.description,
      product_quantity: Number(quoteData.product.quantity),
      product_unit_price: Number(quoteData.product.unitPrice),
      product_subtotal: totals.subtotal,
      product_iva: totals.iva,
      product_total: totals.total
    };

    // Insert into database
    const { data, error } = await supabase
      .from(TABLES.QUOTES)
      .insert([newQuote])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'creating quote');
    }

    // Transform database format to application format
    return this.transformQuoteFromDB(data);
  },

  /**
   * Get all quotes for the current user
   * @returns {Promise<Array>} Array of quotes
   */
  async getAllQuotes() {
    const userId = await getCurrentUserId();
    if (!userId) {
      return []; // Return empty array if not authenticated
    }

    const { data, error } = await supabase
      .from(TABLES.QUOTES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'getting all quotes');
    }

    return (data || []).map(quote => this.transformQuoteFromDB(quote));
  },

  /**
   * Get a quote by ID
   * @param {string} quoteId - Quote ID (UUID)
   * @returns {Promise<Object|null>} Quote or null if not found
   */
  async getQuoteById(quoteId) {
    if (!quoteId) {
      return null;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from(TABLES.QUOTES)
      .select('*')
      .eq('id', quoteId)
      .eq('user_id', userId) // Ensure user can only access their own quotes
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      handleSupabaseError(error, 'getting quote by ID');
    }

    return data ? this.transformQuoteFromDB(data) : null;
  },

  /**
   * Update a quote
   * @param {string} quoteId - Quote ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated quote or null if not found
   */
  async updateQuote(quoteId, updates) {
    if (!quoteId) {
      throw new Error('Quote ID is required');
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated');
    }

    // Get existing quote first
    const existingQuote = await this.getQuoteById(quoteId);
    if (!existingQuote) {
      return null;
    }

    // Prepare update data
    const updateData = {};

    // Update client fields if provided
    if (updates.client) {
      if (updates.client.name !== undefined) {
        updateData.client_name = updates.client.name;
      }
      if (updates.client.email !== undefined) {
        updateData.client_email = updates.client.email;
      }
      if (updates.client.phone !== undefined) {
        updateData.client_phone = updates.client.phone;
      }
    }

    // Update product fields if provided
    if (updates.product) {
      if (updates.product.description !== undefined) {
        updateData.product_description = updates.product.description;
      }
      if (updates.product.quantity !== undefined) {
        if (updates.product.quantity <= 0) {
          throw new Error('Valid product quantity is required');
        }
        updateData.product_quantity = Number(updates.product.quantity);
      }
      if (updates.product.unitPrice !== undefined) {
        if (updates.product.unitPrice < 0) {
          throw new Error('Valid product unit price is required');
        }
        updateData.product_unit_price = Number(updates.product.unitPrice);
      }

      // Recalculate totals if quantity or price changed
      if (updateData.product_quantity !== undefined || updateData.product_unit_price !== undefined) {
        const quantity = updateData.product_quantity !== undefined
          ? updateData.product_quantity
          : existingQuote.product.quantity;

        const unitPrice = updateData.product_unit_price !== undefined
          ? updateData.product_unit_price
          : existingQuote.product.unitPrice;

        const totals = calculateTotals(quantity, unitPrice);
        updateData.product_subtotal = totals.subtotal;
        updateData.product_iva = totals.iva;
        updateData.product_total = totals.total;
      }
    }

    // Perform update
    const { data, error } = await supabase
      .from(TABLES.QUOTES)
      .update(updateData)
      .eq('id', quoteId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'updating quote');
    }

    return data ? this.transformQuoteFromDB(data) : null;
  },

  /**
   * Delete a quote
   * @param {string} quoteId - Quote ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteQuote(quoteId) {
    if (!quoteId) {
      return false;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from(TABLES.QUOTES)
      .delete()
      .eq('id', quoteId)
      .eq('user_id', userId);

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return false;
      }
      handleSupabaseError(error, 'deleting quote');
    }

    return true;
  },

  /**
   * Transform database format to application format
   * Converts snake_case database fields to camelCase application fields
   * @private
   */
  transformQuoteFromDB(dbQuote) {
    return {
      id: dbQuote.id,
      number: dbQuote.number,
      client: {
        name: dbQuote.client_name,
        email: dbQuote.client_email || '',
        phone: dbQuote.client_phone || ''
      },
      product: {
        description: dbQuote.product_description,
        quantity: dbQuote.product_quantity,
        unitPrice: dbQuote.product_unit_price,
        subtotal: dbQuote.product_subtotal,
        iva: dbQuote.product_iva,
        total: dbQuote.product_total
      },
      createdAt: dbQuote.created_at,
      updatedAt: dbQuote.updated_at
    };
  },

  /**
   * Clear all quotes for current user (useful for testing)
   * WARNING: This deletes all quotes for the authenticated user
   * @returns {Promise<void>}
   */
  async clearAllQuotes() {
    const userId = await getCurrentUserId();
    if (!userId) {
      return;
    }

    const { error } = await supabase
      .from(TABLES.QUOTES)
      .delete()
      .eq('user_id', userId);

    if (error) {
      handleSupabaseError(error, 'clearing all quotes');
    }
  }
};

export default QuotesServiceDB;

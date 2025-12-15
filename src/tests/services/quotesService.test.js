import QuotesService from '../../services/quotesService.js';
import { storage } from '../../utils/storage.js';

describe('QuotesService', () => {
  beforeEach(() => {
    storage.clear();
    jest.clearAllMocks();
  });

  describe('createQuote', () => {
    it('should create a quote with valid data', () => {
      const quoteData = {
        client: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '555-1234'
        },
        product: {
          description: 'Lámina de acero 2x1m',
          quantity: 5,
          unitPrice: 1500
        }
      };

      const result = QuotesService.createQuote(quoteData, 'user@example.com');

      expect(result).toMatchObject({
        number: 'COT-001',
        client: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '555-1234'
        },
        product: {
          description: 'Lámina de acero 2x1m',
          quantity: 5,
          unitPrice: 1500,
          total: 7500
        },
        createdBy: 'user@example.com'
      });

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();

      // Verificar que se guardó en storage
      const savedQuotes = QuotesService.getAllQuotes();
      expect(savedQuotes).toHaveLength(1);
      expect(savedQuotes[0]).toEqual(result);
    });

    it('should generate sequential quote numbers', () => {
      // Crear dos cotizaciones primero
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const quote1 = QuotesService.createQuote(quoteData);
      const quote2 = QuotesService.createQuote(quoteData);

      expect(quote1.number).toBe('COT-001');
      expect(quote2.number).toBe('COT-002');

      // La tercera debe ser COT-003
      const quote3 = QuotesService.createQuote(quoteData);
      expect(quote3.number).toBe('COT-003');
    });

    it('should calculate product total correctly', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: {
          description: 'Test product',
          quantity: 10,
          unitPrice: 250.50
        }
      };

      const result = QuotesService.createQuote(quoteData);

      expect(result.product.total).toBe(2505);
    });

    it('should set default values for optional client fields', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const result = QuotesService.createQuote(quoteData);

      expect(result.client.email).toBe('');
      expect(result.client.phone).toBe('');
    });

    it('should set createdBy to anonymous if no user provided', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const result = QuotesService.createQuote(quoteData);

      expect(result.createdBy).toBe('anonymous');
    });

    it('should throw error if quote data is missing', () => {
      expect(() => {
        QuotesService.createQuote(null);
      }).toThrow('Quote data is required');
    });

    it('should throw error if client name is missing', () => {
      expect(() => {
        QuotesService.createQuote({
          client: {},
          product: { description: 'Test', quantity: 1, unitPrice: 100 }
        });
      }).toThrow('Client name is required');
    });

    it('should throw error if product description is missing', () => {
      expect(() => {
        QuotesService.createQuote({
          client: { name: 'Test' },
          product: { quantity: 1, unitPrice: 100 }
        });
      }).toThrow('Product description is required');
    });

    it('should throw error if product quantity is invalid', () => {
      expect(() => {
        QuotesService.createQuote({
          client: { name: 'Test' },
          product: { description: 'Test', quantity: 0, unitPrice: 100 }
        });
      }).toThrow('Valid product quantity is required');
    });

    it('should throw error if product unit price is invalid', () => {
      expect(() => {
        QuotesService.createQuote({
          client: { name: 'Test' },
          product: { description: 'Test', quantity: 1, unitPrice: -10 }
        });
      }).toThrow('Valid product unit price is required');
    });
  });

  describe('getAllQuotes', () => {
    it('should return all quotes from storage', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      // Crear dos cotizaciones
      const quote1 = QuotesService.createQuote(quoteData);
      const quote2 = QuotesService.createQuote(quoteData);

      const result = QuotesService.getAllQuotes();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(quote1);
      expect(result[1]).toEqual(quote2);
    });

    it('should return empty array if no quotes exist', () => {
      const result = QuotesService.getAllQuotes();

      expect(result).toEqual([]);
    });
  });

  describe('getQuoteById', () => {
    it('should return quote with matching ID', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const quote1 = QuotesService.createQuote(quoteData);
      const quote2 = QuotesService.createQuote(quoteData);

      const result = QuotesService.getQuoteById(quote2.id);

      expect(result).toEqual(quote2);
    });

    it('should return null if quote not found', () => {
      const result = QuotesService.getQuoteById('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null if ID is not provided', () => {
      const result = QuotesService.getQuoteById(null);

      expect(result).toBeNull();
    });
  });

  describe('updateQuote', () => {
    it('should update quote successfully', () => {
      const quoteData = {
        client: { name: 'John' },
        product: { description: 'Old', quantity: 1, unitPrice: 100 }
      };

      const quote = QuotesService.createQuote(quoteData);

      const updates = {
        client: { name: 'John Updated' }
      };

      const result = QuotesService.updateQuote(quote.id, updates);

      expect(result.client.name).toBe('John Updated');

      // Verificar que se guardó
      const savedQuote = QuotesService.getQuoteById(quote.id);
      expect(savedQuote.client.name).toBe('John Updated');
    });

    it('should recalculate total when product data changes', () => {
      const quoteData = {
        client: { name: 'John' },
        product: { description: 'Product', quantity: 2, unitPrice: 100 }
      };

      const quote = QuotesService.createQuote(quoteData);

      const updates = {
        product: { quantity: 5 }
      };

      const result = QuotesService.updateQuote(quote.id, updates);

      expect(result.product.quantity).toBe(5);
      expect(result.product.unitPrice).toBe(100);
      expect(result.product.total).toBe(500);
    });

    it('should return null if quote not found', () => {
      const result = QuotesService.updateQuote('nonexistent', {});

      expect(result).toBeNull();
    });

    it('should throw error if ID is not provided', () => {
      expect(() => {
        QuotesService.updateQuote(null, {});
      }).toThrow('Quote ID is required');
    });

    it('should throw error if product quantity is invalid', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const quote = QuotesService.createQuote(quoteData);

      expect(() => {
        QuotesService.updateQuote(quote.id, {
          product: { quantity: -5 }
        });
      }).toThrow('Valid product quantity is required');
    });

    it('should throw error if product unit price is invalid', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const quote = QuotesService.createQuote(quoteData);

      expect(() => {
        QuotesService.updateQuote(quote.id, {
          product: { unitPrice: 0 }
        });
      }).toThrow('Valid product unit price is required');
    });
  });

  describe('deleteQuote', () => {
    it('should delete quote successfully', () => {
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      const quote1 = QuotesService.createQuote(quoteData);
      const quote2 = QuotesService.createQuote(quoteData);

      const result = QuotesService.deleteQuote(quote1.id);

      expect(result).toBe(true);

      // Verificar que se eliminó
      const quotes = QuotesService.getAllQuotes();
      expect(quotes).toHaveLength(1);
      expect(quotes[0]).toEqual(quote2);
    });

    it('should return false if quote not found', () => {
      const result = QuotesService.deleteQuote('nonexistent');

      expect(result).toBe(false);
    });

    it('should return false if ID is not provided', () => {
      const result = QuotesService.deleteQuote(null);

      expect(result).toBe(false);
    });
  });

  describe('clearAllQuotes', () => {
    it('should clear all quotes from storage', () => {
      // Crear algunas cotizaciones
      const quoteData = {
        client: { name: 'Test' },
        product: { description: 'Test', quantity: 1, unitPrice: 100 }
      };

      QuotesService.createQuote(quoteData);
      QuotesService.createQuote(quoteData);

      // Verificar que hay cotizaciones
      expect(QuotesService.getAllQuotes()).toHaveLength(2);

      // Limpiar
      QuotesService.clearAllQuotes();

      // Verificar que se limpiaron
      expect(QuotesService.getAllQuotes()).toHaveLength(0);
    });
  });
});

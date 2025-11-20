interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name?: string;
    brands?: string;
    image_url?: string;
    nutriments?: {
      sugars_100g?: number;
      caffeine_100g?: number;
      'energy-kcal_100g'?: number;
    };
    quantity?: string;
    categories?: string;
    nutrition_grade_fr?: string;
  };
  status: number;
  status_verbose: string;
}

export interface ProductInfo {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  nutrients: {
    sugars: number; // per 100g
    caffeine: number; // per 100g
    calories: number; // per 100g
  };
  quantity?: string;
  categories?: string;
  nutritionGrade?: string;
}

export class OpenFoodFactsService {
  private static readonly BASE_URL = 'https://world.openfoodfacts.org';

  static async getProductByBarcode(barcode: string): Promise<ProductInfo | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${this.BASE_URL}/product/${barcode}.json`,
        { 
          signal: controller.signal,
          headers: { 'User-Agent': 'GlycAmed-Backend/1.0' }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenFoodFactsProduct = await response.json();

      if (data.status === 0) {
        return null; // Product not found
      }

      const product = data.product;
      
      return {
        barcode,
        name: product.product_name || 'Unknown product',
        brand: product.brands || 'Unknown brand',
        imageUrl: product.image_url,
        nutrients: {
          sugars: product.nutriments?.sugars_100g || 0,
          caffeine: product.nutriments?.caffeine_100g || 0,
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
        },
        quantity: product.quantity,
        categories: product.categories,
        nutritionGrade: product.nutrition_grade_fr,
      };
    } catch (error) {
      console.error('Error fetching product from Open Food Facts:', error);
      return null;
    }
  }

  static async searchProducts(query: string): Promise<ProductInfo[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const params = new URLSearchParams({
        search_terms: query,
        search_simple: '1',
        action: 'process',
        json: '1',
        page_size: '20',
        fields: 'code,product_name,brands,image_url,nutriments,quantity,categories,nutrition_grade_fr'
      });

      const response = await fetch(
        `${this.BASE_URL}/cgi/search.pl?${params}`,
        { 
          signal: controller.signal,
          headers: { 'User-Agent': 'GlycAmed-Backend/1.0' }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.products) {
        return [];
      }

      return data.products.map((product: any): ProductInfo => ({
        barcode: product.code,
        name: product.product_name || 'Unknown product',
        brand: product.brands || 'Unknown brand',
        imageUrl: product.image_url,
        nutrients: {
          sugars: product.nutriments?.sugars_100g || 0,
          caffeine: product.nutriments?.caffeine_100g || 0,
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
        },
        quantity: product.quantity,
        categories: product.categories,
        nutritionGrade: product.nutrition_grade_fr,
      }));
    } catch (error) {
      console.error('Error searching products from Open Food Facts:', error);
      return [];
    }
  }

  static calculateNutrients(nutrients: { sugars: number; caffeine: number; calories: number }, quantity: number): {
    sugars: number;
    caffeine: number;
    calories: number;
  } {
    // Calculate based on quantity (assuming quantity is in grams)
    const factor = quantity / 100;
    
    return {
      sugars: Math.round((nutrients.sugars * factor) * 100) / 100,
      caffeine: Math.round((nutrients.caffeine * factor) * 100) / 100,
      calories: Math.round((nutrients.calories * factor) * 100) / 100,
    };
  }
}
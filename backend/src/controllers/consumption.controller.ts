import { Request, Response } from 'express';
import { ConsumptionService } from '../services/consumption.service';
import { OpenFoodFactsService } from '../services/openFoodFacts.service';
import { CreateConsumptionDto, UpdateConsumptionDto, ConsumptionFilterDto, ProductSearchDto } from '../types/dtos/consumption.dto';

export class ConsumptionController {
  static async createConsumption(req: Request, res: Response): Promise<void> {
    try {
      const contributorId = req.userId!;
      const consumptionData: CreateConsumptionDto = req.body;

      const consumption = await ConsumptionService.createConsumption(
        consumptionData.userId, 
        contributorId, 
        consumptionData
      );
      res.status(201).json({ success: true, data: consumption });
    } catch (err) {
      res.status(400).json({ success: false, error: (err as Error).message });
    }
  }

  static async getConsumptions(req: Request, res: Response): Promise<void> {
    try {
      const filters: ConsumptionFilterDto = {
        userId: req.query.userId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        productName: req.query.productName as string,
        contributor: req.query.contributor as string,
        location: req.query.location as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      // Use userId from filters or default to the authenticated user
      const userId = filters.userId || req.userId!;

      const result = await ConsumptionService.getConsumptions(userId, filters);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async getConsumption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const consumption = await ConsumptionService.getConsumptionById(id);
      
      if (!consumption) {
        res.status(404).json({ success: false, error: 'Consumption not found' });
        return;
      }

      res.json({ success: true, data: consumption });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async updateConsumption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contributorId = req.userId!;
      const updateData: UpdateConsumptionDto = req.body;

      const consumption = await ConsumptionService.updateConsumption(id, contributorId, updateData);
      res.json({ success: true, data: consumption });
    } catch (err) {
      const status = (err as Error).message.includes('not found or you are not authorized') ? 404 : 400;
      res.status(status).json({ success: false, error: (err as Error).message });
    }
  }

  static async deleteConsumption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const contributorId = req.userId!;

      const deleted = await ConsumptionService.deleteConsumption(id, contributorId);
      
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Consumption not found or you are not authorized to delete it' });
        return;
      }

      res.json({ success: true, message: 'Consumption deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { barcode, query }: ProductSearchDto = req.query;

      if (!barcode && !query) {
        res.status(400).json({ 
          success: false, 
          error: 'Either barcode or query parameter is required' 
        });
        return;
      }

      const products = await ConsumptionService.searchProducts(barcode, query);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async getProductByBarcode(req: Request, res: Response): Promise<void> {
    try {
      const { barcode } = req.params;
      const product = await OpenFoodFactsService.getProductByBarcode(barcode);
      
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async calculateNutrients(req: Request, res: Response): Promise<void> {
    try {
      const { barcode, quantity } = req.body;

      if (!barcode || !quantity) {
        res.status(400).json({ 
          success: false, 
          error: 'Barcode and quantity are required' 
        });
        return;
      }

      const product = await OpenFoodFactsService.getProductByBarcode(barcode);
      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      const calculatedNutrients = OpenFoodFactsService.calculateNutrients(product.nutrients, quantity);
      
      res.json({ 
        success: true, 
        data: {
          product: product,
          quantity: quantity,
          calculatedNutrients: calculatedNutrients
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }

  static async getNutrientsSummary(req: Request, res: Response): Promise<void> {
    try {
      const { userId, startDate, endDate } = req.query;
      
      // Use userId from query or default to the authenticated user
      const targetUserId = (userId as string) || req.userId!;
      
      const summary = await ConsumptionService.getNutrientsSummary(
        targetUserId,
        startDate as string,
        endDate as string
      );

      res.json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  }
}
import Consumption, { IConsumption } from '../models/consumption.model';
import { CreateConsumptionDto, UpdateConsumptionDto, ConsumptionFilterDto } from '../types/dtos/consumption.dto';
import mongoose from 'mongoose';
import { OpenFoodFactsService } from './openFoodFacts.service';

export class ConsumptionService {
  static async createConsumption(
    userId: string,
    contributorId: string, 
    consumptionData: CreateConsumptionDto
  ): Promise<IConsumption> {
    const consumption = new Consumption({
      user: userId, // The user being tracked
      contributor: contributorId, // Who is adding this
      ...consumptionData,
      date: consumptionData.date || new Date(),
    });

    await consumption.save();
    return await this.getConsumptionById(consumption._id.toString());
  }

  static async getConsumptions(userId: string, filters: ConsumptionFilterDto = {}): Promise<{
    consumptions: IConsumption[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100); // Max 100 items per page
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { user: userId };

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    if (filters.productName) {
      query.productName = { $regex: filters.productName, $options: 'i' };
    }

    if (filters.contributor) {
      query.contributor = filters.contributor;
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    // Execute queries
    const [consumptions, total] = await Promise.all([
      Consumption.find(query)
        .populate('contributor', 'name firstname email')
        .sort({ date: -1 }) // Most recent first
        .skip(skip)
        .limit(limit),
      Consumption.countDocuments(query),
    ]);

    return {
      consumptions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getConsumptionById(id: string): Promise<IConsumption | null> {
    return await Consumption.findById(id)
      .populate('contributor', 'name firstname email');
  }

  static async updateConsumption(
    id: string,
    contributorId: string,
    updateData: UpdateConsumptionDto
  ): Promise<IConsumption | null> {
    // Check if the consumption exists and belongs to the contributor
    const consumption = await Consumption.findOne({ 
      _id: id, 
      contributor: contributorId 
    });

    if (!consumption) {
      throw new Error('Consumption not found or you are not authorized to update it');
    }

    // Update consumption
    Object.assign(consumption, updateData);
    await consumption.save();

    return await this.getConsumptionById(id);
  }

  static async deleteConsumption(id: string, contributorId: string): Promise<boolean> {
    const result = await Consumption.deleteOne({ 
      _id: id, 
      contributor: contributorId 
    });

    return result.deletedCount > 0;
  }

  static async searchProducts(barcode?: string, query?: string) {
    if (barcode) {
      const product = await OpenFoodFactsService.getProductByBarcode(barcode);
      return product ? [product] : [];
    }

    if (query) {
      return await OpenFoodFactsService.searchProducts(query);
    }

    return [];
  }

  static async getNutrientsSummary(userId: string, startDate?: string, endDate?: string) {
        const matchQuery: any = { 
      user: new mongoose.Types.ObjectId(userId)
    };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const summary = await Consumption.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSugars: { $sum: '$nutrients.sugars' },
          totalCaffeine: { $sum: '$nutrients.caffeine' },
          totalCalories: { $sum: '$nutrients.calories' },
          totalConsumptions: { $sum: 1 },
        },
      },
    ]);

    return summary[0] || {
      totalSugars: 0,
      totalCaffeine: 0,
      totalCalories: 0,
      totalConsumptions: 0,
    };
  }
}
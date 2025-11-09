import { Router } from 'express';
import { ConsumptionController } from '../controllers/consumption.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Product search routes
router.get('/products/search', ConsumptionController.searchProducts);
router.get('/products/barcode/:barcode', ConsumptionController.getProductByBarcode);
router.post('/products/calculate-nutrients', ConsumptionController.calculateNutrients);

// Consumption CRUD routes
router.post('/', ConsumptionController.createConsumption);
router.get('/', ConsumptionController.getConsumptions);
router.get('/summary', ConsumptionController.getNutrientsSummary);
router.get('/:id', ConsumptionController.getConsumption);
router.put('/:id', ConsumptionController.updateConsumption);
router.delete('/:id', ConsumptionController.deleteConsumption);

export default router;
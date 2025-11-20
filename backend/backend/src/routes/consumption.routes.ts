import { Router } from 'express';
import { ConsumptionController } from '../controllers/consumption.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Consumption
 *   description: API for managing consumptions
 */

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Product search routes
/**
 * @swagger
 * /consumptions/products/search:
 *   get:
 *     summary: Search for products by name or criteria
 *     description: Retrieve a list of products matching the search criteria.
 *     tags: [Consumption]
 *     responses:
 *       200:
 *         description: A list of matching products.
 */
router.get('/products/search', ConsumptionController.searchProducts);

/**
 * @swagger
 * /consumptions/products/barcode/{barcode}:
 *   get:
 *     summary: Retrieve product details by barcode
 *     description: Fetch detailed information about a product using its barcode.
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: The barcode of the product.
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 */
router.get('/products/barcode/:barcode', ConsumptionController.getProductByBarcode);

/**
 * @swagger
 * /consumptions/products/calculate-nutrients:
 *   post:
 *     summary: Calculate nutrients for a product
 *     description: Provide nutrient information based on product details or ingredients.
 *     tags: [Consumption]
 *     responses:
 *       200:
 *         description: Nutrient calculation completed successfully.
 */
router.post('/products/calculate-nutrients', ConsumptionController.calculateNutrients);

// Consumption CRUD routes
/**
 * @swagger
 * /consumptions:
 *   post:
 *     summary: Create a new consumption record
 *     description: Add a new consumption entry for a user.
 *     tags: [Consumption]
 *     responses:
 *       201:
 *         description: Consumption record created successfully.
 */
router.post('/', ConsumptionController.createConsumption);

/**
 * @swagger
 * /consumptions:
 *   get:
 *     summary: Retrieve all consumption records
 *     description: Fetch a list of all consumptions for the authenticated user.
 *     tags: [Consumption]
 *     responses:
 *       200:
 *         description: List of consumption records retrieved successfully.
 */
router.get('/', ConsumptionController.getConsumptions);

/**
 * @swagger
 * /consumptions/summary:
 *   get:
 *     summary: Get a summary of nutrients
 *     description: Retrieve a summary of nutrients based on the user's consumption history.
 *     tags: [Consumption]
 *     responses:
 *       200:
 *         description: Nutrient summary retrieved successfully.
 */
router.get('/summary', ConsumptionController.getNutrientsSummary);

/**
 * @swagger
 * /consumptions/{id}:
 *   get:
 *     summary: Retrieve a specific consumption record
 *     description: Fetch details of a consumption record by its ID.
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the consumption record.
 *     responses:
 *       200:
 *         description: Consumption record retrieved successfully.
 */
router.get('/:id', ConsumptionController.getConsumption);

/**
 * @swagger
 * /consumptions/{id}:
 *   put:
 *     summary: Update a consumption record
 *     description: Modify the details of an existing consumption record by its ID.
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the consumption record.
 *     responses:
 *       200:
 *         description: Consumption record updated successfully.
 */
router.put('/:id', ConsumptionController.updateConsumption);

/**
 * @swagger
 * /consumptions/{id}:
 *   delete:
 *     summary: Delete a consumption record
 *     description: Remove a consumption record from the database by its ID.
 *     tags: [Consumption]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the consumption record.
 *     responses:
 *       204:
 *         description: Consumption record deleted successfully.
 */
router.delete('/:id', ConsumptionController.deleteConsumption);

export default router;
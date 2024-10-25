"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const upload_1 = __importDefault(require("../middleware/upload"));
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
router.post('/add', upload_1.default.single('image'), async (req, res) => {
    const { name, category, quantity, price, status, retailerId } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }
    try {
        const product = await Product_1.default.create({
            name,
            category,
            image: req.file.path,
            quantity: parseInt(quantity, 10),
            price: parseFloat(price),
            status,
            retailerId: parseInt(retailerId, 10)
        });
        res.status(201).json({ message: 'Product added successfully', product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
});
router.get('/', async (req, res) => {
    const { search, page = '1' } = req.query;
    const limit = 5;
    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
    }
    const offset = (pageNumber - 1) * limit;
    try {
        const products = await Product_1.default.findAndCountAll({
            where: {
                deletedAt: null,
                ...(search ? { name: { [sequelize_1.Op.like]: `%${search}%` } } : {}),
            },
            limit,
            offset
        });
        res.json({ data: products.rows, total: products.count, page: pageNumber });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product_1.default.findByPk(id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.default = router;

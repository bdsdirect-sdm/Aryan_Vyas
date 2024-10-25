import express from 'express';
import Product from '../models/Product';
import upload from '../middleware/upload';
import { Op } from 'sequelize';
import Retailer from '../models/Retailer';

const router = express.Router();

router.post('/add', upload.single('image'), async (req, res) => {
    const { name, category, quantity, price, status, retailerId } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    try {
        if (retailerId) {
            const retailer = await Retailer.findByPk(parseInt(retailerId, 10));
            if (!retailer) {
                return res.status(400).json({ message: 'Retailer does not exist' });
            }
        }

        const product = await Product.create({
            name,
            category,
            image: req.file.path,
            quantity: parseInt(quantity, 10),
            price: parseFloat(price),
            status,
            retailerId: retailerId ? parseInt(retailerId, 10) : null
        });

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
});


router.get('/', async (req, res) => {
    const { search, page = '1' } = req.query;
    const limit = 5;
    
    const pageNumber = parseInt(page as string, 10);
    
    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
    }
  
    const offset = (pageNumber - 1) * limit;
  
    try {
        const products = await Product.findAndCountAll({
            where: {
                deletedAt: null,
                ...(search ? { name: { [Op.like]: `%${search}%` } } : {}),
            },
            limit,
            offset
        });
        res.json({ data: products.rows, total: products.count, page: pageNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products'});
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product'});
    }
});


router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price, status } = req.body;
  
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      console.log(product)
  
      product.name = name;
      product.category = category;
      product.quantity = quantity;
      product.price = price;
      product.status = status;
  
 
      if (req.file) {
        product.image = req.file.path;
      }
  
      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  });

  
export default router;

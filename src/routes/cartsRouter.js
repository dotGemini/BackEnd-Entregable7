import { Router } from "express";
import { CartManager } from "../dao/cartManager/cartMaganer.js"

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    try{
        const newCart = await cartManager.createCart();
        res.send("Carrito Creado");
    }catch(error){
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
})

router.get("/:cid", async(req, res) => {
    try{
        const cartID = req.params.cid;
        const cart = await cartManager.getCart(cartID);
        res.send(cart);
    }catch(error){
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
})

router.put('/:cid', async (req, res) => {
    try{
        const cartID = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.addProductsToCart(cartID, products);
        res.send("Carrito actualizado");
    } catch(error){
        res.status(500).send('Error al obtener los datos');
    }
})

router.post("/:cid/product/:pid", async(req, res) => {
    try{
        const cartID = req.params.cid;
        const prodID = req.params.pid;
        const cartProd = await cartManager.addToCart(cartID, prodID);
        console.log("Test addCart Router")
        res.send("Agregado");
    }catch(error){
        console.error(error);
        res.status(500).send('Error al obtener los datos');
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const cart = await cartManager.removeFromCart(cartID, productID);
        res.send("Producto borrado")
    } catch (error) {
        res.send(`No se pudo borrar: ${error.message}`);
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try{
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartManager.updateProductQuantity(CartID, productID, quantity);
        res.send("Cantidad actualizada")
    } catch (error) {
        res.send(`Error al actualizar: ${error.message}`);
    }
})

router.delete('/:cid', async (req, res) => {
    const cartID = req.params.cid;

    try {
        const emptyCart = await cartManager.emptyCart(cartID);
        res.send(`Carrio vacio`);
    } catch (error) {
        res.send(`No se pudo vaciar carrito: ${error.message}`);
    }
})

export default router;
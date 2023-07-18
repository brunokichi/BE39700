import { ProductService } from "../service/product.service.js";

class ProductController{
    static getProducts = async (req,res)=>{
        const { limit, page, sort, title, stock } = req.query;
        try {
            const products = await ProductService.getProducts(limit, page, sort, title, stock);
            res.status(201).send({ status: "success", payload: products });
        } catch (e) {
            return res
            .status(400)
            .send({ status: "error", payload: "Se produjo un error al obtener los productos" });
          }
    };

    static getProductsById = async (req,res)=>{
        try {
            const product = await ProductService.getProductsById(req.params.pid);
            res.send(product);
        } catch (e) {
            return "Se produjo un error al obtener el producto";
        }
    };

    static addProduct = async (req,res)=>{
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;
        let image = "";
        if (req.file) {
            image = req.file.filename;
        } 
        const owner = req.user._id;
        try {
            const newProduct = await ProductService.addProduct(title, description, code, +price, status, +stock, category, thumbnail, image, owner);
            try {
                const products = await ProductService.getProducts();
                req.socketServer.emit("products", products.docs);
                res.send(newProduct);
            } catch (e) {
                return "Se produjo un error al obtener los productos";
            }
        } catch (e) {
            return "Se produjo un error al agregar el producto";
        }
    };

    static updateProduct = async (req,res)=>{
        const id = req.params.pid;
        const updateProductData = req.body;
        try {
            const updProduct = await ProductService.updateProduct(id, updateProductData);
            res.json(updProduct);
        } catch (e) {
            return "Se produjo un error al actualizar el producto";
        }
    };

    static deleteProduct = async (req,res)=>{
        const pid = req.params.pid;
        const userId = JSON.parse(JSON.stringify(req.user._id));
        const userRol = JSON.parse(JSON.stringify(req.user.rol));
    try {
        const delProduct = await ProductService.deleteProduct(pid, userId, userRol);
        res.json(delProduct);
    } catch (e) {
        return "Se produjo un error al eliminar el producto";
    }
    };
}

export { ProductController }


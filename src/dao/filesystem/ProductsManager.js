const fs = require("fs");

class ProductsManager {

    static path;

    static async getProducts() {
        if (fs.existsSync(this.path)) {
            let prods = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));

            return prods;
        } else {
            
            return [];
        }
    }

    static async addProduct(prod = {}) {

        let prods = await this.getProducts();

        let id = 1;

        if (prods.length > 0) {
            id = Math.max(...prods.map(idp => idp.id)) + 1;
        }

        let nuevoProd = { id, ...prod };
        prods.push(nuevoProd);

        await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 5), { encoding: "utf-8" });

        return nuevoProd;
    }

    static async updateProduct(id, aModificar = {}) {
        let prods = await this.getProducts();
        let indiceProd = prods.findIndex(prod => prod.id === id);

        if (indiceProd === -1) {
            throw new Error(`Error: no existe el producto con id ${id}`);
        }

        prods[indiceProd] = {
            ...prods[indiceProd],
            ...aModificar,
            id
        }

        await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 5), { encoding: "utf-8" });

        return prods[indiceProd];
    }

    static async deleteProduct(id) {
        let prods = await this.getProducts();
        let indiceProd = prods.findIndex(prod => prod.id === id);

        if (indiceProd === -1) {
            throw new Error(`Error: no existe el producto con id ${id}`);
        }

        let precant = prods.length;
        prods = prods.filter(prod => prod.id !== id);
        let postcant = prods.length;

        await fs.promises.writeFile(this.path, JSON.stringify(prods, null, 5), { encoding: "utf-8" });

        return precant - postcant;
    }
}

module.exports = ProductsManager;
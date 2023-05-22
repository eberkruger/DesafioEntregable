const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct = async (obj) => {
    try {
      const products = await this.getProducts();

      const product = {
        title: obj.title,
        description: obj.description,
        price: obj.price,
        thumbnail: obj.thumbnail,
        code: obj.code,
        stock: obj.stock,
      };

      const { title, description, price, thumbnail, code, stock } = product;

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log('Todos los campos son obligatorios');
        return;
      }

      const codeFind = products.find((prod) => prod.code === code);
      if (codeFind) return console.log(`Ya existe un producto con el código ${code}`);

      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }

      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
      console.log('Producto agregado correctamente')
      const productsList = await this.getProducts();
      console.log(productsList);
    } catch (err) {
      console.log('Error al agregar producto', err);
    }
  };

  updateProduct = async (id, obj) => {
    try {
      const products = await this.getProducts();
      const productBuscado = await this.getProductById(id);

      const product = { ...productBuscado, ...obj };

      const indexProduct = products.findIndex((prod) => prod.id === id);
      products.splice(indexProduct, 1);

      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

      const productsList = await this.getProducts();
      console.log(productsList);
    } catch (err) {
      console.log(err);
    }
  };

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const dataParse = JSON.parse(data);
        console.log(dataParse)
        return dataParse;
      } else {
        return [];
      }
    } catch (err) {
      console.log('Error al obtener los productos', err);
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = products.find((prod) => prod.id === id);
      
      if (!product) {
        console.log("El producto no existe");
        return undefined;
      } else {
        console.log(`El producto con el ID ${id} es: ${product.title}`);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  deleteById = async (id) => {
    const products = await this.getProducts();
    const index = products.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      products.splice(index, 1);
    } else {
      console.log("El producto no se encuentra");
      return;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    const productsList = await this.getProducts();
    console.log(productsList);
  };

  deleteAll = async () => {
    try {
      if (fs.existsSync(this.path)) {
        await fs.promises.unlink(this.path);
        console.log("Todos los elementos borrados exitosamente");
      } else {
        console.log("No hay elementos a eliminar");
      }
    } catch (err) {
      console.log(err);
    }
  };
}

const productManager = new ProductManager('./test.json');

//productManager.addProduct({ title: 'Celular', description: 'Smartphone Apple', price: 800, thumbnail: 'Imagen1.jpg', code: '001', stock: 20 })
//roductManager.addProduct({ title: 'Televisor', description: 'Televisor Led LG 4K', price: 1200, thumbnail: 'Imagen2.jpg', code: '002', stock: 20 })
//productManager.addProduct({ title: 'Auricular', description: 'Ariculares inalámbricos', price: 500, thumbnail: 'Imagen3.jpg', code: '003', stock: 20 })
//productManager.addProduct({ title: 'Notebook', description: 'Computadora portátil', price: 1200, thumbnail: 'Imagen2.jpg', code: '004', stock: 20 })

productManager.getProducts()

//productManager.getProductById(2)

//productManager.deleteById(1)

//productManager.deleteAll()

//productManager.updateProduct(1, {title: 'Celular', description: 'Smartphone Apple', price: 900, thumbnail: 'Imagen1.jpg', code: '001', stock: 20} )
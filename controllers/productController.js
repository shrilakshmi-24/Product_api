const db = require("../models");
const logger = require("../middlewares/logger");
const { createCsvWriter } = require("csv-writer").createObjectCsvWriter;
const XLSX = require("xlsx");
const Product = db.products;

//create product

const addProduct = async (req, res) => {
  // const file=req.file
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    published: req.body.published,
    img: req.files.map((file) => file.filename),
    rating: req.body.rating,
    category: req.body.category,
    createdby: req.body.createdby,
  };
  Product.create(product)
    .then((data) => {
      res.send(data);
      logger.info(`product with ${data.id} created successfully`);
    })
    .catch((err) => {
      res.status(500).send({
        msg: err.message || "some error occured",
      });
      logger.error(err.message);
    });
};

//get all products
const getAllProducts = async (req, res) => {
  //?page=a&size=b
  try {
    // Pagination
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    console.log(pageAsNumber, sizeAsNumber);
    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
      size = sizeAsNumber;
    }
    const products = await Product.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
    });
    // console.log(products.rows);
    res.status(200).send({
      content: products.rows,
      totalPages: Math.ceil(products.count / size),
    });
    logger.info("fetch all the products");
  } catch (err) {
    logger.error(err.message);
  }
};

//gew single product by id
const getSingleProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findOne({ where: { id: id } });
    res.status(200).send(product);
    logger.info(`fetched user by id ${id}`);
  } catch (err) {
    logger.error(err.message);
  }
};

//get single product by name

const { Op } = require("sequelize");

const getSingleProductbyName = async (req, res) => {
  const name = req.params.name;
  const product = await Product.findAll({
    where: {
      name: {
        [Op.iRegexp]: name, // use Op.iRegexp for case-insensitive search using regular expression
      },
    },
  });
  res.status(200).send(product);
  logger.info(`product with name ${name} is found`);
};

//update product
const updateProduct = async (req, res) => {
  try {
    let id = req.params.id;
    // if(id===Product.createdby){
    let product = await Product.update(req.body, { where: { id: id } });
    res.status(200).send(product);
    logger.info("updated product");
  } catch (err) {
    logger.error(err.message);
  }
};

//delete product by id
const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    await Product.destroy({ where: { id: id } });
    res.status(200).send("product deleted");
    logger.info(`product with id ${id} is deleted`);
  } catch (err) {
    logger.error(err.message);
  }
};

//pulished products
const publishedProducts = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
      size = sizeAsNumber;
    }
    const products = await Product.findAndCountAll({
      where: { published: true },
      limit: size,
      offset: (page - 1) * size,
    });

    res.status(200).send({
      content: products.rows,
      totalPages: Math.ceil(products.count / size),
    });
    logger.info("fetched all the published products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
    logger.error(error.message);
  }
};

//get sorted products
const getSortedProducts = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }
    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
      size = sizeAsNumber;
    }

    // Get the sort parameter from the request query
    const sort = req.query.q; //?q=price-asc

    //default sorting options
    let orderOptions = [["id", "ASC"]];

    // Modifying the sorting options based on the sort parameter
    switch (sort) {
      case "rating-asc":
        orderOptions = [["rating", "ASC"]];
        break;
      case "rating-desc":
        orderOptions = [["rating", "DESC"]];
        break;
      case "price-asc":
        orderOptions = [["price", "ASC"]];
        break;
      case "price-desc":
        orderOptions = [["price", "DESC"]];
        break;
      default:
        break;
    }

    const products = await Product.findAndCountAll({
      order: orderOptions,
      offset: (page - 1) * size,
      limit: size,
      raw: true,
    });
    const content = products.rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      rating: product.rating,
    }));

    res.status(200).send({
      content: content,
      totalPages: Math.ceil(products.count / size),
    });
    logger.info("got all the sorted products");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
    logger.error(error.message);
  }
};

//get products by user
const getByUser = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findAll({ where: { createdby: id } });
    res.status(200).send(product);
    logger.info(`get all the products created by`);
  } catch (err) {
    logger.error(err.message);
  }
};

//delete All products
const deleteAllProduct = async (req, res) => {
  try {
    await Product.destroy();
    res.status(200).send("product deleted");
    logger.info("deleted all products");
  } catch (err) {
    logger.error(err.message);
  }
};

//update based on userId

const updateProductonUser = async (req, res) => {
  try {
    let id = req.params.userid;
    let product = await Product.update(req.body, { where: { createdby: id } });
    res.status(200).send(product);
    logger.info("updated productby user id");
  } catch (err) {
    logger.error(err.message);
  }
};

//get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 10;

    const offset = (page - 1) * size;
    const limit = size;

    const where = { category };

    const products = await Product.findAndCountAll({ where, offset, limit });

    const totalPages = Math.ceil(products.count / size);

    res.status(200).send({
      content: products.rows,
      totalPages,
      currentPage: page,
      pageSize: size,
    });
    logger.info("filter product by category");
  } catch (err) {
    logger.error(err.message);
  }
};

//filtering based on rating
const getRatedProducts = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    const ratingAsNumber = Number.parseFloat(req.query.rating);

    let page = 1;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
      size = sizeAsNumber;
    }

    let rating = 0.0;
    if (!Number.isNaN(ratingAsNumber) && ratingAsNumber >= 0) {
      rating = ratingAsNumber;
    }

    const filterOptions = {
      where: {
        rating: {
          [Op.gte]: rating,
        },
      },
      limit: size,
      offset: (page - 1) * size,
    };

    const products = await Product.findAndCountAll(filterOptions);

    const content = products.rows.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      rating: product.rating,
      img: product.img,
      category: product.category,
    }));

    res.status(200).send({
      content: content,
      totalPages: Math.ceil(products.count / size),
    });
    logger.info("Filtered products by rating");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Internal server error",
    });
    logger.error(error.message);
  }
};


//adding product details to csv file
const createProductCsv = async (req, res) => {
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: "product.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "price", title: "Price" },
      { id: "description", title: "Description" },
      { id: "rating", title: "rating" },
      { id: "category", title: "Category" },
      { id: "img", title: "Img" },
      { id: "createdby", title: "Created By" },
      { id: "createdAt", title: "Created At" },
     
      { id: "updatedAt", title: "Updated At" },
    ],
  });

  const data = await Product.findAll({});
  csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("CSV file written successfully");
      res.download("product.csv");
      logger.info("product csv file created")
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
      logger.error(`error creating csv file`)
    });
};




//csv of the list of products created by particulat user


const productByUser = async (req, res) => {
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;
  const id=req.params.id
  const csvWriter = createCsvWriter({
    path: `user${id}.csv`,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "price", title: "Price" },
      { id: "description", title: "Description" },
      { id: "rating", title: "rating" },
      { id: "category", title: "Category" },
      { id: "img", title: "Img" },
      { id: "createdby", title: "Created By" },
      { id: "createdAt", title: "Created At" },
      { id: "updatedAt", title: "Updated At" },
    ],
  });

  const data = await Product.findAll({where:{createdby:id}});
  console.log(data)
  if(data.length === 0){
    res.status(200).send("Either there is no such user or no product created by the user")
  }
  else{
    csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("CSV file written successfully");
      res.download(`user${id}.csv`);
      logger.info(`csv of the user ${id} created`)
    })

    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
      logger.error("Error creating csv file")
    });

  }
  
  
};



module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getSingleProductbyName,
  updateProduct,
  deleteProduct,
  publishedProducts,
  getSortedProducts,
  getByUser,
  deleteAllProduct,
  updateProductonUser,
  getProductsByCategory,
  getRatedProducts,
  createProductCsv,
  productByUser
};

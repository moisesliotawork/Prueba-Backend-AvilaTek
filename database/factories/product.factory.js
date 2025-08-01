const Product = require("../../src/models/product.model");
const { faker } = require("@faker-js/faker");

exports.productFactory = (overrides = {}) => {
  const defaultData = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
    stock: faker.number.int({ min: 1, max: 50 }),
  };

  return new Product({ ...defaultData, ...overrides });
};

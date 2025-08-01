const User = require("../../src/models/user.model");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

exports.userFactory = async (overrides = {}) => {
  const defaultData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await bcrypt.hash("123456", 10),
    role: "CUSTOMER",
  };

  return new User({ ...defaultData, ...overrides });
};

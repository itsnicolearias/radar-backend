import { badRequest } from "@hapi/boom";
import { sequelize } from "../models"

export const beforeAll = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
  } catch (error) {
    throw badRequest(error);
  }
}

export const afterAll = async () => {
  try {
    await sequelize.close()
  } catch (error) {
    throw badRequest(error);
  }
}

export const afterEach = async () => {
  try {
    const models = Object.values(sequelize.models)
    for (const model of models) {
      await model.destroy({ where: {}, force: true })
    }
  } catch (error) {
    throw badRequest(error);
  }
}

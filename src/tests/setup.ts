import { sequelize } from "../models"

const beforeAll = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
  } catch (error) {
    throw error
  }
}

const afterAll = async () => {
  try {
    await sequelize.close()
  } catch (error) {
    throw error
  }
}

const afterEach = async () => {
  try {
    const models = Object.values(sequelize.models)
    for (const model of models) {
      await model.destroy({ where: {}, force: true })
    }
  } catch (error) {
    throw error
  }
}

import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("subscription_plans", [
      {
        id: uuidv4(),
        name: "Free",
        price: 0,
        features: JSON.stringify({
          signalLimit: 1,
          filterRangeKm: 10,
          canCreateEvents: false,
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: "Radar Plus",
        price: 10,
        features: JSON.stringify({
          signalLimit: null,
          filterRangeKm: 30,
          canCreateEvents: true,
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("subscription_plans", {});
  },
};

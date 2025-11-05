import { QueryInterface, DataTypes, Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const freePlan = await queryInterface.sequelize.query(
        "SELECT subscription_plan_id FROM subscription_plans WHERE name = 'Free' LIMIT 1",
        { type: "SELECT", transaction }
      );

      if (!freePlan || freePlan.length === 0) {
        throw new Error("Free plan not found. Seed the plans first.");
      }

      const freePlanId = (freePlan[0] as { subscription_plan_id: string }).subscription_plan_id;

      const users = await queryInterface.sequelize.query(
        "SELECT user_id FROM users",
        { type: "SELECT", transaction }
      );

      const usersWithSubscriptions = await queryInterface.sequelize.query(
        "SELECT user_id FROM subscriptions",
        { type: "SELECT", transaction }
      );

      const usersWithSubscriptionsIds = (usersWithSubscriptions as { user_id: string }[]).map(u => u.user_id);
      const usersWithoutSubscriptions = (users as { user_id: string }[]).filter(
        (user) => !usersWithSubscriptionsIds.includes(user.user_id)
      );

      if (usersWithoutSubscriptions.length > 0) {
        const subscriptionsToCreate = usersWithoutSubscriptions.map((user) => ({
          subscription_id: uuidv4(),
          user_id: user.user_id,
          plan_id: freePlanId,
          status: "active",
          start_date: new Date(),
          end_date: new Date("9999-12-31"),
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await queryInterface.bulkInsert("subscriptions", subscriptionsToCreate, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const freePlan = await queryInterface.sequelize.query(
        "SELECT subscription_plan_id FROM subscription_plans WHERE name = 'Free' LIMIT 1",
        { type: "SELECT", transaction }
      );

      if (freePlan && freePlan.length > 0) {
        const freePlanId = (freePlan[0] as { subscription_plan_id: string }).subscription_plan_id;
        await queryInterface.bulkDelete("subscriptions", { plan_id: freePlanId }, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { config } from "../../../config/config";
import { User, Subscription, SubscriptionPlan } from "../../../models";
import { notFound } from "@hapi/boom";

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

class SubscriptionService {
  async createPreference(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw notFound("User not found");
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: "premium-plan",
            title: "Radar Premium",
            quantity: 1,
            unit_price: 10,
          },
        ],
        back_urls: {
          success: process.env.FRONTEND_SUCCESS_URL!,
          failure: process.env.FRONTEND_FAILURE_URL!,
        },
        notification_url: process.env.MERCADOPAGO_WEBHOOK_URL!,
        external_reference: userId,
      },
    });

    return { init_point: result.init_point! };
  }

  async handleWebhook(payload: any) {
    if (payload.action === "payment.updated") {
      const paymentId = payload.data.id;
      const payment = await new Payment(client).get({ id: paymentId });

      if (payment && payment.external_reference) {
        const userId = payment.external_reference;
        const user = await User.findByPk(userId);
        const premiumPlan = await SubscriptionPlan.findOne({ where: { name: "Radar Plus" } });

        if (user && premiumPlan) {
          if (payment.status === "approved") {
            await Subscription.create({
              userId,
              planId: premiumPlan.subscriptionPlanId,
              status: "active",
              startDate: new Date(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
              mercadoPagoSubscriptionId: payment.id?.toString(),
            });
          } else {
            await Subscription.update(
              { status: "cancelled" },
              { where: { userId } }
            );
          }
        }
      }
    }
  }
}

export default new SubscriptionService();

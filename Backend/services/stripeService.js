const Stripe = require('stripe');

class StripeService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCustomer(email, name) {
    try {
      return await this.stripe.customers.create({
        email,
        name,
        metadata: { app: 'careersaas' }
      });
    } catch (error) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
    try {
      return await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { app: 'careersaas' }
      });
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  async handleWebhook(payload, signature) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      throw new Error(`Webhook error: ${error.message}`);
    }
  }
}

module.exports = new StripeService();
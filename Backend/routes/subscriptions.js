const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stripeService = require('../services/stripeService');
const User = require('../models/User');
const { sendSubscriptionConfirmation } = require('../services/emailService'); // ✅ Added

// Create checkout session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { priceId, plan } = req.body;
    const user = await User.findById(req.user.id);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer(user.email, user.name);
      customerId = customer.id;
      await User.findByIdAndUpdate(user.id, { stripeCustomerId: customerId });
    }

    const successUrl = `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/pricing`;

    const session = await stripeService.createCheckoutSession(
      customerId,
      priceId,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = await stripeService.handleWebhook(req.body, sig);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper functions
async function handleCheckoutCompleted(session) {
  const user = await User.findOne({ stripeCustomerId: session.customer });
  if (user) {
    user.subscription.plan = session.metadata.plan || 'pro';
    user.subscription.status = 'active';
    await user.save();

    // ✅ Send subscription confirmation email here
    try {
      await sendSubscriptionConfirmation(user, user.subscription);
    } catch (emailError) {
      console.error('Failed to send subscription email:', emailError);
      // Don't fail subscription if email fails
    }
  }
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  if (user) {
    user.subscription.status = subscription.status;
    await user.save();
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  if (user) {
    user.subscription.plan = 'free';
    user.subscription.status = 'canceled';
    await user.save();
  }
}

module.exports = router;

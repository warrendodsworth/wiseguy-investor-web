/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

//payment request (through chrome, safari)
declare var Stripe: any;

//subscription
declare var StripeCheckout: any;

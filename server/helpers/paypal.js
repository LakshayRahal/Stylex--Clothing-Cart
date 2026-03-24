const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AZ8ECduuIHa9s1uOFgtggXe0aLCg0lk9FJg2dqpFy1TFvGNASx924cXjkYXzrPxGqotLpreQ23pdyvN-",
  client_secret: "EH2Mvqv6uGpHO6m7Wc5dKkQ40w7dnKyLTMHcTaLWlSADcmlg07zsB86ex0qM1lyxacMQyUsopKBcTdCR",
});

module.exports = paypal;

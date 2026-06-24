const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    apprenant: { type: mongoose.Schema.Types.ObjectId, ref: "Apprenant" }, // Reference to the apprentice model
    formation: { type: mongoose.Schema.Types.ObjectId, ref: "Formation" }, // Reference to the training model
    totalAmount: { type: Number, default: 0 }, 
    status: {
      type: String,
      enum: ['pending', 'completed', 'not_paid'], // <--- ajoute 'not_paid'
      default: 'pending'
    },
    
    tranches: [
      {
        montant_tranche: {
          type: Number,
        },
        date_depot_tranche: {
          type: Date,
          default: Date.now
        },
      },
    ],

    montant_restant: {
      type: Number
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

const mongoose = require('mongoose');

const ahorroSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },

    displayName: String,
    email: String,

    nombreAhorro: {
      type: String,
      required: true,
    },

    descripcionAhorro: String,

    ahorroMensual: {
      type: Number,
      required: true,
    },

    meses: {
      type: Number,
      required: true,
    },

    meta: {
      type: Number,
      required: true,
    },

    ahorroTotal: Number,
    cumplioMeta: Boolean,
    diferenciaMeta: Number,
  },
  {
    timestamps: true,
    collection: 'ahorros',
  }
);

module.exports = mongoose.model(
  'Ahorro',
  ahorroSchema
);
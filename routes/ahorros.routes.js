const express = require('express');
const router = express.Router();

const Ahorro = require('../models/ahorro');

router.get('/reporte/resumen/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const ahorros = await Ahorro.find({ uid }).sort({ createdAt: 1 });

    const total_registros = ahorros.length;

    const total_ahorrado = ahorros.reduce(
      (acc, item) => acc + Number(item.ahorroTotal || 0),
      0
    );

    const metas_cumplidas = ahorros.filter(
      (item) => Boolean(item.cumplioMeta)
    ).length;

    const metas_pendientes = ahorros.filter(
      (item) => !Boolean(item.cumplioMeta)
    ).length;

    const ultimo_registro =
      ahorros.length > 0 ? ahorros[ahorros.length - 1].createdAt : null;

    res.json({
      resumen: {
        total_registros,
        total_ahorrado,
        metas_cumplidas,
        metas_pendientes,
        ultimo_registro,
      },
      detalle: ahorros,
    });
  } catch (error) {
    console.error('Error al obtener reporte del dashboard:', error);

    res.status(500).json({
      message: 'Error al obtener reporte del dashboard',
      error: error.message,
      stack: error.stack,
    });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const ahorros = await Ahorro.find({ uid }).sort({ createdAt: -1 });

    res.json(ahorros);
  } catch (error) {
    console.error('Error al obtener ahorros:', error);

    res.status(500).json({
      message: 'Error al obtener ahorros',
      error: error.message,
      stack: error.stack,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      uid,
      displayName,
      email,
      nombreAhorro,
      descripcionAhorro,
      ahorroMensual,
      meses,
      meta,
    } = req.body;

    if (!uid || !nombreAhorro || !ahorroMensual || !meses || !meta) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios',
      });
    }

    const ahorroTotal = Number(ahorroMensual) * Number(meses);
    const cumplioMeta = ahorroTotal >= Number(meta);
    const diferenciaMeta = ahorroTotal - Number(meta);

    const ahorro = await Ahorro.create({
      uid,
      displayName,
      email,
      nombreAhorro,
      descripcionAhorro,
      ahorroMensual,
      meses,
      meta,
      ahorroTotal,
      cumplioMeta,
      diferenciaMeta,
    });

    res.status(201).json({
      message: 'Ahorro creado correctamente',
      ahorro,
    });
  } catch (error) {
    console.error('Error al crear ahorro:', error);

    res.status(500).json({
      message: 'Error al crear ahorro',
      error: error.message,
      stack: error.stack,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombreAhorro,
      descripcionAhorro,
      ahorroMensual,
      meses,
      meta,
    } = req.body;

    const ahorroTotal = Number(ahorroMensual) * Number(meses);
    const cumplioMeta = ahorroTotal >= Number(meta);
    const diferenciaMeta = ahorroTotal - Number(meta);

    const ahorro = await Ahorro.findByIdAndUpdate(
      id,
      {
        nombreAhorro,
        descripcionAhorro,
        ahorroMensual,
        meses,
        meta,
        ahorroTotal,
        cumplioMeta,
        diferenciaMeta,
      },
      { new: true }
    );

    if (!ahorro) {
      return res.status(404).json({
        message: 'Ahorro no encontrado',
      });
    }

    res.json({
      message: 'Ahorro actualizado correctamente',
      ahorro,
    });
  } catch (error) {
    console.error('Error al actualizar ahorro:', error);

    res.status(500).json({
      message: 'Error al actualizar ahorro',
      error: error.message,
      stack: error.stack,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ahorro = await Ahorro.findByIdAndDelete(id);

    if (!ahorro) {
      return res.status(404).json({
        message: 'Ahorro no encontrado',
      });
    }

    res.json({
      message: 'Ahorro eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar ahorro:', error);

    res.status(500).json({
      message: 'Error al eliminar ahorro',
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
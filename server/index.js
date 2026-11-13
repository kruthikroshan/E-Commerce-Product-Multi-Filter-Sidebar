'use strict';

const path = require('path');
const express = require('express');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', productsRouter);
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Store running at http://localhost:${PORT}`));
}

module.exports = app;

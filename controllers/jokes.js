const m = require("../models/joke");

exports.categories = async (_q, res) => res.json(await m.categories());

exports.byCat = async (q, res) => {
  const rows = await m.byCat(q.params.cat, q.query.limit);
  rows.length
    ? res.json(rows)
    : res.status(404).json({ error: "Invalid category" });
};

exports.random = async (_q, res) => {
  const row = await m.random();
  row ? res.json(row) : res.status(404).json({ error: "No jokes yet" });
};

exports.add = async (q, res) => {
  const { category, setup, delivery } = q.body;
  if (!category || !setup || !delivery) {
    return res.status(400).json({ error: "Missing field" });
  }
  await m.add(category, setup, delivery);
  res.json(await m.byCat(category));
};

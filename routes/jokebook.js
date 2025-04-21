const r=require("express").Router();
const c=require("../controllers/jokes");
r.get("/categories",c.categories);
r.get("/joke/:cat",c.byCat);
r.get("/random",c.random);
r.post("/joke/add",c.add);
module.exports=r;

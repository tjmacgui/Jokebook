const db=require("../db");
const run=(sql,params=[])=>new Promise((f,r)=>db.run(sql,params,function(e){e?r(e):f(this)}));
const all=(sql,params=[])=>new Promise((f,r)=>db.all(sql,params,(e,rows)=>e?r(e):f(rows)));
const get=(sql,params=[])=>new Promise((f,r)=>db.get(sql,params,(e,row)=>e?r(e):f(row)));
db.serialize(()=>{
  db.run("create table if not exists categories(id integer primary key autoincrement,name text unique)");
  db.run("create table if not exists jokes(id integer primary key autoincrement,category_id integer references categories(id) on delete cascade,setup text,delivery text)");
  db.run("insert or ignore into categories(name) values('funnyJoke'),('lameJoke')");
});
exports.categories=async()=>{const rows=await all("select name from categories order by name");return rows.map(r=>r.name);};
exports.byCat=(c,l)=>all("select setup,delivery from jokes join categories on category_id=categories.id where name=? limit ?",[c,l||999]);
exports.random=()=>get("select setup,delivery from jokes order by random() limit 1");
exports.add=async(c,s,d)=>{await run("insert or ignore into categories(name) values(?)",[c]);const row=await get("select id from categories where name=?",[c]);await run("insert into jokes(category_id,setup,delivery) values(?,?,?)",[row.id,s,d]);};

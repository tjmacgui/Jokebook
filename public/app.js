"use strict";

const api = "/jokebook";

// helpers
const $ = sel => document.querySelector(sel);
const li = t  => Object.assign(document.createElement("li"), { textContent:t });

// random joke
fetch(api + "/random")
  .then(r => r.ok ? r.json() : null)
  .then(j => { $("#random").textContent = j ? `${j.setup} — ${j.delivery}` : "(none yet)"; });

// list categories
fetch(api + "/categories")
  .then(r => r.json())
  .then(arr => {
    const ul = $("#cats");
    arr.forEach(c => {
      const node = li(c);
      node.addEventListener("click", () => showCategory(c));
      ul.appendChild(node);
    });
  });

// add joke form
$("#add-form").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  fetch(api + "/joke/add", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(data)
  })
  .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err)))
  .then(showList)
  .catch(alert);
  e.target.reset();
});

// show jokes by category
function showCategory(cat) {
  fetch(`${api}/joke/${cat}?limit=10`)
    .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err)))
    .then(showList)
    .catch(alert);
}

// show jokes list
function showList(arr) {
  const ul = $("#list");
  ul.textContent = "";
  arr.forEach(j => ul.appendChild(li(`${j.setup} — ${j.delivery}`)));
}

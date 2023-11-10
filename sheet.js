const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/";
const SHEET_ID = "1GoCTAdP_gpgf8vZv0MPGGj2GFGUxiCNqpppWBs0C4yQ";
const SHEET_TITLE = "test_event";
const SHEET_RANGE = "A3:C13";

// const date = new Date().toLocaleDateString("en-us", { month: "2-digit" });
const date = "11/03/2023";

const SHEET_URL = `${GOOGLE_SHEET_URL}${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=`;

async function fetchSheetData(sheet_range) {
  try {
    const res = await fetch(`${SHEET_URL}${sheet_range}`);
    const data = await res.text();
    return JSON.parse(data.substring(47).slice(0, -2));
  } catch (e) {
    return null;
  }
}

function renderTable(table, jsonData) {
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";
  jsonData.table.cols.forEach((col) => {
    const th = document.createElement("th");
    th.innerHTML = col.label;
    thead.appendChild(th);
  });

  jsonData.table.rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.c.forEach((c) => {
      const td = document.createElement("td");
      td.innerHTML = c.v;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function renderNoDataFound(table) {
  table.querySelector("thead").innerHTML = "";
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = `<tr>
    <th>No Data for the following day: ${date}</th>  
  </tr>`;
}

async function getInfo(ranges) {
  return await Promise.all(
    ranges.map(async (range) => {
      const data = await fetchSheetData(range);
      if (!data) return null;
      const rows = data.table.rows[0].c;
      return {
        date: rows[0].v.split(" ")[1],
        range: rows[1].v,
      };
    })
  );
}

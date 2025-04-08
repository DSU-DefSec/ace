async function updateTable(query) {
    const res = await fetch("/db?format=json", {
        body: query,
        method: "POST"
    });
    if(!res.ok) {
        alert(await res.text());
        return;
    }
    const data = await res.json()
    $('#tableContainer')[0].innerHTML = `<table id="table"></table>`;
    $('#table').bootstrapTable({
        columns: [{field: "state", checkbox: true}, ...Object.keys(data[0]).map(k => ({field:k,title:k}))],
        data: data,
        clickToSelect: true,
        singleSelect: true,
        checkboxEnabled: true,
        fixedScroll: true
    });
}

(async () => {
console.log("Javascript Loaded.");

$('#execute')[0].addEventListener("click", async e => updateTable($('#query')[0].value));
const getURLParams = () => Object.fromEntries(location.search.slice(1).split("&").map(i => i.split(/=(.*)/s)));

const params = getURLParams();
if(!params.q) return;

$("div#queryContainer")[0].remove();

$("div#tableContainer")[0].style.height = "100vh";

updateTable(decodeURI(params.q));
})();
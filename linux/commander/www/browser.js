(async () => {
console.log("Javascript Loaded");

createMenu(document.querySelector("header > nav"));


const queryInput = document.getElementById("query");
const executeButton = document.getElementById("execute");

const updateHandler = async event => {
    document.querySelector("iframe").src = `db.html?q=${encodeURIComponent(queryInput.value)}`;
};

executeButton.onclick = updateHandler;
queryInput.onclick = async event => {
    if(event.key == "\n") await updateHandler(event);
};

})();
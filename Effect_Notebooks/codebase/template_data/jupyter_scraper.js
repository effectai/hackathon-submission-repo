
const getFinalMethodDefinition = function (persistId) {
    let codeCells = document.getElementsByClassName('CodeMirror');
    let persistenceEl = document.getElementById(persistId);

    for (let cell of codeCells) {
        if (cell.innerText.includes("cleanData")) {
            submit_method = cell.innerText;
            // console.log("FOUND IT")
            // console.log(submit_method);
            persistenceEl.value = cell.innerText;
            break;
        }
    }
}

const interval = setInterval(function () {
    // method to be executed;
    getFinalMethodDefinition("method_definition");
}, 1000);






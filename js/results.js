let completedSpins = JSON.parse(localStorage.getItem("completedSpins") ?? "[]");
let currentSpin = JSON.parse(localStorage.getItem("currentSpin") ?? "{}");
let blobUrl;

const icons = {
    download: "./img/download.svg"
};

function setupResults() {
    const downloadButton = d3.select(".download-wrapper").select("a");
    downloadButton.node().appendChild(icons.download);
    downloadButton.select("img").style("vertical-align", "bottom");
    const d = new Date();
    downloadButton.attr(
        "download",
        `wheel-results-${d.getFullYear()}-${
            d.getMonth() + 1
        }-${d.getDate()}.csv`
    );
    saveToStorage();

    if (Object.hasOwn(currentSpin, "spin_result")) {
        displayResults(currentSpin.spin_result);
    } else {
        saveToStorage();
    }

    d3.select(".results-button-wrapper")
        .selectAll("button")
        .on("click", function () {
            currentSpin.outcome = this.id;
            completedSpins.push(currentSpin);
            currentSpin = {};
            saveToStorage();

            d3.select(".results-button-wrapper")
                .selectAll("button")
                .attr("disabled", true);
            d3.select(".results-wrapper").style("visibility", "hidden");
            d3.select("#spin").attr("disabled", null);
        });
}

function displayResults(result) {
    saveToStorage();
    const results = d3.select(".results-wrapper");
    results.select(".results-text").text(result);
    d3.select(".results-button-wrapper")
        .selectAll("button")
        .attr("disabled", null);
    results.style("visibility", "visible");
    d3.select("#spin").attr("disabled", true);
}

function saveToStorage() {
    localStorage.setItem("completedSpins", JSON.stringify(completedSpins));
    localStorage.setItem("currentSpin", JSON.stringify(currentSpin));

    // https://blog.logrocket.com/programmatically-downloading-files-browser/#obtaining-blobs
    URL.revokeObjectURL(blobUrl);
    let spins = [...completedSpins];
    if (Object.hasOwn(currentSpin, "spin_result")) {
        spins.push(currentSpin);
    }

    // https://stackoverflow.com/a/31536517
    if (spins.length > 0) {
        const header = Object.keys(spins[0]);
        const csv = [
            header.join(","), // header row first
            ...spins.map((row) =>
                header
                    .map((fieldName) => JSON.stringify(row[fieldName]))
                    .join(",")
            )
        ].join("\r\n");
        const blob = new Blob([csv], {
            type: "text/csv"
        });
        blobUrl = URL.createObjectURL(blob);
    }
    d3.select(".download-wrapper").select("a").attr("href", blobUrl);
}

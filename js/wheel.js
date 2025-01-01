let winningItemIdx = -1;

const props = {
    isInteractive: false,
    radius: 0.84,
    itemLabelRadius: 0.93,
    itemLabelRadiusMax: 0.35,
    itemLabelRotation: 180,
    itemLabelAlign: "left",
    itemLabelColors: ["#fff"],
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: "Fjalla One",
    itemLabelFontSizeMax: 55,
    overlayImage: "./img/example-0-overlay.svg",
    rotationSpeedMax: 500,
    rotationResistance: -100,
    lineWidth: 1,
    lineColor: "#fff",
    items: items,
    onRest: () => {
        displayResults(items[winningItemIdx].label);
    }
};

function setupWheel() {
    const container = document.querySelector(".wheel-wrapper");

    window.wheel = new spinWheel.Wheel(container, props);

    // Show the wheel once everything has loaded
    container.style.visibility = "visible";

    d3.select("#spin").on("click", function () {
        // Listen for click event on spin button:
        winningItemIdx = getRandomInt(items.length);
        const numRevs = 2 + getRandomInt(2);
        currentSpin = {
            date: new Date().toDateString(),
            time: new Date().toTimeString(),
            spin_result: items[winningItemIdx].label,
            outcome: "NA"
        };
        wheel.spinToItem(
            winningItemIdx,
            2500 /* duration */,
            false /* spin to center */,
            numRevs,
            1,
            quarticOut
        );
    });
}

function quarticOut(t) {
    return --t * t * t * t + 1;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

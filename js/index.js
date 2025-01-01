window.onload = async () => {
    const images = [];
    images.push(initImage(props, "overlayImage"));
    images.push(initImage(icons, "download"));
    await loadImages(images);

    setupResults();
    setupWheel();
};

function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    obj[pName] = i;
    return i;
}

/**
 * Attempt to load all images (of type HTMLImageElement) in the given array.
 * The browser will download the images and decode them so they are ready to be used.
 * An error will be thrown if any image fails to load.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
 */
async function loadImages(images = []) {
    const promises = [];

    for (const img of images) {
        if (img instanceof HTMLImageElement) promises.push(img.decode());
    }

    try {
        await Promise.all(promises);
    } catch (error) {
        throw new Error("An image could not be loaded");
    }
}

figma.showUI(__html__, {width: 600, height: 400});

const fontStyleData = figma.getLocalTextStyles();
const colorStyleData = figma.getLocalPaintStyles();

/**
 * Create Font Objects
 */

const fonts = [];
const fontObject = {
    fontFamilies: [],
    fontStyles: [],
};

const fontFamilyTitles = ['primary', 'secondary', 'tertiary'];

const fontWeights = {
    100: ['thin', 'hairline'],
    200: ['extra light', 'ultra light'],
    300: ['light'],
    400: ['normal', 'regular'],
    500: ['medium'],
    600: ['semi-bold', 'semi bold', 'demi-bold', 'demi bold'],
    700: ['bold'],
    800: ['extra-bold', 'extra bold', 'ultra-bold', 'ultra bold'],
    900: ['black', 'heavy'],
    1000: ['extra-black', 'extra black', 'ultra-black', 'ultra black'],
};

function getFontWeightByName(name) {
    let lowerCaseName = name.toLowerCase();
    let splitName = lowerCaseName.split(' ');
    for (const weight in fontWeights) {
        if (splitName.some((term) => fontWeights[weight].includes(term))) {
            return weight;
        }
    }
}

fontStyleData.map((fontStyle) => {
    const fontStyleValues = {
        id: fontStyle.id,
        styleName: fontStyle.name,
        fontName: fontStyle.fontName,
        size: fontStyle.fontSize,
        letterSpacing: fontStyle.letterSpacing,
        lineHeight: fontStyle.lineHeight,
    };

    fonts.push({
        id: fontStyle.id,
        styleName: fontStyle.name,
        fontName: fontStyle.fontName,
        size: fontStyle.fontSize,
        letterSpacing: fontStyle.letterSpacing,
        lineHeight: fontStyle.lineHeight,
    });

    // Create List of Font Families
    let fontList = fontObject.fontFamilies;
    let currentFont = fontStyle.fontName;

    if (fontList.length > 0) {
        let isNewFont = true;

        fontList.map((font, index) => {
            if (font['family'] == [currentFont.family]) {
                fontList[index]['weights'][currentFont.style] = getFontWeightByName(currentFont.style);
                isNewFont = false;
            }
        });

        if (isNewFont) {
            fontList.push({
                family: currentFont.family,
                name: fontFamilyTitles[fontList.length],
                weights: {
                    [currentFont.style]: getFontWeightByName(currentFont.style),
                },
            });
        }
    } else {
        fontList.push({
            family: currentFont.family,
            name: fontFamilyTitles[fontList.length],
            weights: {
                [currentFont.style]: getFontWeightByName(currentFont.style),
            },
        });
    }

    // Create Object of Organized Styles
    const nameSplit = fontStyle.name.split('/');
    let stylePath = fontObject.fontStyles;

    let currentIndex;
    let currentPath = stylePath;
    let isNewStyle = true;

    function pushFontData(path) {
        path.push({
            name: nameSplit[0],
            id: fontStyle.id,
            styleName: fontStyle.name,
            fontName: fontStyle.fontName,
            size: fontStyle.fontSize,
            letterSpacing: fontStyle.letterSpacing,
            lineHeight: fontStyle.lineHeight,
        });
    }

    // Get Index of Existing Style, If It Exists
    stylePath.map((style, index) => {
        if (style['name'] == nameSplit[0]) {
            isNewStyle = false;
            currentIndex = index;
        }
    });

    // Get Font Values
    nameSplit.forEach((term, index) => {
        let isLastChild = index >= nameSplit.length - 1;

        if (index <= 0) {
            if (!isNewStyle) {
                currentPath = stylePath[currentIndex];
            } else {
                if (isLastChild) {
                    currentPath.push({
                        name: term,
                        styles: fontStyleValues,
                    });
                    currentPath = stylePath[stylePath.length - 1];
                } else {
                    currentPath.push({
                        name: term,
                        children: [],
                    });
                    currentPath = stylePath[stylePath.length - 1];
                }
            }
        } else if (!isLastChild) {
            let isNewChild = true;

            currentPath['children'].map((child) => {
                // If Definition Exists, Add to Existing
                if (child.name == term && currentPath['name'] !== term) {
                    child['children'].push({
                        name: term,
                        children: [],
                    });
                    isNewChild = false;
                    currentPath = child;
                }
            });

            // If Definition Does Not Exist, Create It
            if (isNewChild) {
                currentPath['children'].push({
                    name: term,
                    children: [],
                });
                // currentPath = currentPath["children"]
                currentPath['children'].map((child) => {
                    if (child.name == term) {
                        currentPath = child;
                    }
                });
            }
        } else {
            currentPath['children'].push({
                name: term,
                styles: fontStyleValues,
            });
        }
    });
});

/**
 * Create Paint Array
 */

const colorStyles = [];

colorStyleData.map((color) => {
    if (color.paints.length > 1) {
        console.log('WARNING: Color styles should only have 1 fill layer.');
    }
    if (color.type === 'PAINT') {
        colorStyles.push({
            name: color.name,
            fill: color.paints[0],
            id: color.id,
        });
    }
});

// console.log(fontObject)
console.log(fontObject.fontStyles);

figma.ui.postMessage({
    type: 'generate-styles',
    message: `Generate Styles`,
    fonts,
    fontStyles: fontObject.fontStyles,
    fontFamilies: fontObject.fontFamilies,
    colors: colorStyles,
});

// Don't Really Need Any of This

figma.ui.onmessage = (msg) => {
    if (msg.type === 'create-rectangles') {
        const nodes = [];

        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }

        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);

        // This is how figma responds back to the ui
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.count} Rectangles`,
        });
    }

    // figma.closePlugin();
};

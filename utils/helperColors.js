const namer = require('color-namer');
const arrayList = require('array-list');

const basic3 = require("../data/panels/basic3.json")
const basic4 = require("../data/panels/basic4.json")
const basic5 = require("../data/panels/basic5.json")

//Init script
var arrayBasics = []
arrayBasics.push(basic3)
arrayBasics.push(basic4)
arrayBasics.push(basic5)

function createColor(hex, accuracy) {

    var list = new arrayList();
    var names = namer(hex, { pick: ['basic'] });

    names.basic.forEach(function (item, index) {
        if (index < accuracy)
            list.push(names.basic[index].name)
    });

    return list;
};

// Array of the colours to evaluate es: [
//  [
//      { "hex": "#141415", "percentage": 0.51 },
//      { "hex": "#141415", "percentage": 0.51 }
//  ]
function translateClothColor(garment) {

    var clothcolor = []
    var colors_garment = []

    if (garment.colour_1 != null && garment.colour_1 != "" && garment.colour_1 != undefined)
        colors_garment.push({ "hex": garment.colour_1, "percentage": garment.percentage_1 })
    if (garment.colour_2 != null && garment.colour_2 != "" && garment.colour_2 != undefined)
        colors_garment.push({ "hex": garment.colour_2, "percentage": garment.percentage_2 })
    if (garment.colour_3 != null && garment.colour_3 != "" && garment.colour_3 != undefined)
        colors_garment.push({ "hex": garment.colour_3, "percentage": garment.percentage_3 })

    colors_garment.forEach((color) => {
        //Old value 0.30 like color_evaluation
        if (color.percentage >= 0.25) {
            clothcolor.push(createColor(color.hex, 1)[0]);
        }
    });

    return clothcolor
}

function getMatchedPanels_LC(clothColor) {

    //Panels
    var matchedPanels = []

    for (const basic of arrayBasics) {
        var index = 0
        var good = true
        while (basic.length > index) {
            var panel = basic[index].colors
            for (let idx = 0; idx < clothColor.length; idx++) {
                if (!panel.includes(clothColor[idx]))
                    good = false
            }
            if (good)
                matchedPanels.push(panel)
            //Init variables for the next iteration
            index++
            good = true
        }
    }
    return matchedPanels
}

/**
 * Filters the cursor of local garments using the panels get from a single garment
 */
async function filterCursorWithPanels_LC(cursor, panels) {

    //Set no duplicates
    var docs = []

    try {

        for (const doc of await cursor.all()) {

            //Array of strings colors from basics files
            var clothColor = translateClothColor(doc)

            if (clothColor.length > 0) {

                for (const panel of panels) {

                    let flag = true
                    for (const clr of clothColor) {
                        if (!panel.includes(clr)) {
                            flag = false
                            break
                        }
                    }

                    if (flag) {
                        docs.push(doc)
                        break
                    }
                }
            }
        }
        return docs

    } catch (error) {
        console.log("Error: ", error.message)
    }
}

async function filterWithPanels_LC(garment, cursor) {
    var clothColor = translateClothColor(garment)
    var panels = getMatchedPanels_LC(clothColor)
    return await filterCursorWithPanels_LC(cursor, panels)
}

module.exports ={
    filterWithPanels_LC
}
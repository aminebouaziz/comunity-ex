function validate(garment) {

    const properties = ['name', 'type', 'category', 'layer', 'brand', 'pattern', 'design', 'colour_1',
        'percentage_1', 'colour_2', 'percentage_2', 'colour_3', 'percentage_3', 'material',
        'spring_summer', 'fall_winter', 'sex', 'fit', 'imageUrl', 'dirty'];

    const man = ['streetwear', 'sportswear', 'formal', 'smart_casual', 'casual', 'beachwear'];

    const woman = ['grunge', 'sportswear', 'cocktail', 'formal', 'smart_casual', 'casual', 'hipster', 'beachwear'];

    //Garment validation
    const keys = Object.keys(garment);
    const propValid = properties.filter(prop => keys.indexOf(prop) === -1).length;

    if (propValid > 0) {
        throw new Error(`Missing properties in the garment.Check in the swagger documentation!`);
    }

    let styleValid

    switch (garment.sex) {
        case 'M':
            styleValid = man.every(style => keys.includes(style));
            if (!styleValid)
                throw new Error(`Missing man styles in the garment.Check in the swagger documentation!`);
            break;
        case 'F':
            styleValid = woman.every(style => keys.includes(style));
            if (!styleValid)
                throw new Error(`Missing woman styles in the garment.Check in the swagger documentation!`);
            break;
        default:
            throw new Error(`Unknown gender of the garment`);
    }
}

module.exports = {
    validate
}
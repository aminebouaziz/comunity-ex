const axios = require("axios");

const basePathMixed = `https://europe-west1-dollapp-nodejs.cloudfunctions.net/mixedoutfits`
const basePathPercentages = `https://europe-west1-dollapp-nodejs.cloudfunctions.net/percentages`

/**
 * Http Helper Post
 *
 * @param {*} doc
 * @param {*} offset
 * @param {*} limit
 */
async function httpPostSingle(user, limit, garment) {

    const url = `${basePathMixed}/single/${user}?limit=${limit}`;

    try {
        const res = await axios.post(url, garment);
        if (res.status == 200)
            return res;
        else
            return null;

    } catch (err) {
        console.error(err);
    }
}

async function httpPostMultiple(user, limit, garments) {

    const url = `${basePathMixed}/multiple/${user}?limit=${limit}`;

    try {
        const res = await axios.post(url, garments);
        if (res.status == 200)
            return res;
        else
            return null;

    } catch (err) {
        console.error(err);
    }
}

async function incrementPercentages(user, garment) {

    const url = `${basePathPercentages}/increment/${user}`;

    try {
        const res = await axios.put(url, garment);
        if (res.status == 200)
            return res;
        else
            return null;

    } catch (err) {
        console.error(err);
    }
}

async function decrementPercentages(user, garment) {

    const url = `${basePathPercentages}/decrement/${user}`;

    try {
        const res = await axios.put(url, garment);
        if (res.status == 200)
            return res;
        else
            return null;

    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    httpPostSingle,
    httpPostMultiple,
    incrementPercentages,
    decrementPercentages
}
console.log('hI');

let el = e => document.querySelector(e);

let buttons = document.querySelectorAll('.calculator input');
// let inpResult = document.forms[0].result;
let inpResult = 0;
let arrSign = ['*', '/', '-', '+'];
let arrExpElem = [];
let flagSign = false;

// set events
for (const val of buttons) {

    // result variable initialization 
    if (val.getAttribute('name') === 'result') {
        inpResult = val;
        continue;
    }

    // event for sign
    if (checkSign(val.value)) {
        val.addEventListener('click', sign);
        continue;
    }

    switch (val.value) {
        case 'C':
            val.addEventListener('click', clear);
            continue;
        case '%':
            continue;
        case '=':
            val.addEventListener('click', result);
            continue;
    }

    if (val.dataset.id === 'bs') {
        val.addEventListener('click', backSpace);
        continue;
    }
    // console.log(val);

    val.addEventListener('click', () => { add(val) });
    // val.addEventListener('click', add);
}

el('.test').addEventListener('click', test);

function test() {

    const regExpNum = /\d+\.?\d+/g;
    const regSign = /[\*\/\+\-]+/g;

    // const skob = /\(\d+\.?\d+(?:[\*\/\+\-]+\d+\.?\d+)+\)/g;
    const i = inpResult.value.trim();
    const tNum = i.match(regExpNum);
    const tSign = i.match(regSign);
    // const tmp = i.split(regExpNum);
    console.log('tNum', tNum);
    console.log('tSign', tSign);
}

// function for events

function clear() {
    inpResult.value = '';
    arrExpElem = [];
    flagSign = false;
    inpResult.style.fontSize = '';
}

function backSpace() {
    let endS = inpResult.value.length - 1;
    if (endS < 0) return;

    if (checkSign(inpResult.value[endS])) {

        //?! choice
        // toggleFlag();
        flagSign = false;
    }

    inpResult.value = inpResult.value.slice(0, endS);
}


//TODO implement screen overflow
function add(element) {
    // console.log('test', this, 'element', element);

    let styleCss = getComputedStyle(inpResult);
    // console.log(styleCss.fontSize);
    if (inpResult.value.length < 10) {
        inpResult.value += element.value;
    } else if (inpResult.value.length < 16) {
        inpResult.style.fontSize = (+styleCss.fontSize.slice(-0, 2) - 3) +'px';
        inpResult.value += element.value;
    }

}

// !? change to .at(-1)
function sign() {
    let lastCharacter = inpResult.value.length - 1;
    let tmp = +inpResult.value[lastCharacter];

    console.log(this.value, tmp, +tmp, tmp != this.value);
    //TODO: change to check flag
    if (typeof tmp === 'number') {

        console.log('111')
        //?! choise
        // toggleFlag();
        flagSign = true;

        add(this);
        return;
    }

    if (tmp != this.value) {
        inpResult.value = inpResult.value.slice(0, lastCharacter) + this.value;
    }

}

function checkSign(sign) {
    let bResult = false;

    bResult = arrSign.includes(sign);

    return bResult;
}

// not use
function toggleFlag() {
    flagSign = flagSign === true ? false : true;
    // console.log('flag toggled on', flagSign);
}

function result() {

    resultArray();
    countResArray();

    inpResult.value = arrExpElem[0] || 0;
    arrExpElem = [];
}

// create result array
function resultArray() {

    let num = 0;

    for (const key in inpResult.value) {

        const val = inpResult.value[key];
        if (checkSign(val)) {
            arrExpElem.push(+num);
            arrExpElem.push(val);
            num = 0;
        } else {
            num += val;
            if (+key === (inpResult.value.length - 1)) {
                arrExpElem.push(+num);
            }
        }
    }
}

function countResArray() {
    let c = 0;

    for (const sign of arrSign) {
        while (c < 100) {
            c++;
            let resTmp = 0;

            const tmp = arrExpElem.findIndex(e => e === sign);
            if (tmp === -1) {
                break;
            }

            switch (sign) {
                case '*':
                    resTmp = arrExpElem[tmp - 1] * arrExpElem[tmp + 1];
                    break;
                case '/':
                    resTmp = arrExpElem[tmp - 1] / arrExpElem[tmp + 1];
                    break;
                case '-':
                    resTmp = arrExpElem[tmp - 1] - arrExpElem[tmp + 1];
                    break;
                case '+':
                    resTmp = arrExpElem[tmp - 1] + arrExpElem[tmp + 1];
                    break;
            }

            arrExpElem.splice(tmp - 1, 3, resTmp);
        }
    }
}

// test


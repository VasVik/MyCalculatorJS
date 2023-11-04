(function () {

    let buttons = document.querySelectorAll('.calculator input');

    let inpResult = 0;
    let arrSign = ['*', '/', '-', '+'];

    // set events
    for (const item of buttons) {

        // result variable initialization 
        if (item.getAttribute('name') === 'result') {
            inpResult = item;
            continue;
        }

        // event for sign
        if (arrSign.includes(item.value)) {
            item.addEventListener('click', sign);
            continue;
        }

        switch (item.value) {
            case 'C':
                item.addEventListener('click', clear);
                continue;
            case '=':
                item.addEventListener('click', result);
                continue;
            case '+/-':
                item.addEventListener('click', addSignMinusTo);
                continue;
        }

        if (item.dataset.id === 'bs') {
            item.addEventListener('click', backSpace);
            continue;
        }

        item.addEventListener('click', () => { add(item) });

    }

    // function for events

    function clear() {
        inpResult.value = '';

        correctIfMany();
    }

    function backSpace() {
        let endS = inpResult.value.length - 1;
        if (endS < 0) return;

        inpResult.value = inpResult.value.slice(0, endS);

        correctIfMany();
    }

    /**
     * adjustment if there are many numbers
     */
    function correctIfMany() {
        let styleCss = getComputedStyle(inpResult);

        let iWidth = styleCss.width;
        iWidth = +iWidth.slice(0, iWidth.length - 2);

        if (inpResult.value.length > 10) {

            // inpResult.style.width = inpResult.value.length * 27 - 1 + 'px';
            // inpResult.style.textAlign = 'center';

            inpResult.size = inpResult.value.length * 1.23;

            inpResult.style.width = 'auto';
            inpResult.style.textAlign = 'center';
        } else {

            inpResult.style.width = '268px';
            inpResult.style.textAlign = 'right';
        }
    }

    function add(element) {

        const elVal = element.value;

        if (checkForDuplicates(elVal)) {

            inpResult.value += elVal;
        }

        correctIfMany();

    }

    function checkForDuplicates(val) {

        let res = true;
        let numLen = 0;

        const regLastNum = /\d+[.,]?\d*%?$/;

        const i = inpResult.value.trim();
        let findFromInput = i.match(regLastNum);

        if (findFromInput) {
            numLen = findFromInput[0].length
        }

        switch (val) {
            case '%':
                res = onPercent(val, findFromInput);
                break;
            case '.':
                res = onDot(val, findFromInput);
                break;

            case '0':
                res = onFirstZero(findFromInput);
                break;
            default:
                if (val > 0 && numLen < 2) {
                    res = changeFirstZero(val, findFromInput);
                }
        }

        return res;
    }
    function onDot(val, fromInput) {

        if (!fromInput) {
            inpResult.value += '0'; // add first 0 in num
        } else if (fromInput[0].lastIndexOf(val) !== -1) {
            return false;
        }

        return true;
    }
    function onPercent(val, fromInput) {

        if (!fromInput) {
            return false;
        }

        if (fromInput[0] === fromInput.input || fromInput[0].lastIndexOf(val) !== -1) {
            return false;
        }

        return true;
    }
    // many first zeros
    function onFirstZero(fromInput) {

        if (!fromInput) {
            return true;
        }

        if (fromInput[0] > 0 || fromInput[0][1] === '.') {
            return true;
        }

        return false;
    }
    function changeFirstZero(val, fromInput) {

        if (!fromInput) {
            return true;
        }

        const i = inpResult.value.trim();

        if (val > 0) {
            if (fromInput[0][0] === '0' && fromInput[0][1] !== '.') {

                inpResult.value = i.slice(0, i.length - 1) + val;
                return false;
            }
        }

        return true;
    }


    /**
     * adding a sign to a number
     */
    function addSignMinusTo() {

        const regLastNum = /[-+]?\d+[.,]?\d*%?$/;

        let i = inpResult.value.trim();
        let lNum = i.match(regLastNum);

        if (!lNum) {
            return;
        }

        i = i.slice(0, lNum.index);
        lNum = lNum[0];

        if (lNum[0] === '-') {
            inpResult.value = i + '+' + lNum.slice(1);
        } else if (lNum[0] === '+') {
            inpResult.value = i + '-' + lNum.slice(1);
        } else {
            inpResult.value = i + '-' + lNum;
        }

        correctIfMany();
    }

    function sign() {
        const lastCharacter = inpResult.value.length - 1;

        replExtZeros();

        const prew = inpResult.value[lastCharacter];

        if (arrSign.includes(prew)) {
            if (this.value != prew) {
                inpResult.value = inpResult.value.slice(0, lastCharacter) + this.value;
            }
        } else {
            inpResult.value += this.value;
        }

        correctIfMany();
    }
    function replExtZeros() {

        const regExtraZeros = /\d*[.,]?\d*%?$/;

        let i = inpResult.value.trim();

        const extZeros = i.match(regExtraZeros);

        if (extZeros[0]) {

            let strExtZer = extZeros[0];
            let res = '';
            let endSlice = extZeros.index;

            if (strExtZer[strExtZer.length - 1] === '%') {
                strExtZer = +strExtZer.slice(0, strExtZer.length - 1);
                res = i.slice(0, endSlice) + strExtZer;
                res += '%';
            } else {
                res = i.slice(0, endSlice) + +strExtZer;
            }

            inpResult.value = res;
        }
    }

    /**
     * Final result
     */
    function result() {

        const regExpParenthesis = /\((?:[*\/+-]?)\d+(?:[.,]\d+)?(?:[*\/+-]+\d+(?:[.,]\d+)?)+\)/g;

        let inpData = inpResult.value.trim();

        // cut not correct last sign
        if (arrSign.includes(inpData[inpData.length - 1])) {
            inpData = inpData.slice(0, inpData.length - 1);
        }

        if (regExpParenthesis.test(inpData)) {

            regExpParenthesis.lastIndex = 0;

            while (regExpParenthesis.test(inpData)) {

                inpData = inpData.replace(regExpParenthesis, e => {

                    e = e.slice(1, e.length - 1); // cut - '(' and ')'

                    const arrFrStr = arrFromString(e);
                    console.log(arrFrStr);
                    const resArr = resArray(arrFrStr);
                    console.log(resArr[0]);
                    return resArr[0];
                });
            }
        }

        const arrFrStr = arrFromString(inpData);

        const resArr = resArray(arrFrStr);

        let res = resArr[0];

        if (isNaN(res)) {
            res = '0';
        } else {
            res = +resArr[0].toFixed(10) ?? 'Err';
        }

        inpResult.value = res;

        correctIfMany();
    }

    /**
     * array from input string
     * @param {string} str value from input
     * @returns created array from string
     */
    function arrFromString(str) {

        let res = [];
        let flagMinus = false;
        let num = '';

        const checkFlag = num => {

            if (flagMinus) {
                return '-' + num;
            } else {
                return num;
            }
        }

        const validator1 = validator(checkFlag, checkPercentSign);

        for (const key in str) {

            const val = (str[key] === ',') ? '.' : str[key];

            if (arrSign.includes(val)) {

                if (arrSign.includes(str[key - 1])) {
                    flagMinus = true;
                    continue;
                }

                res.push(validator1(num));

                res.push(val);
                num = '';
                flagMinus = false;
            } else {

                num += val;

                if (+key === (str.length - 1)) {

                    res.push(validator1(num));
                }

            }
        }

        return res;
    }

    function checkPercentSign(num) {

        if (num[num.length - 1] === '%') {
            return num;
        } else {
            return +num;
        }
    }

    function validator(...validators) {
        return (num) => {

            let res = num;

            for (const validator of validators) {
                res = validator(res);
            }

            return res;
        }
    }

    /**
     * count finish result
     * @param {Array} arr array form string
     * @returns counted array
     */
    function resArray(arr) {

        let res = arr;
        const halfArrSign1 = ['*', '/'];
        const halfArrSign2 = ['+', '-'];

        // * /
        while (true) {

            const keySign = res.findIndex(e => halfArrSign1.includes(e));
            if (keySign === -1) {
                break;
            }

            res = numsOperation(res, +keySign);
        }

        // + -
        while (true) {

            const keySign = res.findIndex(e => halfArrSign2.includes(e));

            if (keySign === -1) {
                break;
            }
            res = numsOperation(res, +keySign);
        }

        return res;
    }

    function percent(num1, num2) {
        return num1 * num2 / 100;
    }

    function numsOperation(arr, keySign) {
        let resTmp = 0;

        const num1 = arr[keySign - 1];
        let num2 = arr[keySign + 1];

        if (num2[num2.length - 1] === '%') {
            num2 = percent(num1, (num2.slice(0, length - 1)));
        }

        switch (arr[keySign]) {

            case '*':
                resTmp = num1 * num2;
                break;
            case '/':
                resTmp = num1 / num2;
                break;
            case '-':
                resTmp = num1 - num2;
                break;
            case '+':
                resTmp = num1 + num2;
                break;
        }

        arr.splice(keySign - 1, 3, resTmp);

        return arr;
    }
})()


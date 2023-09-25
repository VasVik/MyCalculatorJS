(function () {
    console.log('hI');

    let el = e => document.querySelector(e);

    let buttons = document.querySelectorAll('.calculator input');
    // let inpResult = document.forms[0].result;
    let inpResult = 0; // ?
    let arrSign = ['*', '/', '-', '+'];
    // let arrExpElem = []; // ?
    // let flagSign = false; // ?
    let flagPercent = false;

    // set events
    for (const item of buttons) {

        // result variable initialization 
        if (item.getAttribute('name') === 'result') {
            inpResult = item;
            continue;
        }

        // event for sign
        if (checkSign(item.value)) {
            item.addEventListener('click', sign);
            continue;
        }

        switch (item.value) {
            case 'C':
                item.addEventListener('click', clear);
                continue;
            // case '%':

            //     continue;
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
        // console.log(item);

        item.addEventListener('click', () => { add(item) });
        // item.addEventListener('click', add);
    }

    el('.test').addEventListener('click', test);

    function test() {

        // my regular expressions

        // /\d+(?:[.,]\d+)?/g // number with dot or comma
        // /\(\d+(?:[.,]\d+)?(?:[*/+-]+\d+(?:[.,]\d+)?)+\)/g
        // /(?!\()\d+(?:[.,]\d+)?(?:[*/+-]+\d+(?:[.,]\d+)?)+(?=\))/g // удаление скобок из результата without parenthesis
        // /[*/+-]+/g // all sign
        // /[*/+-](?=\d+(?:[.,]\d+)?$)/ // only last sign

        // const regExpNum = /\d+(?:[.,]\d+)?/g;
        // const regSign = /[*/+-]+/g;

        // const skob = /\(\d+(?:[.,]\d+)?(?:[*/+-]+\d+(?:[.,]\d+)?)+\)/g;


        // const i = inpResult.value.trim();
        // const tNum = i.match(regExpNum);
        // const tSign = i.match(regSign);

        // const arrSkob = i.match(skob);

        // let tmp = i;
        // while (skob.test(tmp)) {

        //     tmp = tmp.replace(skob, e => {

        //         e = e.slice(1, e.length - 1); // -( and -)

        //         const arrFrStr = arrFromString(e);
        //         const resArr = resArray(arrFrStr);

        //         return resArr[0];
        //     });
        // }

        // const arrFrStr = arrFromString(tmp);
        // const resArr = resArray(arrFrStr);

        // // console.log(resArr);

        // inpResult.value = resArr[0] || '0';

        // console.log('resArr = ', resArr);

        // const tmp = i.split(skob);

        // console.log(i);
        // console.log(tmp);
        // console.log(arrSkob);
        // console.log('tNum', tNum);
        // console.log('tSign', tSign);
    }

    // function for events

    function clear() {
        // flagPercent = false;

        inpResult.value = '';

        correctIfMany();
    }

    function backSpace() {
        let endS = inpResult.value.length - 1;
        if (endS < 0) return;

        // if (inpResult.value[endS] === '%') {
        //     toggleFlag(flagPercent);
        // }

        inpResult.value = inpResult.value.slice(0, endS);

        correctIfMany();
    }

    /**
     * adjustment if there are many numbers
     */
    function correctIfMany() {
        let styleCss = getComputedStyle(inpResult);

        // console.log(styleCss.width);

        let iWidth = styleCss.width;
        iWidth = +iWidth.slice(0, iWidth.length - 2);

        // console.log(iWidth);

        if (inpResult.value.length > 10) {

            // inpResult.style.width = inpResult.value.length * 27 - 1 + 'px';
            // inpResult.style.textAlign = 'center';

            // console.log(inpResult.value.length + 3);
            inpResult.size = inpResult.value.length * 1.23;

            inpResult.style.width = 'auto';
            inpResult.style.textAlign = 'center';
        } else {

            inpResult.style.width = '268px';
            inpResult.style.textAlign = 'right';
        }
    }


    //TODO: implement screen overflow
    function add(element) {
        // console.log('test', this, 'element', element);

        // const valid = validForInput(onPercent, onFirstZero);

        const elVal = element.value;

        if (checkForDuplicates(elVal)) {

            inpResult.value += elVal;
        }

        // changeFirstZero(element.value);

        correctIfMany();

    }

    function checkForDuplicates(val) {

        let res = true;
        let numLen = 0;

        // const regLastNum = /\d+[,.]\d*%?$|\d+%?$/;
        const regLastNum = /\d+[.,]?\d*%?$/;


        const i = inpResult.value.trim();
        let findFromInput = i.match(regLastNum);

        // console.log(findFromInput);
        if (findFromInput) {
            numLen = findFromInput[0].length
            // console.log(findFromInput[0].length);
        }

        // console.log(val, findFromInput);

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

        // console.log(fromInput);
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
        // console.log('val', val);

        const i = inpResult.value.trim();

        // console.log('i', i);
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
    // function addSignMinusTo() {

    //     // const regSignWNum = /[*\/+-]+\d+(?:[.,]\d+)?$/;
    //     const regSignWNum = /[*\/+-](?=\d+(?:[.,]\d+)?%?$)/; // find last sign
    //     let i = inpResult.value.trim();

    //     const lastSign = i.match(regSignWNum) ?? false;
    //     if (!lastSign) {
    //         return;
    //     }

    //     console.log(lastSign[0], lastSign);

    //     switch (lastSign[0]) {

    //         case '+':
    //             lastSign[0] = '-';
    //             break;

    //         case '-':
    //             // console.log(i[lastSign.index - 1]);
    //             if (i[lastSign.index - 1] === '*' || i[lastSign.index - 1] === '/') {

    //                 lastSign[0] = '';
    //                 break;
    //             }
    //             lastSign[0] = '+';
    //             break;

    //         case '*':
    //         case '/':
    //             lastSign[0] = lastSign[0] + '-';
    //             console.log(lastSign[0]);
    //             break;
    //     }

    //     iArr = i.split('');

    //     // if number is first
    //     if (!lastSign) {
    //         const allSigns = i.match(/[*\/+-]/g); // all signs

    //         if (!allSigns) {

    //             iArr.unshift('-');
    //         }
    //     } else {
    //         const key = lastSign.index;

    //         iArr[key] = lastSign[0];
    //     }

    //     inpResult.value = iArr.join('');
    // }

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


        {// TODO: Проверить на адекватность регулярку)
            // const regSignWNum = /(?<=[*\/+-]+|^|\()(-?\d+(?:[.,]\d+)?%?$)/;

            // let i = inpResult.value.trim();

            // let signWNum = i.match(regSignWNum) ?? false;
            // if (!signWNum) {
            //     return;
            // }
            // console.log(signWNum);

            // i = i.slice(0, signWNum.index);

            // signWNum = signWNum[0].split('');

            // if (signWNum[0] === '-') {

            //     signWNum[0] = '';
            // } else {

            //     signWNum.unshift('-');
            // }

            // signWNum = signWNum.join('');
            // inpResult.value = i + signWNum;
        }

        correctIfMany();
    }

    // TODO: !? change to .at(-1)
    function sign() {
        const lastCharacter = inpResult.value.length - 1;
        // flagPercent = false;

        replExtZeros();

        const prew = inpResult.value[lastCharacter];

        if (arrSign.includes(prew)) {
            if (this.value != prew) {
                inpResult.value = inpResult.value.slice(0, lastCharacter) + this.value;
            }
        } else {
            inpResult.value += this.value;
        }

        // add(this);

        // let tmp = inpResult.value[lastCharacter];
        // tmp = +tmp || tmp;

        // // console.log(this.value, tmp, tmp != this.value, typeof tmp);

        // if (this.value != tmp && arrSign.includes(tmp)) {
        //     inpResult.value = inpResult.value.slice(0, lastCharacter) + this.value;
        // }

        correctIfMany();
    }
    function replExtZeros() {

        // const regExtraZeros1 = /(?<=[,.]\d*)0+(?:%)?$/;
        const regExtraZeros = /[,.]?0*%?$/;

        let i = inpResult.value.trim();

        const extZeros = i.match(regExtraZeros);

        if (extZeros) {
            const strExtZer = extZeros[0];
            let res = '';
            let forSlice = extZeros.index;

            res = i.slice(0, forSlice);

            // console.log(extZeros, res);
            if (strExtZer[strExtZer.length - 1] === '%') {
                res += '%';
            }
            inpResult.value = res;
        }
    }

    //TODO: заменить везде на arrSign.includes(x); и убрать эту ф-ю.
    function checkSign(sign) {
        let bResult = false;

        bResult = arrSign.includes(sign);

        return bResult;
    }

    function toggleFlag(flag) {

        flag = flag === true ? false : true;
    }

    /**
     * Final result
     */
    function result() {
        // flagPercent = false;

        const regExpParenthesis = /\((?:[*\/+-]?)\d+(?:[.,]\d+)?(?:[*\/+-]+\d+(?:[.,]\d+)?)+\)/g;

        let inpData = inpResult.value.trim();

        // cut not correct last sign
        if (arrSign.includes(inpData[inpData.length - 1])) {
            inpData = inpData.slice(0, inpData.length - 1);
        }
        // console.log('inpData', inpData);

        // TODO: probably put in a separate function
        if (regExpParenthesis.test(inpData)) {

            regExpParenthesis.lastIndex = 0;

            while (regExpParenthesis.test(inpData)) {

                inpData = inpData.replace(regExpParenthesis, e => {

                    e = e.slice(1, e.length - 1); // cut - '(' and ')'

                    const arrFrStr = arrFromString(e);
                    const resArr = resArray(arrFrStr);

                    return resArr[0];
                });
            }
        }

        const arrFrStr = arrFromString(inpData);
        // console.log(arrFrStr);

        const resArr = resArray(arrFrStr);
        // console.log(resArr);

        //TODO: Select from two methods
        let res = resArr[0];

        if (isNaN(res)) {
            // res = 'Err';
            res = '0';
        } else {
            res = +resArr[0].toFixed(10) ?? 'Err';
        }

        inpResult.value = res;

        correctIfMany();

        // const resTmp = +resArr[0].toFixed(10) ?? 'Err';    
        // inpResult.value = '';
        // inpResult.setAttribute('placeholder', resTmp);
    }

    /**
     * array from input string
     * @param {string} str value from input
     * @returns created array from string
     */
    function arrFromString(str) {

        // console.log(str);
        let res = [];
        let flagMinus = false;
        let num = '';

        const checkFlag = num => {
            // console.log('checkFlag', flagMinus, num);
            if (flagMinus) {
                return '-' + num;
            } else {
                return num;
            }
        }

        const validator1 = validator(checkFlag, checkPercentSign);

        for (const key in str) {

            const val = (str[key] === ',') ? '.' : str[key];

            if (checkSign(val)) {

                if (checkSign(str[key - 1])) {
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
            // console.log('val', val, 'num', num);
        }

        // console.log('arrFromStr', res);
        return res;
    }

    function checkPercentSign(num) {
        // console.log('checkPercent', num, num[num.length - 1]);
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
    // function resArray(arr) {

    //     let res = arr;

    //     for (const sign of arrSign) {

    //         // while (res.findIndex(e => e === sign) !== -1) {
    //         while (true) {

    //             let resTmp = 0;

    //             const keySign = res.findIndex(e => e === sign);
    //             if (keySign === -1) {
    //                 break;
    //             }

    //             const num1 = res[keySign - 1];
    //             let num2 = res[keySign + 1];

    //             if (num2[num2.length - 1] === '%') {
    //                 num2 = percent(num1, (num2.slice(0, length - 1)));
    //             }

    //             switch (sign) {

    //                 case '*':
    //                     resTmp = num1 * num2;
    //                     break;
    //                 case '/':
    //                     resTmp = num1 / num2;
    //                     break;
    //                 case '-':
    //                     resTmp = num1 - num2;
    //                     break;
    //                 case '+':
    //                     resTmp = num1 + num2;
    //                     break;
    //             }

    //             res.splice(keySign - 1, 3, resTmp);
    //             // console.log('res', res);
    //         }
    //     }

    //     return res;
    // }
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

        // console.log('res +- ', res);
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
        // console.log('tmpres', arr);
        return arr;
    }

    // test


})()


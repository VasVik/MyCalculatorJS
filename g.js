console.log('hi');

let input = document.getElementsByName('result')[0];

function appendToInput(val) {
    input.value += val;
}

function clearInput() {
    input.value = '';
}

function backspace() {
    input.value = input.value.slice(0, -1);
}

function calculate() {
    input.value = eval(input.value);
}

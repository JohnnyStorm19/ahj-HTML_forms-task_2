/**
* @jest-environment jsdom 
*/

import CardWidget from "../components/CardWidget/CardWidget";

test('load page', () => {
    const containerMarkup = `
        <div class="container">
            <div class="message_container">
                <p class="message"></p>
            </div>
        </div>
    `
    document.body.insertAdjacentHTML('beforeend', containerMarkup);
    const container = document.querySelector('.container');

    const cardWidget = new CardWidget(container);
    cardWidget.bindToDOM();

    const widget = document.querySelector('.cardWidget');
    const paySystems = CardWidget.getPaySystemsMarkup()
    const input = CardWidget.getInputMarkup();
    const res = paySystems + input;


    expect(widget.innerHTML).toBe(res);
});

test.each([
    { cardNumber: '2720998430084319', system: 'mastercard' },
    { cardNumber: '4716361360560018', system: 'visa' },
    { cardNumber: '3532414684183001', system: 'jcb' },
    { cardNumber: '6763337847895356', system: 'maestro' },
    { cardNumber: '6011691608478863', system: 'discover' },
])('return $system for $cardNumber', ({cardNumber, system}) => {

    const containerMarkup = `
    <div class="container">
        <div class="message_container">
            <p class="message"></p>
        </div>
    </div>
`
    document.body.insertAdjacentHTML('beforeend', containerMarkup);
    const container = document.querySelector('.container');

    const cardWidget = new CardWidget(container);
    cardWidget.bindToDOM();

    const form = document.querySelector('form');

    cardWidget.input.value = cardNumber;
    form.submit();

    const systemEl = document.querySelector(`.paysystem_${system}`);

    expect(systemEl.classList.contains('paysystem_valid')).toEqual(true);
});

test.each([
    { cardNumber: '2720998430084319', validity: 'invalid' },
    { cardNumber: '4716361360560018', validity: 'invalid' },
    { cardNumber: '3532414684183001', validity: 'invalid' },
    { cardNumber: '6763337847895356', validity: 'invalid' },
    { cardNumber: '5469550012048325', validity: 'valid'},
])('return $validity for $cardNumber', ({cardNumber, validity}) => {
    const containerMarkup = `
    <div class="container">
        <div class="message_container">
            <p class="message"></p>
        </div>
    </div>
`
    document.body.insertAdjacentHTML('beforeend', containerMarkup);
    const container = document.querySelector('.container');

    const cardWidget = new CardWidget(container);
    cardWidget.bindToDOM();

    const form = document.querySelector('form');

    cardWidget.input.value = cardNumber;
    form.submit();

    const messageEl = document.querySelector('.message');

    expect(messageEl.textContent).toEqual(`Your card is ${validity}`);
})
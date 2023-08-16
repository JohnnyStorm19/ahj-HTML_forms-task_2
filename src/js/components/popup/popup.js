import './popup.css'

export default class Popup {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.element = null;
    }

    static getPopupMarkup() {
        return `
        <form class="popup-form" novalidate>
            <div class="popup-wrapper">
                <div class="popup-content">
                    <div class="popup-inputs-wrapper">
                        <div class="popup-input-text-wrapper">
                            <label>
                                <span class="input-header">Название</span>
                                <input type="text" class="popup-input-text" placeholder="Например: Iphone 16" required>
                                <span class="error"></span>
                            </label>
                        </div>
                        <div class="popup-input-price-container">
                            <label>
                                <span class="input-header">Стоимость</span>
                                <input type="number" class="popup-input-price" placeholder="Например: 100000" required>
                                <span class="error"></span>
                            </label>
                        </div>
                    </div>
                    <div class="popup-buttons">
                        <button type="submit" class="btn-save">Сохранить</button>
                        <button type="button" class="btn-cancel">Отмена</button>
                    </div>
                </div>
            </div>
        </form>
        `
    }

    bindToDOM() {
        this.element = Popup.getPopupMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', this.element);
    }

    onSaveBtn(arr, item) {
        const nameInput = document.querySelector('.popup-input-text');
        const priceInput = document.querySelector('.popup-input-price');
        if (!item) {
            arr.push({ title: nameInput.value, price: priceInput.value });
        } else {
            const itemsContainer = document.querySelector('.items-container');
            const index = [...itemsContainer.children].findIndex(el => el === item);
    
            arr[index].title = nameInput.value;
            arr[index].price = priceInput.value;
        }
        nameInput.value = '';
        priceInput.value = '';
    }

    onCancelBtn() {
        const popupWrapper = document.querySelector('.popup-wrapper');
        popupWrapper.classList.remove('active');
        this.closeErrors();
    } 

    showError(inputEl, message) {
        const error = inputEl.nextElementSibling;
        if (inputEl.validity.valid) {
            if (error.classList.contains('active')) {
                error.classList.remove('active');
            }
            error.textContent = '';
            return;
        }
        error.classList.add('active');
        error.textContent = message;
    }
    closeErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            if (error.classList.contains('active')) {
                error.classList.remove('active');
            }
        })
    }
}
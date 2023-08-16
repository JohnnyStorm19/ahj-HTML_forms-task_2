import './crm.css'

export default class CRM {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.removeBtn;
        this.editBtn;
    }

    static getCRMMarkup() {
        return `
        <div class="crm-container">
            <div class="crm-header-wrapper">
                <h3 class="crm-header-title">Товары</h3>
                <span class="crm-header-add" data-action="add">+<span>
            </div>
            <div class="crm-main-wrapper">
                <header class="crm-main-header">
                    <ul class="crm-main-header-items">
                        <li class="crm-main-header-item">Название</li>
                        <li class="crm-main-header-item">Стоимость</li>
                        <li class="crm-main-header-item">Действия</li>
                    </ul>
                </header>
            </div>
            <div class="items-container"></div>
        </div>
        `
    }
    static getItemMarkup(name, price) {
        return `
            <div class="item-wrapper">
                <div class="item-name">${name}</div>
                <div class="item-price">${price}</div>
                <div class="item-actions-wrapper">
                    <span class="item-action-edit" data-action="edit">&#9998</span>
                    <span class="item-action-remove" data-action="remove">x</span>
                <div>
            </div>
        `
    }

    bindToDOM() {
        this.parentEl.insertAdjacentHTML('beforeend', CRM.getCRMMarkup());
    }

    onCRMheaderClick() {
        const popupWrapper = document.querySelector('.popup-wrapper');
        popupWrapper.classList.add('active');
    }

    onRemoverClick(target, arr) {
        const itemsContainer = document.querySelector('.items-container');
        const item = target.closest('.item-wrapper');
        const index = [...itemsContainer.children].findIndex(el => el === item);
        arr.splice(index, 1);
        item.remove();
    }

    onEditClick(target, arr) {
        const itemsContainer = document.querySelector('.items-container');
        const item = target.closest('.item-wrapper');

        const index = [...itemsContainer.children].findIndex(el => el === item);

        const inputName = document.querySelector('.popup-input-text');
        const inputPrice = document.querySelector('.popup-input-price');

        inputName.value = arr[index].title;
        inputPrice.value = arr[index].price;

        this.onCRMheaderClick();
    }
}
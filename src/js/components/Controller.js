import CRM from "./CRMmain/CRM";
import Popup from "./popup/popup";

export default class CRMController {
    constructor(parentEl) {
        this.parentEl = parentEl
        this.items = [];
        this.crm;
        this.itemsContainer;
        this.popup;
        this.popupWrapper;
        this.editable = false;
        this.currentItemToEdit;
    }

    bindToDOM() {
        this.crm = new CRM(this.parentEl);
        this.crm.bindToDOM();
        this.itemsContainer = this.parentEl.querySelector('.items-container');

        this.popup = new Popup(this.parentEl);
        this.popup.bindToDOM();
        this.popupWrapper = this.parentEl.querySelector('.popup-wrapper');

        this.addListeners();
    }

    addListeners() {
        const crmContainer = this.parentEl.querySelector('.crm-container');
        const form = this.parentEl.querySelector('form');
        const inputName = form.querySelector('.popup-input-text');
        const inputPrice = form.querySelector('.popup-input-price');

        crmContainer.addEventListener('click', e => {
            const target = e.target;

            if (target.classList.contains('crm-header-add')) {
                this.crm.onCRMheaderClick();
            }
            if (target.classList.contains('item-action-remove')) {
                this.crm.onRemoverClick(target, this.items);
            }
            if (target.classList.contains('item-action-edit')) {
                this.crm.onEditClick(target, this.items);
                this.editable = true;
                this.currentItemToEdit = target.closest('.item-wrapper');
            }
        });

        inputName.addEventListener('input', () => {
            this.popup.closeErrors(); 
            if (!inputName.validity.valid) {
                this.popup.showError(inputName, 'Добавьте имя товара');
            }
            if (!inputName.value) { 
                this.popup.closeErrors();
            }
        })

        inputPrice.addEventListener('input', () => {
            this.popup.closeErrors();
            if (!inputPrice.validity.valid) {
                this.popup.showError(inputPrice, 'Добавьте цену товара')
            }
            if (!inputPrice.value) {
                this.popup.closeErrors();
            }
        })

        inputName.addEventListener('blur', () => {
            this.popup.closeErrors();
        })
        inputPrice.addEventListener('blur', () => {
            this.popup.closeErrors();
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                const elements = [...form.elements].filter(el => el.nodeName === "INPUT");
                elements.some(el => {
                    if (!el.validity.valid && el.classList.contains('popup-input-text')) {
                        this.popup.showError(el, 'Добавьте имя товара');
                        return true;
                    } 
                    if (!el.validity.valid && el.classList.contains('popup-input-price')) {
                        this.popup.showError(el, 'Добавьте цену товара');
                        return true;
                    }
                })
                return;
            } else {
                if (!this.editable) {
                    console.log('NOT EDITING!')
                    this.popup.onSaveBtn(this.items);
                } else {
                    console.log('EDITING!')
                    this.popup.onSaveBtn(this.items, this.currentItemToEdit);
                }
                this.redrawItems();
                this.popupWrapper.classList.remove('active');
                this.editable = false;
                console.log(this.items);
            }
        });
        this.popupWrapper.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('btn-cancel')) {
                console.log('cancel')
                this.popup.onCancelBtn();
            }
        });
    }

    redrawItems() {
        const crmMainWrapper = document.querySelector('.crm-main-wrapper');
        
        this.clearItemsInContainer();

        this.items.forEach(item => {
            const itemMarkup = CRM.getItemMarkup(item.title, item.price);
            this.itemsContainer.insertAdjacentHTML('beforeend', itemMarkup);
            crmMainWrapper.append(this.itemsContainer);
        })
    }

    clearItemsInContainer() {
        [...this.itemsContainer.children].forEach(el => el.remove());
    }
}
export default class FormManager {
    constructor(formName, callBack) {
        this.form = document.querySelector(`form[name="${formName}"]`);
        this.callBack = callBack;
        this.initialize();
    }

    initialize() {
        this.form.onsubmit = this.callBack;
    }

    onChange(callback) {
        this.form.onchange = callback;
    }

    reset() {
        this.form.reset();
    }
}
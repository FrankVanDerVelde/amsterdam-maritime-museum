export class ObjectPropertyDefiner {

    defineObjectProperties() {
        this.#defineStringCapitalize();
        this.#defineClassListSwitch();
    }

    #defineStringCapitalize() {
        Object.defineProperty(String.prototype, 'capitalize', {
            value: function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            },
            enumerable: false
        });
    }

    #defineClassListSwitch() {
        Object.defineProperty(DOMTokenList.prototype, 'switch', {
            value: function(oldClass, newClass) {
                this.remove(oldClass);
                this.add(newClass);
            },
        });
    }
}
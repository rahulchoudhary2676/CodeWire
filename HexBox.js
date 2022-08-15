import { IsHexChar } from "./src/util/util";
import { registerConfig } from "./src/Register";
export class HexBox {
    constructor(root, format, registerType) {
        this.root = root;
        this.box = getHexBox(format)
    }
    getHexBox(format){
        const box1 = document.createElement("input")
        box1.setAttribute('type', 'text');
        box1.setAttribute('value', '00');
        box1.setAttribute('maxlength', 2);
        box1.setAttribute('dir', 'rtl')
        this.currentValue = '00'
        box1.addEventListener('input', (e) => {
            if(e.inputType === "insertText" && !IsHexChar(e.data)){
                e.target.value = this.currentValue
            }
            this.currentValue = e.target.value.length != 0 ? e.target.value: registerConfig[regName].value
        })
    }
}

import { HEX, DEC, HexToBin, TwoComp8Bit, IsHexChar } from "./util/util.js";

export class Processor {
    constructor(memory) {
        this.memory = memory;

        this.registerConfig = {
            'A': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null
            },
            'B': {
                size: 2,
                defValue: 0,
                value: 0,
            },
            'C': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null

            },
            'D': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null
            },
            'E': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null
            },
            'H': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null
            },
            'L': {
                size: 2,
                defValue: 0,
                value: 0,
                nodeRef: null
            },
            'SP': {
                size: 4,
                defValue: 0xFFFF,
                value: 0xFFFF,
                nodeRef: null
            },
            'PC': {
                size: 4,
                defValue: 0,
                value: 0,
                nodeRef: null
            }
        }
        this.flagConfig = {
            'Z': {
                defValue: 0,
                value: 1,
                nodeRef: null,
            },
            'S': {
                defValue: 0,
                value: 1,
                nodeRef: null,
            },
            'P': {
                defValue: 0,
                value: 1,
                nodeRef: null,
            },
            'CY': {
                defValue: 0,
                value: 1,
                nodeRef: null,
            },
            'AC': {
                defValue: 0,
                value: 1,
                nodeRef: null,
            }
        }
        this.setFlagView();
        this.setRegisterView();
        this.resetRegisters();
        this.resetFlags();
        this.reset();
        const reset_flag_btn = document.getElementById("reset-flags");
        const reset_reg_btn = document.getElementById("reset-regs");
        const proc = this;
        reset_flag_btn.addEventListener("click", () => { proc.resetFlags() });
        reset_reg_btn.addEventListener("click", () => { proc.resetRegisters() });

    }

    getHexBox(regName) {
        const conatiner = document.createElement("div")
        conatiner.id = `reg${regName}`
        conatiner.classList.toggle("reg-ip", true);
        const label = document.createElement("span")
        label.setAttribute("for", `reg${regName}-value`)
        label.classList.toggle("loc-text", true)
        const box1 = document.createElement("input")
        box1.setAttribute('type', 'text');
        this.registerConfig[regName].value = this.registerConfig[regName].defValue
        box1.setAttribute('value', HEX(this.registerConfig[regName].value, this.registerConfig[regName].size));
        box1.setAttribute('maxlength', this.registerConfig[regName].size);
        box1.setAttribute('dir', 'rtl')
        box1.setAttribute('name', `reg${regName}-value`)
        box1.classList.toggle('ip-input', true)
        this.registerConfig[regName].nodeRef = box1
        box1.addEventListener('input', (e) => {
            if (e.inputType === "insertText" && !IsHexChar(e.data)) {
                e.target.value = HEX(this.registerConfig[regName].value, this.registerConfig[regName].size);
            }
            this.registerConfig[regName].value = e.target.value.length != 0 ? DEC(e.target.value) : this.registerConfig[regName].defValue
        })
        box1.addEventListener('blur', (e) => {
            if (e.target.value.length === 0) {
                this.registerConfig[regName].value = e.target.value.length != 0 ? DEC(e.target.value) : this.registerConfig[regName].defValue
                e.target.value = HEX(this.registerConfig[regName].value, this.registerConfig[regName].size)
            }
        })
        const labelText = document.createTextNode(regName);
        label.append(labelText)
        const hexlbl = document.createElement("span")
        hexlbl.innerText = 'H'
        hexlbl.classList.toggle("loc-text", true);
        hexlbl.classList.toggle("hexy", true);
        const innerInputContainer = document.createElement('div')
        innerInputContainer.classList.toggle('hex-box-inner-container', true)
        innerInputContainer.append(box1)
        innerInputContainer.append(hexlbl)
        conatiner.append(label)
        conatiner.append(box1)
        conatiner.append(hexlbl)
        return conatiner
    }
    getFlagBox(flagName) {
        const conatiner = document.createElement("div")
        conatiner.id = `flag${flagName}`
        conatiner.classList.toggle("flag-ip", true)
        const label = document.createElement("span")
        label.setAttribute("for", `flag${flagName}-value`)
        label.classList.toggle("loc-text", true)
        const box1 = document.createElement("input")
        box1.setAttribute('type', 'checkbox');
        this.flagConfig[flagName].value = this.flagConfig[flagName].defValue
        box1.toggleAttribute('checked', this.flagConfig[flagName].value)
        box1.setAttribute('name', `flag${flagName}-value`)
        box1.classList.toggle('flag-box', true)
        box1.addEventListener('change', (e) => {
            this.flagConfig[flagName].value = e.target.checked ? 1 : 0;
        })
        this.flagConfig[flagName].nodeRef = box1
        const labelText = document.createTextNode(flagName);
        label.append(labelText)
        const innerInputContainer = document.createElement('div')
        innerInputContainer.classList.toggle('hex-box-inner-container', true)
        conatiner.append(label)
        conatiner.append(box1)
        return conatiner

    }

    setRegisterView() {
        const root = document.getElementById("registers-view-panel");
        root.innerHTML = ''
        for (const regName in this.registerConfig) {
            root.append(this.getHexBox(regName))
        }
    }
    setFlagView() {
        const root = document.getElementById("flag-view-panel");
        root.innerHTML = ''
        for (const flagName in this.flagConfig) {
            root.append(this.getFlagBox(flagName))
        }
    }
    reset() {
        this.resetStack();
        this.memory.refresh();
        this.resetRegisters();
        this.resetFlags();
    }
    updateFlagView() {
        for (const flagName in this.flagConfig) {
            // this.flagConfig[flagName].nodeRef.setAttribute("checked", this.flagConfig[flagName].value ? "true": "false");
            this.flagConfig[flagName].nodeRef.checked = this.flagConfig[flagName].value;

            // this.flagConfig[flagName].nodeRef.toggleAttribute('checked', this.flagConfig[flagName].value)
        }
    }
    updateRegisterView() {
        for (const regName in this.registerConfig) {
            this.registerConfig[regName].nodeRef.value = HEX(this.registerConfig[regName].value, this.registerConfig[regName].size);
            // console.log(this.registerConfig[regName].nodeRef.value);
        }
    }
    resetRegisters() {
        for (const regName in this.registerConfig) {
            this.registerConfig[regName].value = this.registerConfig[regName].defValue;
            this.registerConfig[regName].nodeRef.value = HEX(this.registerConfig[regName].defValue, this.registerConfig[regName].size);
        }
    }
    resetFlags() {

        for (const flagName in this.flagConfig) {
            this.flagConfig[flagName].value = this.flagConfig[flagName].defValue;
            this.flagConfig[flagName].nodeRef.checked = this.flagConfig[flagName].value;
        }
        requestAnimationFrame(() => { });
    }
    resetStack() {
        this.stack = [];
        // this.reg['sp'] = this.memory.end - 1;
        this.registerConfig['SP'].value = 0xffff;
    }
    push_in_stack(val) {
        if (this.registerConfig['SP'].value === 0) {
            console.error("Stack Overflow!");
            return;
        }
        this.stack.push(val);
        this.registerConfig['SP'].value--;
        this.memory.write(this.registerConfig['SP'].value, val);
    }
    pop_from_stack() {
        if (this.stack.length === 0) {
            console.error("Value can't be popped from empty stack");
            return;
        }
        this.registerConfig['SP'].value++;
        let val = this.stack.pop();
        return val;
    }
    incPC() {
        // console.log(this.reg['pc']);
        this.registerConfig['PC'].value++;
    }
    execute() {
        // const code = this.reg['pc'].toUpperCase();
        // console.log(this.reg['pc']);
        switch (this.memory.read(this.registerConfig['PC'].value)) {
            // MOV A, reg and MOV A, M
            case 0x7F: this.moveRegfromReg('A', 'A');
                break;
            case 0x78: this.moveRegfromReg('A', 'B');
                break;
            case 0x79: this.moveRegfromReg('A', 'C');
                break;
            case 0x7A: this.moveRegfromReg('A', 'D');
                break;
            case 0x7B: this.moveRegfromReg('A', 'E');
                break;
            case 0x7C: this.moveRegfromReg('A', 'H');
                break;
            case 0x7D: this.moveRegfromReg('A', 'L');
                break;
            case 0x7E: this.moveRegfromM('A');
                break;
            // MOV B, reg and MOV B, M
            case 0x47: this.moveRegfromReg('B', 'A');
                break;
            case 0x40: this.moveRegfromReg('B', 'B');
                break;
            case 0x41: this.moveRegfromReg('B', 'C');
                break;
            case 0x42: this.moveRegfromReg('B', 'D');
                break;
            case 0x43: this.moveRegfromReg('B', 'E');
                break;
            case 0x44: this.moveRegfromReg('B', 'H');
                break;
            case 0x45: this.moveRegfromReg('B', 'L');
                break;
            case 0x46: this.moveRegfromM('B');
                break;
            // MOV C, reg and MOV C, M
            case 0x4F: this.moveRegfromReg('C', 'A');
                break;
            case 0x48: this.moveRegfromReg('C', 'B');
                break;
            case 0x49: this.moveRegfromReg('C', 'C');
                break;
            case 0x4A: this.moveRegfromReg('C', 'D');
                break;
            case 0x4B: this.moveRegfromReg('C', 'E');
                break;
            case 0x4C: this.moveRegfromReg('C', 'H');
                break;
            case "4D": this.moveRegfromReg('C', 'L');
                break;
            case 0x4E: this.moveRegfromM('C');
                break;
            // MOV D, reg and MOV D, M
            case 0x57: this.moveRegfromReg('D', 'A');
                break;
            case 0x50: this.moveRegfromReg('D', 'B');
                break;
            case 0x51: this.moveRegfromReg('D', 'C');
                break;
            case 0x52: this.moveRegfromReg('D', 'D');
                break;
            case 0x53: this.moveRegfromReg('D', 'E');
                break;
            case 0x54: this.moveRegfromReg('D', 'H');
                break;
            case 0x55: this.moveRegfromReg('D', 'L');
                break;
            case 0x56: this.moveRegfromM('D');
                break;
            // MOV E, reg and MOV E, M
            case 0x5F: this.moveRegfromReg('E', 'A');
                break;
            case 0x58: this.moveRegfromReg('E', 'B');
                break;
            case 0x59: this.moveRegfromReg('E', 'C');
                break;
            case 0x5A: this.moveRegfromReg('E', 'D');
                break;
            case 0x5B: this.moveRegfromReg('E', 'E');
                break;
            case 0x5C: this.moveRegfromReg('E', 'H');
                break;
            case 0x5D: this.moveRegfromReg('E', 'L');
                break;
            case 0x5E: this.moveRegfromM('E');
                break;
            // MOV H, reg and MOV H, M
            case 0x67: this.moveRegfromReg('H', 'A');
                break;
            case 0x60: this.moveRegfromReg('H', 'B');
                break;
            case 0x61: this.moveRegfromReg('H', 'C');
                break;
            case 0x62: this.moveRegfromReg('H', 'D');
                break;
            case 0x63: this.moveRegfromReg('H', 'E');
                break;
            case 0x64: this.moveRegfromReg('H', 'H');
                break;
            case 0x65: this.moveRegfromReg('H', 'L');
                break;
            case 0x66: this.moveRegfromM('H');
                break;
            // MOV L, reg and MOV L, M
            case 0x6F: this.moveRegfromReg('L', 'A');
                break;
            case 0x68: this.moveRegfromReg('L', 'B');
                break;
            case 0x69: this.moveRegfromReg('L', 'C');
                break;
            case 0x6A: this.moveRegfromReg('L', 'D');
                break;
            case 0x6B: this.moveRegfromReg('L', 'E');
                break;
            case 0x6C: this.moveRegfromReg('L', 'H');
                break;
            case 0x6D: this.moveRegfromReg('L', 'L');
                break;
            case 0x6E: this.moveRegfromM('L');
                break;
            //MOV M, reg
            case 0x77: this.moveMfromReg('A');
                break;
            case 0x70: this.moveMfromReg('B');
                break;
            case 0x71: this.moveMfromReg('C');
                break;
            case 0x72: this.moveMfromReg('D');
                break;
            case 0x73: this.moveMfromReg('E');
                break;
            case 0x74: this.moveMfromReg('H');
                break;
            case 0x75: this.moveMfromReg('L');
                break;
            //MVI INSTRUCTIONS
            case 0x3E: this.moveImmediate('A');
                break;
            case 0x06: this.moveImmediate('B');
                break;
            case 0x0E: this.moveImmediate('C');
                break;
            case 0x16: this.moveImmediate('D');
                break;
            case 0x1E: this.moveImmediate('E');
                break;
            case 0x26: this.moveImmediate('H');
                break;
            case 0x2E: this.moveImmediate('L');
                break;
            case 0x36: this.moveImmediate('M');
                break;
            case 0x3A: this.lda();
                break;
            case 0x0A: this.ldax('B');
                break;
            case 0x1A: this.ldax('D');
                break;
            case 0x2A: this.lhld();
                break;
            case 0x01: this.lxi('B');
                break;
            case 0x11: this.lxi('D');
                break;
            case 0x21: this.lxi('H');
                break;
            case 0x31: this.lxi('SP');
                break;
            case 0x32: this.sta();
                break;
            case 0x02: this.stax('B');
                break;
            case 0x12: this.stax('D');
                break;
            case 0x22: this.shld();
                break;
            case 0xEB: this.xchg();
                break;


            case 0xCE: this.aci();
                break;
            case 0x8F: this.adc('A');
                break;
            case 0x88: this.adc('B');
                break;
            case 0x89: this.adc('C');
                break;
            case 0x8A: this.adc('D');
                break;
            case 0x8B: this.adc('E');
                break;
            case 0x8C: this.adc('H');
                break;
            case 0x8D: this.adc('L');
                break;
            case 0x8E: this.adc('M');
                break;
            case 0x87: this.add('A');
                break;
            case 0x80: this.add('B');
                break;
            case 0x81: this.add('C');
                break;
            case 0x82: this.add('D');
                break;
            case 0x83: this.add('E');
                break;
            case 0x84: this.add('H');
                break;
            case 0x85: this.add('L');
                break;
            case 0x86: this.add('M');
                break;
            case 0xC6: this.adi();
                break;

            //STOP
            case 0x76: return "STOP";
                break;
            //
            case 0xDE: this.sbi();
                break;
            case 0x9F: this.sbb('A');
                break;
            case 0x98: this.sbb('B');
                break;
            case 0x99: this.sbb('C');
                break;
            case 0x9A: this.sbb('D');
                break;
            case 0x9B: this.sbb('E');
                break;
            case 0x9C: this.sbb('H');
                break;
            case 0x9D: this.sbb('L');
                break;
            case 0x9E: this.sbb('M');
                break;
            case 0x97: this.sub('A');
                break;
            case 0x90: this.sub('B');
                break;
            case 0x91: this.sub('C');
                break;
            case 0x92: this.sub('D');
                break;
            case 0x93: this.sub('E');
                break;
            case 0x94: this.sub('H');
                break;
            case 0x95: this.sub('L');
                break;
            case 0x96: this.sub('M');
                break;
            case 0xD6: this.sui();
                break;
            case 0x3C: this.inr('A');
                break;
            case 0x04: this.inr('B');
                break;
            case 0x0C: this.inr('C');
                break;
            case 0x14: this.inr('D');
                break;
            case 0x1C: this.inr('E');
                break;
            case 0x24: this.inr('H');
                break;
            case 0x2C: this.inr('L');
                break;
            case 0x34: this.inr('M');
                break;
            case 0x03: this.inx('B');
                break;
            case 0x13: this.inx('D');
                break;
            case 0x23: this.inx('H');
                break;
            case 0x33: this.inx('SP');
                break;
            case 0x3D: this.dcr('A');
                break;
            case 0x05: this.dcr('B');
                break;
            case 0x0D: this.dcr('C');
                break;
            case 0x15: this.dcr('D');
                break;
            case 0x1D: this.dcr('E');
                break;
            case 0x25: this.dcr('H');
                break;
            case 0x2D: this.dcr('L');
                break;
            case 0x35: this.dcr('M');
                break;
            case 0x0B: this.dcx('B');
                break;
            case 0x1B: this.dcx('D');
                break;
            case 0x2B: this.dcx('H');
                break;
            case 0x3B: this.dcx('SP');
                break;
            case 0xA7: this.ana('A');
                break;
            case 0xA0: this.ana('B');
                break;
            case 0xA1: this.ana('C');
                break;
            case 0xA2: this.ana('D');
                break;
            case 0xA3: this.ana('E');
                break;
            case 0xA4: this.ana('H');
                break;
            case 0xA5: this.ana('L');
                break;
            case 0xA6: this.ana('M');
                break;
            case 0xE6: this.ani();
                break;
            case 0xAF: this.xra('A');
                break;
            case 0xA8: this.xra('B');
                break;
            case 0xA9: this.xra('C');
                break;
            case 0xAA: this.xra('D');
                break;
            case 0xAB: this.xra('E');
                break;
            case 0xAC: this.xra('H');
                break;
            case 0xAD: this.xra('L');
                break;
            case 0xAE: this.xra('M');
                break;
            case 0xEE: this.xri();
                break;
            case 0xB7: this.ora('A');
                break;
            case 0xB0: this.ora('B');
                break;
            case 0xB1: this.ora('C');
                break;
            case 0xB2: this.ora('D');
                break;
            case 0xB3: this.ora('E');
                break;
            case 0xB4: this.ora('H');
                break;
            case 0xB5: this.ora('L');
                break;
            case 0xB6: this.ora('M');
                break;
            case 0xBF: this.cmp('A');
                break;
            case 0xB8: this.cmp('B');
                break;
            case 0xB9: this.cmp('C');
                break;
            case 0xBA: this.cmp('D');
                break;
            case 0xBB: this.cmp('E');
                break;
            case 0xBC: this.cmp('C');
                break;
            case 0xBD: this.cmp('L');
                break;
            case 0xBE: this.cmp('M');
                break;
            case 0xFE: this.cpi();
                break;
            case 0x07: this.rlc();
                break;
            case 0x17: this.ral();
                break;
            case 0x1F: this.rar();
                break;
            case 0x0F: this.rrc();
                break;
            case 0x3F: this.cmc();
                break;
            case 0x37: this.stc();
                break;

            case 0xC5: this.push_stack('B');
                break;
            case 0xD5: this.push_stack('D');
                break;
            case 0xE5: this.push_stack('H');
                break;
            case 0xF5: this.push_stack('PSW');
                break;
            case 0xC1: this.pop_stack('B');
                break;
            case 0xD1: this.pop_stack('D');
                break;
            case 0xE1: this.pop_stack('H');
                break;
            case 0xF1: this.pop_stack('PSW');
                break;
            case 0xE3: this.xthl();
                break;
            case 0xF9: this.sphl();
                break;

            case 0xDA: this.jmp(this.flagConfig['CY'].value);
                break;
            case 0xFA: this.jmp(this.flagConfig['S'].value);
                break;
            case 0xC3: this.jmp(true);
                break;
            case 0xC2: this.jmp(!this.flagConfig['Z'].value);
                break;
            case 0xD2: this.jmp(!this.flagConfig['CY'].value);
                break;
            case 0xF2: this.jmp(!this.flagConfig['S'].value);
                break;
            case 0xEA: this.jmp(this.flagConfig['P'].value);
                break;
            case 0xE2: this.jmp(!this.flagConfig['P'].value);
                break;
            case 0xCA: this.jmp(this.flagConfig['Z'].value);
                break;
            case 0xCD: this.Call(true);
                break;
            case 0xCC: this.Call(this.flagConfig['CY'].value);
                break;
            case 0xFC: this.Call(this.flagConfig['S'].value);
                break;
            case 0xD4: this.Call(!this.flagConfig['CY'].value);
                break;
            case 0xC4: this.Call(!this.flagConfig['Z'].value);
                break;
            case 0xF4: this.Call(!this.flagConfig['S'].value);
                break;
            case 0xEC: this.Call(this.flagConfig['P'].value);
                break;
            case 0xE4: this.Call(!this.flagConfig['P'].value);
                break;
            case 0xCC: this.Call(this.flagConfig['Z'].value);
                break;
            case 0xC9: this.Ret(true);
                break;
            case 0xD8: this.Ret(this.flagConfig['CY'].value);
                break;
            case 0xF8: this.Ret(this.flagConfig['S'].value);
                break;
            case 0xD0: this.Ret(!this.flagConfig['CY'].value);
                break;
            case 0xC0: this.Ret(!this.flagConfig['Z'].value);
                break;
            case 0xF0: this.Ret(!this.flagConfig['S'].value);
                break;
            case 0xE8: this.Ret(this.flagConfig['P'].value);
                break;
            case 0xE0: this.Ret(!this.flagConfig['P'].value);
                break;
            case 0xC8: this.Ret(this.flagConfig['Z'].value);
                break;
            case 0xE9: this.pchl();
                break;
            default:
                {
                    alert(`Sorry, "${HEX(this.memory.read(this.registerConfig['PC'].value), 2)}" is unimplemented. Please raise a issue on github.`)
                    return false
                }
        }
    }
    updateDebugView() {
        this.memory.updateCurrentFrame();
        this.updateFlagView();
        this.updateRegisterView();
    }
    onJump(onJumpCallback) {
        this.onJumpCallback = onJumpCallback;
    }
    offJump() {
        this.onJumpCallback = null;
    }
    isJump(from, to) {
        if (this.onJumpCallback)
            this.onJumpCallback(from, to);
    }
    setPCNoJump(start_address) {
        this.registerConfig['PC'].value = start_address;
    }
    executor(start_address, debug) {
        let count = 5000;
        this.setPCNoJump(start_address);
        while (this.registerConfig['PC'].value !== this.memory.end) {
            const res = this.execute();
            count--;
            if (count <= 0) {
                alert("Reached out the max time limit");
                return;
            }
            if (res === "STOP") {
                this.updateDebugView();
                return;
            }
            if (res === false) {
                return;
            }
            if (debug.reg_db) {
                console.table(this.registerConfig);
            }
            if (debug.flag_db) {
                console.table(this.flagConfig);
            }
        }
        this.updateDebugView();
        alert("reached the end of the memory without any halt statement");
    }
    setFlags(...rest) {
        this.resetFlags();
        for (let e of rest) {
            this.flagConfig[e] = 1;
        }
    }
    pchl() {
        const from = this.registerConfig['PC'].value
        this.incPC();
        this.registerConfig['PC'].value = this.getPairData('H', 'L');
        this.isJump(from, this.registerConfig['PC'].value);
    }
    lda() {
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.registerConfig['A'].value = this.memory.read((hi << 8) | lo);
        this.incPC();
    }
    sta() {
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.memory.write((hi << 8) | lo, this.registerConfig['A'].value);
        this.incPC();
    }
    ldax(reg2) {
        this.incPC();
        let reg3 = (reg2 === 'B') ? 'C' : 'E';
        this.registerConfig['A'].value = this.memory.read(this.getPairData(reg2, reg3));
    }
    stax(reg2) {
        this.incPC();
        let reg3 = (reg2 === 'B') ? 'C' : 'E';
        this.memory.write(this.getPairData(reg2, reg3), this.registerConfig['A'].value);
    }
    lhld() {
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.registerConfig['L'].value = this.memory.read((hi << 8) | lo);
        this.registerConfig['H'].value = this.memory.read(((hi << 8) | lo) + 1);
        this.incPC();
    }
    shld() {
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.memory.write((hi << 8) | lo, this.registerConfig['L'].value);
        this.memory.write(((hi << 8) | lo) + 1, this.registerConfig['H'].value);
        this.incPC();
    }
    lxi(reg2) {
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        if (reg2 === 'SP') {
            this.registerConfig['SP'].value = (hi << 8) | lo;
        }
        else {
            let reg3;
            if (reg2 === 'B') reg3 = 'C';
            else if (reg2 === 'D') reg3 = 'E';
            else reg3 = 'L';
            this.registerConfig[reg3].value = lo;
            this.registerConfig[reg2].value = hi;
        }
    }
    xchg() {
        this.incPC();
        [this.registerConfig['H'].value, this.registerConfig['L'].value, this.registerConfig['D'].value, this.registerConfig['E'].value] = [this.registerConfig['D'].value, this.registerConfig['E'].value, this.registerConfig['D'].value, this.registerConfig['E'].value];
    }
    assemble_psw() {
        return (this.flagConfig['S'].value << 7) | (this.flagConfig['Z'].value << 6) | (this.flagConfig['AC'].value << 4) | (this.flagConfig['P'].value << 2) | (this.flagConfig['CY'].value << 0);
    }
    dissamble_psw(psw_word) {
        this.flagConfig['S'].value = (psw_word >> 7) & 0x01;
        this.flagConfig['Z'].value = (psw_word >> 6) & 0x01;
        this.flagConfig['AC'].value = (psw_word >> 4) & 0x01;
        this.flagConfig['P'].value = (psw_word >> 2) & 0x01;
        this.flagConfig['CY'].value = (psw_word >> 0) & 0x01;
    }
    push_stack(reg2) {
        this.incPC();
        if (reg2 !== 'PSW') {
            let reg3;
            if (reg2 === 'B') reg3 = 'C';
            else if (reg2 === 'D') reg3 = 'E';
            else reg3 = 'L';
            this.push_in_stack(this.registerConfig[reg2].value);
            this.push_in_stack(this.registerConfig[reg3].value);
        }
        else {
            this.push_in_stackh(this.registerConfig['A'].value);
            this.push_in_stack(this.assemble_psw());
        }
    }
    pop_stack(reg2) {
        this.incPC();
        if (reg2 !== 'PSW') {
            let reg3;
            if (reg2 === 'B') reg3 = 'C';
            else if (reg2 === 'D') reg3 = 'E';
            else reg3 = 'L';
            this.registerConfig[reg3].value = this.pop_from_stack();
            this.registerConfig[reg2].value = this.pop_from_stack();
        }
        else {
            this.dissamble_psw(this.pop_from_stack());
            this.registerConfig['A'].value = this.pop_from_stack();
        }
    }
    xthl() {
        this.incPC();
        let tmp1 = this.registerConfig['L'].value;
        this.registerConfig['L'].value = this.memory.read(this.registerConfig['SP'].value);
        this.memory.write(this.registerConfig['SP'].value, tmp1);
        tmp1 = this.registerConfig['H'].value;
        this.registerConfig['H'].value = this.memory.read(this.registerConfig['SP'].value + 1);
        this.memory.write(this.registerConfig['SP'].value + 1, tmp1);
    }
    sphl() {
        this.incPC();
        this.registerConfig['SP'].value = (this.registerConfig['H'].value << 8) | this.registerConfig['L'].value;
    }
    jmp(condition) {
        const from = this.registerConfig['PC'].value;
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        if (condition) {
            this.registerConfig['PC'].value = (hi << 8) | lo;
            this.isJump(from, this.registerConfig['PC'].value);
        }
    }
    Call(condition) {
        const from = this.registerConfig['PC'].value;
        this.incPC();
        let lo = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        let hi = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        if (condition) {
            this.push_in_stack((this.registerConfig['PC'].value >> 8) & 0xFF);
            this.push_in_stack((this.registerConfig['PC'].value) & 0xFF);
            this.registerConfig['PC'].value = (hi << 8) | lo;
            this.isJump(from, this.registerConfig['PC'].value);

        }
    }
    Ret(condition) {
        const from = this.registerConfig['PC'].value;
        this.incPC();
        let lo = this.pop_from_stack();
        let hi = this.pop_from_stack();
        if (condition) {
            this.registerConfig['PC'].value = (hi << 8) | lo;
            this.isJump(from, this.registerConfig['PC'].value);
        }
    }
    getPairData(reg1, reg2) {
        return (this.registerConfig[reg1].value << 8) | this.registerConfig[reg2].value;
    }
    moveRegfromReg(reg1, reg2) {
        this.incPC();
        this.registerConfig[reg1].value = this.registerConfig[reg2].value;
    }
    moveRegfromM(reg1) {
        this.incPC();
        this.registerConfig[reg1].value = this.memory.read(this.getPairData('H', 'L'));
    }
    moveMfromReg(reg1) {
        this.incPC();
        this.memory.write(this.getPairData('H', 'L'), this.registerConfig[reg1].value);
    }
    moveImmediate(reg1) {
        this.incPC();
        if (reg1 != 'M') {
            this.registerConfig[reg1].value = this.memory.read(this.registerConfig['PC'].value);
        }
        else {
            this.memory.write(this.getPairData('H', 'L'), this.memory.read(this.registerConfig['PC'].value));
        }
        this.incPC();
    }

    setFlagADD(val1, val2) {
        this.resetFlags();
        let tmp = val1 + val2;
        this.flagConfig['AC'].value = ((val1 & 0xF) + (val2 & 0xF)) > 0x0F ? 1 : 0;
        this.flagConfig['Z'].value = ((tmp & 0xFF) === 0x00) ? 1 : 0;
        this.flagConfig['S'].value = ((tmp & 0x80) === 0x80) ? 1 : 0;
        this.flagConfig['CY'].value = ((tmp & 0x100) === 0x100) ? 1 : 0;
        this.flagConfig['P'].value = this.getParity(tmp);
    }
    // setFlagINR(val1) {
    //     let CY = this.flagConfig['CY'].value;
    //     this.resetFlags();
    //     this.flagConfig['CY'].value = CY;
    //     let tmp = val1 + 1;
    //     this.flagConfig['AC'].value = ((val1 & 0xF) + 1) > 0x0F ? 1 : 0;
    //     this.flagConfig['Z'].value = (tmp & 0xFF) == 0x00 ? 1 : 0;
    //     this.flagConfig['S'].value = (tmp & 0x80) == 0x80 ? 1 : 0;
    //     this.flagConfig['P'].value = getParity(tmp & 0xFF);
    // }

    getParity(num_8bitnumber) {
        let count = 0;
        for (let i = 0; i < 8; i++) {
            count += ((num_8bitnumber >> i) & 1) ? 1 : 0;
        }
        return (count % 2 === 0) ? 1 : 0;
    }




    aci() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value) + this.flagConfig['CY'].value;
        this.incPC();
        this.setFlagADD(a_content, other);
        a_content += other;
        a_content %= 256;
        this.registerConfig['A'].value = a_content;
    }
    adi() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        this.setFlagADD(a_content, other);
        a_content += other;
        a_content %= 256;
        this.registerConfig['A'].value = a_content;
    }
    adc(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L')) + this.flagConfig['CY'].value;
        this.setFlagADD(a_content, other);
        a_content += other;
        a_content %= 256;
        this.registerConfig['A'].value = a_content;
    }
    add(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        this.setFlagADD(a_content, other);
        a_content += other;
        a_content %= 256;
        this.registerConfig['A'].value = a_content;

    }
    sub(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        let _2comp_other = TwoComp8Bit(other);
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
        a_content += _2comp_other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    sbb(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L')) + this.flagConfig['CY'].value;
        let _2comp_other = TwoComp8Bit(other);
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
        a_content += _2comp_other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    sui() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value);
        let _2comp_other = TwoComp8Bit(other);
        this.incPC();
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
        a_content += _2comp_other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    sbi() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value) + this.flagConfig['CY'].value;
        let _2comp_other = TwoComp8Bit(other);
        this.incPC();
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
        a_content += _2comp_other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    inr(reg2) {
        this.incPC();
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        const CY = this.flagConfig['CY'].value;
        this.setFlagADD(other, 0x01);
        this.flagConfig['CY'].value = CY;
        if (reg2 !== 'M') {
            this.registerConfig[reg2].value = (other + 1) & 0xFF;
        }
        else {
            this.memory.write(this.getPairData('H', 'L'), (other + 1) & 0xFF);
        }
    }
    inx(reg2) {
        this.incPC();
        if (reg2 === 'SP') {
            this.registerConfig['SP'].value++;
            this.registerConfig['SP'].value &= 0xFFFF;
        }
        else {
            let reg3;
            if (reg2 === 'B') reg3 = 'C';
            else if (reg2 === 'D') reg3 = 'E';
            else reg3 = 'L';
            let val = (this.registerConfig[reg2].value << 8) | this.registerConfig[reg3].value;
            val++;
            this.registerConfig[reg2].value = (val >> 8) & 0xFF;
            this.registerConfig[reg3].value = val & 0x00FF;
        }
    }
    dcr(reg2) {
        this.incPC();
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        const CY = this.flagConfig['CY'].value;
        this.setFlagADD(other, 0xFF);
        this.flagConfig['CY'].value = CY;
        if (reg2 !== 'M') {
            this.registerConfig[reg2].value = (other - 1) & 0xFF;
        }
        else {
            this.memory.write(this.getPairData('H', 'L'), (other - 1) & 0xFF);
        }
    }
    dcx(reg2) {
        this.incPC();
        if (reg2 === 'SP') {
            this.registerConfig['SP'].value--;
            this.registerConfig['SP'].value &= 0xFFFF;
        }
        else {
            let reg3;
            if (reg2 === 'B') reg3 = 'C';
            else if (reg2 === 'D') reg3 = 'E';
            else reg3 = 'L';
            this.registerConfig[reg3].value--
            // let val = (this.reg[reg2] << 8) | this.reg[reg3];
            if (this.getPairData(reg2, reg3) < 0) {
                this.registerConfig[reg2].value = 0xFF;
                this.registerConfig[reg3].value = 0xFF;
            }
            if (this.registerConfig[reg3].value < 0) {
                this.registerConfig[reg3].value = 0xFF;
                this.registerConfig[reg2].value--;
            }
        }
    }
    ana(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        a_content = a_content & other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 1;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    ani() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        a_content = a_content & other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 1;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    xra(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        a_content = a_content ^ other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 0;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    xri() {
        this.incPC();
        let a_content = this.registerConfig['A'].value
        let other = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        a_content = a_content ^ other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 0;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    ora(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        a_content = a_content | other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 0;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    ori() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value);
        this.incPC();
        a_content = a_content | other;
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
        this.flagConfig['AC'].value = 0;
        this.flagConfig['CY'].value = 0;
        this.flagConfig['P'].value = this.getParity(a_content);
        this.flagConfig['S'].value = (a_content & 0x80 === 0x80) ? 1 : 0;
        this.flagConfig['Z'].value = (a_content === 0x00) ? 1 : 0;
    }
    cmp(reg2) {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = (reg2 !== 'M') ? this.registerConfig[reg2].value : this.memory.read(this.getPairData('H', 'L'));
        let _2comp_other = TwoComp8Bit(other);
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
    }
    cpi() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        let other = this.memory.read(this.registerConfig['PC'].value);
        let _2comp_other = TwoComp8Bit(other);
        this.incPC();
        this.setFlagADD(a_content, _2comp_other);
        this.flagConfig['CY'].value ^= 1;
    }
    rlc() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        a_content = a_content << 1;
        this.flagConfig['CY'].value = (a_content >> 8) & 0x01;
        a_content &= 0xFF;
        a_content = a_content | this.flagConfig['CY'].value;
        this.registerConfig['A'].value = a_content;
    }
    rrc() {
        this.incPC();
        let a_content = this.registerConfig['A'].value;
        this.flagConfig['CY'].value = a_content & 0x01;
        a_content = a_content >> 1;
        a_content = a_content | (this.flagConfig['CY'].value << 7);
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    ral() {
        this.incPC();
        let tmp = this.flagConfig['CY'].value;
        let a_content = this.registerConfig['A'].value;
        a_content = a_content << 1;
        this.flagConfig['CY'].value = (a_content >> 8) & 0x01;
        a_content &= 0xFF;
        a_content = a_content | tmp;
        this.registerConfig['A'].value = a_content;
    }
    rar() {
        this.incPC();
        let tmp = this.flagConfig['CY'].value;
        let a_content = this.registerConfig['A'].value;
        this.flagConfig['CY'].value = a_content & 0x01;
        a_content = a_content >> 1;
        a_content = a_content | (tmp << 7);
        a_content &= 0xFF;
        this.registerConfig['A'].value = a_content;
    }
    cmc() {
        this.incPC();
        this.flagConfig['CY'].value ^= 1;
    }
    stc() {
        this.incPC();
        this.flagConfig['CY'].value = 1;
    }
}

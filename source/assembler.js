import { getParser } from "./parser.js";
import { DEC } from "./util/util.js";





export class Assembler {
    constructor(editor) {
        this.lineCount = 0;
        this.editor = editor;
        this.setError = false;
        this.DETAILS = {
            'aci': { arg1: '8' },
            'adc': { arg1: 'reg' },
            'add': { arg1: 'reg' },
            'adi': { arg1: '8' },
            'ana': { arg1: 'reg' },
            'ani': { arg1: '8' },
            'call': { arg1: '16' },
            'cc': { arg1: '16' },
            'cm': { arg1: '16' },
            'cma': {},
            'cmc': {},
            'cmp': { arg1: 'reg' },
            'cnc': { arg1: '16' },
            'cnz': { arg1: '16' },
            'cp': { arg1: '16' },
            'cpe': { arg1: '16' },
            'cpi': { arg1: '8' },
            'cpo': { arg1: '16' },
            'cz': { arg1: '16' },
            'daa': {},
            'dad': { arg1: 'reg' },
            'dcr': { arg1: 'reg' },
            'dcx': { arg1: 'reg' },
            'di': {},
            'ei': {},
            'hlt': {},
            'in': { arg1: '8' },
            'inr': { arg1: 'reg' },
            'inx': { arg1: 'reg' },
            'jc': { arg1: '16' },
            'jnc': { arg1: '16' },
            'jm': { arg1: '16' },
            'jmp': { arg1: '16' },
            'jnz': { arg1: '16' },
            'jp': { arg1: '16' },
            'jpe': { arg1: '16' },
            'jpo': { arg1: '16' },
            'jz': { arg1: '16' },
            'lda': { arg1: '16' },
            'ldax': { arg1: 'reg' },
            'lhld': { arg1: '16' },
            'lxi': { arg1: 'reg', arg2: '16' },
            'mov': { arg1: 'reg', arg2: 'reg' },
            'mvi': { arg1: 'reg', arg2: '8' },
            'nop': {},
            'ora': { arg1: 'reg' },
            'ori': { arg1: '8' },
            'out': { arg1: '8' },
            'pchl': {},
            'pop': { arg1: 'reg' },
            'push': { arg1: 'reg' },
            'ral': {},
            'rar': {},
            'rc': {},
            'ret': {},
            'rim': {},
            'rlc': {},
            'rm': {},
            'rnc': {},
            'rnz': {},
            'rp': {},
            'rpe': {},
            'rpo': {},
            'rrc': {},
            'rst': { arg1: '3' },
            'rz': {},
            'sbb': { arg1: 'reg' },
            'sbi': { arg1: '8' },
            'shld': { arg1: '16' },
            'sim': {},
            'sphl': {},
            'sta': { arg1: '16' },
            'stax': { arg1: 'reg' },
            'stc': {},
            'sub': { arg1: 'reg' },
            'sui': { arg1: '8' },
            'xchg': {},
            'xra': { arg1: 'reg' },
            'xri': { arg1: '8' },
            'xthl': {},
        }
        this.OP_TO_BIN = {
            // 'a'
            'aci': 0xce,
            'adc a': 0x8f,
            'adc b': 0x88,
            'adc c': 0x89,
            'adc d': 0x8a,
            'adc e': 0x8b,
            'adc h': 0x8c,
            'adc l': 0x8d,
            'adc m': 0x8e,
            'add a': 0x87,
            'add b': 0x80,
            'add c': 0x81,
            'add d': 0x82,
            'add e': 0x83,
            'add h': 0x84,
            'add l': 0x85,
            'add m': 0x86,
            'adi': 0xc6,

            'ana a': 0xa7,
            'ana b': 0xa0,
            'ana c': 0xa1,
            'ana d': 0xa2,
            'ana e': 0xa3,
            'ana h': 0xa4,
            'ana l': 0xa5,
            'ana m': 0xa6,
            'ani': 0xe6,

            // 'c'
            'call': 0xcd,
            'cc': 0xdc,
            'cm': 0xfc,

            'cma': 0x2f,
            'cmc': 0x3f,

            'cmp a': 0xbf,
            'cmp b': 0xb8,
            'cmp c': 0xb9,
            'cmp d': 0xba,
            'cmp e': 0xbb,
            'cmp h': 0xbc,
            'cmp l': 0xbd,
            'cmp m': 0xbe,

            'cnc': 0xd4,
            'cnz': 0xc4,
            'cp': 0xf4,
            'cpe': 0xec,
            'cpi': 0xfe,
            'cpo': 0xe4,
            'cz': 0xcc,

            // 'd'
            'daa': 0x27,

            'dad b': 0x9,
            'dad d': 0x19,
            'dad h': 0x29,
            'dad sp': 0x39,

            'dcr a': 0x3d,
            'dcr b': 0x5,
            'dcr c': 0x0d,
            'dcr d': 0x15,
            'dcr e': 0x1d,
            'dcr h': 0x25,
            'dcr l': 0x2d,
            'dcr m': 0x35,

            'dcx b': 0x0b,
            'dcx d': 0x1b,
            'dcx h': 0x2b,
            'dcx sp': 0x3b,

            'di': 0xf3,

            // 'e'
            'ei': 0xfb,

            // 'h'
            'hlt': 0x76,

            // 'i'
            'in': 0xdb,
            'inr a': 0x3c,
            'inr b': 0x4,
            'inr c': 0x0c,
            'inr d': 0x14,
            'inr e': 0x1c,
            'inr h': 0x24,
            'inr l': 0x2c,
            'inr m': 0x34,
            'inx b': 0x3,
            'inx d': 0x13,
            'inx h': 0x23,
            'inx sp': 0x33,

            // 'j'
            'jc': 0xda,
            'jnc': 0xd2,
            'jm': 0xfa,
            'jmp': 0xc3,
            'jnz': 0xc2,
            'jp': 0xf2,
            'jpe': 0xea,
            'jpo': 0xe2,
            'jz': 0xca,

            // 'l'

            'lda': 0x3a,
            'ldax b': 0x0a,
            'ldax d': 0x1a,
            'lhld': 0x2a,
            'lxi b': 0x01,
            'lxi d': 0x11,
            'lxi h': 0x21,
            'lxi sp': 0x31,

            // 'm'
            'mov a, a': 0x7f,
            'mov a, b': 0x78,
            'mov a, c': 0x79,
            'mov a, d': 0x7a,
            'mov a, e': 0x7b,
            'mov a, h': 0x7c,
            'mov a, l': 0x7d,
            'mov a, m': 0x7e,

            'mov b, a': 0x47,
            'mov b, b': 0x40,
            'mov b, c': 0x41,
            'mov b, d': 0x42,
            'mov b, e': 0x43,
            'mov b, h': 0x44,
            'mov b, l': 0x45,
            'mov b, m': 0x46,

            'mov c, a': 0x4f,
            'mov c, b': 0x48,
            'mov c, c': 0x49,
            'mov c, d': 0x4a,
            'mov c, e': 0x4b,
            'mov c, h': 0x4c,
            'mov c, l': 0x4d,
            'mov c, m': 0x4e,

            'mov d, a': 0x57,
            'mov d, b': 0x50,
            'mov d, c': 0x51,
            'mov d, d': 0x52,
            'mov d, e': 0x53,
            'mov d, h': 0x54,
            'mov d, l': 0x55,
            'mov d, m': 0x56,

            'mov e, a': 0x5f,
            'mov e, b': 0x58,
            'mov e, c': 0x59,
            'mov e, d': 0x5a,
            'mov e, e': 0x5b,
            'mov e, h': 0x5c,
            'mov e, l': 0x5d,
            'mov e, m': 0x5e,

            'mov h, a': 0x67,
            'mov h, b': 0x60,
            'mov h, c': 0x61,
            'mov h, d': 0x62,
            'mov h, e': 0x63,
            'mov h, h': 0x64,
            'mov h, l': 0x65,
            'mov h, m': 0x66,

            'mov l, a': 0x6f,
            'mov l, b': 0x68,
            'mov l, c': 0x69,
            'mov l, d': 0x6a,
            'mov l, e': 0x6b,
            'mov l, h': 0x6c,
            'mov l, l': 0x6d,
            'mov l, m': 0x6e,

            'mov m, a': 0x77,
            'mov m, b': 0x70,
            'mov m, c': 0x71,
            'mov m, d': 0x72,
            'mov m, e': 0x73,
            'mov m, h': 0x74,
            'mov m, l': 0x75,

            'mvi a': 0x3e,
            'mvi b': 0x06,
            'mvi c': 0x0e,
            'mvi d': 0x16,
            'mvi e': 0x1e,
            'mvi h': 0x26,
            'mvi l': 0x2e,
            'mvi m': 0x36,

            // 'n'
            'nop': 0x0,

            // 'o'
            'ora a': 0xb7,
            'ora b': 0xb0,
            'ora c': 0xb1,
            'ora d': 0xb2,
            'ora e': 0xb3,
            'ora h': 0xb4,
            'ora l': 0xb5,
            'ora m': 0xb6,

            'ori': 0xf6,
            'out': 0xd3,

            // 'p'
            'pchl': 0xe9,
            'pop b': 0xc1,
            'pop d': 0xd1,
            'pop h': 0xe1,
            'pop psw': 0xf1,

            'push b': 0xc5,
            'push d': 0xd5,
            'push h': 0xe5,
            'push psw': 0xf5,

            // 'r'
            'ral': 0x17,
            'rar': 0x1f,
            'rc': 0xd8,
            'ret': 0xc9,
            'rim': 0x20,
            'rlc': 0x7,
            'rm': 0xf8,
            'rnc': 0xd0,
            'rnz': 0xc0,
            'rp': 0xf0,
            'rpe': 0xe8,
            'rpo': 0xe0,
            'rrc': 0x0f,
            'rst 0': 0xc7,
            'rst 1': 0xcf,
            'rst 2': 0xd7,
            'rst 3': 0xdf,
            'rst 4': 0xe7,
            'rst 5': 0xef,
            'rst 6': 0xf7,
            'rst 7': 0xff,
            'rz': 0xc8,

            // 's'
            'sbb a': 0x9f,
            'sbb b': 0x98,
            'sbb c': 0x99,
            'sbb d': 0x9a,
            'sbb e': 0x9b,
            'sbb h': 0x9c,
            'sbb l': 0x9d,
            'sbb m': 0x9e,

            'sbi': 0xde,
            'shld': 0x22,
            'sim': 0x30,
            'sphl': 0xf9,
            'sta': 0x32,
            'stax b': 0x2,
            'stax d': 0x12,
            'stc': 0x37,
            'sub a': 0x97,
            'sub b': 0x90,
            'sub c': 0x91,
            'sub d': 0x92,
            'sub e': 0x93,
            'sub h': 0x94,
            'sub l': 0x95,
            'sub m': 0x96,
            'sui': 0xd6,

            // 'x'
            'xchg': 0xeb,
            'xra a': 0xaf,
            'xra b': 0xa8,
            'xra c': 0xa9,
            'xra d': 0xaa,
            'xra e': 0xab,
            'xra h': 0xac,
            'xra l': 0xad,
            'xra m': 0xae,
            'xri': 0xee,
            'xthl': 0xe3
        };

        // this.check_dup();
    }
    check_dup() {
        for (let item in this.OP_TO_BIN) {
            for (let item2 in this.OP_TO_BIN) {
                if (this.OP_TO_BIN[item] == this.OP_TO_BIN[item2] && item != item2) {
                    console.log(item, item2);
                }
            }
        }
    }
    getBin(opcode) {
        const value = this.OP_TO_BIN[opcode];
        // console.log(value);
        if (value) {
            return value;
        }
        console.error(`No bin for ${opcode}`);
        this.showErrorAtLine(this.currentLineNumber);
        return 0;
    }
    showErrorAtLine(lineNumber) {
        this.setError = true;
        this.editor.addLineClass(lineNumber, "text", "CodeMirror-error")
    }
    removeAllError() {
        this.lineCount = this.editor.lineCount();
        for (let i = 0; i < this.lineCount; i++) {
            this.editor.removeLineClass(i, "text", "CodeMirror-error");
        }
    }
    getDetails(opcode) {
        return this.DETAILS[opcode];
    }
    assemble(loadLocation) {
        this.currentLocation = loadLocation ? loadLocation : 0x0000;
        this.lines = [];
        this.setError = false;
        this.binaries = [];
        this.labelTable = {};
        this.currentLineNumber = 0;
        this.lineCount = this.editor.lineCount();
        this.removeAllError();
        this.doLabel();
        // console.log(this.labelTable);
        this.currentLocation = loadLocation ? loadLocation : 0x0000;
        this.binaries = [];
        this.currentLineNumber = 0;
        this.lines = [];
        this.doAssemble();
        return !this.setError && this.binaries;
    }
    doLabel() {
        for (let i = 0; i < this.lineCount; i++) {
            this.lines.push(this.editor.getLine(i).trim());
            this.parser = getParser();
            try {
                this.parser.feed(this.lines[i]);
            }
            catch (e) {
                this.showErrorAtLine(i);
                console.error(`Unexpected Token At line: ${i}, col: ${e.offset}`);
                break;
            }
            this.currentLineNumber = i;
            this.convert(i, true);
        }
    }
    doAssemble() {
        for (let i = 0; i < this.lineCount; i++) {
            this.lines.push(this.editor.getLine(i).trim());
            this.parser = getParser();
            try {
                this.parser.feed(this.lines[i]);
            }
            catch (e) {
                this.showErrorAtLine(i);
                console.error(`Unexpected Token At line: ${i}, col: ${e.offset}`);
                break;
            }
            // console.log(this.lines[i]);
            this.currentLineNumber = i;
            this.convert(i, false);
        }
    }
    convert(lineNumber, label) {
        const tmp = [];
        if (this.parser.results.length == 0) {
            this.showErrorAtLine(lineNumber);
            console.error(`Unexpected Token At ${0}}`);
        }

        const res = this.parser.results[0];
        if (!res || res.length == 0) {
            this.showErrorAtLine(lineNumber);
            console.error(`Unexpected Token At ${0}}`);
            return;
        }
        // console.log(res);
        // if
        if (label && res.label) {
            this.handleLabel(res.label);
        }
        if (res.inst) {
            const bins = this.handleInst(res.inst, label);
            if (bins === false || bins.length === 0) {
                this.showErrorAtLine(lineNumber);
                // console.error(`Unexpected Token At ${0}}`);
                return;
            }
            // console.log(bins);
            this.currentLocation += bins.length;
            // console.log({ loc: this.currentLocation, bin: bins, len: bins.length });
            for (const bin of bins) {
                tmp.push(bin);
            }
        }
        this.binaries.push(tmp);
    }
    handleLabel(label) {
        if (this.labelTable[label.labelName] === undefined) {
            this.labelTable[label.labelName] = this.currentLocation;
            return true;
        }
        else {
            return "Redefined Error";
        }
    }
    handleInst(inst, forLabel) {
        let opcode = inst.opcode.toLowerCase();
        const details = this.getDetails(opcode);
        if (!details) {
            return false;
        }
        const a1 = details.arg1;
        const a2 = details.arg2;
        let tmp = []
        if (inst.arg1 === null && inst.arg2 === null) {
            tmp.push(this.getBin(opcode));
            return tmp;
        }
        if (inst.arg1.type === 'reg' && a1 === 'reg') {
            opcode += ' ' + inst.arg1.value.toLowerCase();
            if (inst.arg2 === null) {
                tmp.push(this.getBin(opcode));
                return tmp;
            }
            if (inst.arg2.type === 'reg' && a2 === 'reg') {
                opcode += ', ' + inst.arg2.value.toLowerCase();
                tmp.push(this.getBin(opcode));
                return tmp;
            }
            if (inst.arg2.type == 'hex') {
                const dec = DEC(inst.arg2.value);
                if (a2 === '8' && dec < 256 && dec >= 0) {
                    tmp.push(this.getBin(opcode));
                    tmp.push(dec);
                    return tmp;
                }
                else if (a2 == '16' && dec < 256 * 256 && dec >= 0) {
                    tmp.push(this.getBin(opcode));
                    tmp.push(dec & 0x00FF);
                    tmp.push((dec >> 8) & 0x00FF);
                    return tmp;
                }
            }
            if (inst.arg2.type == 'label') {
                const lbl = inst.arg2.value;
                if (this.labelTable[lbl] != undefined && a2 == '16') {
                    const dec = this.labelTable[lbl];
                    tmp.push(this.getBin(opcode));
                    tmp.push(dec & 0x00FF);
                    tmp.push((dec >> 8) & 0x00FF);
                    return tmp;
                }
                else {
                    if (!forLabel)
                        this.showErrorAtLine(this.currentLineNumber);
                    else {
                        const dec = 0;
                        tmp.push(this.getBin(opcode));
                        tmp.push(dec & 0x00FF);
                        tmp.push((dec >> 8) & 0x00FF);
                        return tmp;
                    }
                }
            }
        }
        if (inst.arg1.type === 'hex') {
            const dec = DEC(inst.arg1.value);
            if (a1 === '8' && dec < 256 && dec >= 0) {
                tmp.push(this.getBin(opcode));
                tmp.push(dec);
                return tmp;
            }
            else if (a1 == '16' && dec < 256 * 256 && dec >= 0) {
                tmp.push(this.getBin(opcode));
                tmp.push(dec & 0x00FF);
                tmp.push((dec >> 8) & 0x00FF);
                return tmp;
            }
        }
        if (inst.arg1.type == 'label') {
            const lbl = inst.arg1.value;
            if (this.labelTable[lbl] != undefined && a1 == '16') {
                const dec = this.labelTable[lbl];
                tmp.push(this.getBin(opcode));
                tmp.push(dec & 0x00FF);
                tmp.push((dec >> 8) & 0x00FF);
                return tmp;
            }
            else {
                if (!forLabel)
                    this.showErrorAtLine(this.currentLineNumber);
                else {
                    const dec = 0;
                    tmp.push(this.getBin(opcode));
                    tmp.push(dec & 0x00FF);
                    tmp.push((dec >> 8) & 0x00FF);
                    return tmp;
                }
            }
        }

        return tmp;
    }

}

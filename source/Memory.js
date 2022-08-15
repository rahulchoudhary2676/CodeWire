import { HEX, DEC, IsHexChar } from '../src/util/util.js'
class MemoryLocation {
    constructor(loc, data) {
        this.location = loc;
        this.data = data;
        this.written = false;
    }
    reset() {
        this.data = 0x00;
        this.written = false;
    }
    set(data) {
        this.data = data;
        this.written = true;
    }
    get() {
        return this.data;
    }

}


export class Memory {
    constructor(size_bytes, operating_range, memoryViewRoot, operating_mode) {
        this.memory_size = 256 * 256;
        this.start = 0
        this.end = 256 * 256;
        this.memoryViewRoot = memoryViewRoot
        this.refresh();
        this.setMemoryView();
        this.memoryInputEl = document.getElementById("memory-address-input")
        // this.memoryInputEl.addEventListener("change", (e) => { e.target.value })
        this.currentAddressBarValue = '0000'
        this.memoryInputEl.addEventListener('input', (e) => {
            let value = e.target.value
            if (e.inputType === "insertText" && !IsHexChar(e.data)) {
                e.target.value = this.currentAddressBarValue
            }
            // console.log(value, DEC(value));
            this.currentAddressBarValue = e.target.value.length != 0 ? e.target.value : '0'
            this.showMemoryByLoc(DEC(this.currentAddressBarValue))
        })
        this.currentFrame = 0
        // this.program_counter = null;
        // this.stack_pointer = this.end;
    }
    __isInRange(loc) {
        return loc >= this.start && loc < this.end;
    }
    refresh() {
        this.memory_locations = [];
        for (let i = 0; i < this.memory_size; i++) {
            this.memory_locations.push(new MemoryLocation(i, 0x00));
        }
        this.setMemoryView()
    }
    is_location_in_current_frame(loc) {
        const frame = Math.floor(loc / 256)
        return frame === this.currentFrame
    }

    write(loc, data) {
        if (this.__isInRange(loc)) {
            if (!(data >= 0 && data <= 255)) {
                console.error(`Can't write ${data} to 8 bit memory`);
            }
            this.memory_locations[loc].set(data);
            return true;
        }
        else {
            console.error(`Unauthorized Memory Access At Location ${HEX(loc, 4)}`);
            return false;
        }
    }
    isWritten(loc) {
        return this.memory_locations[loc].written;
    }

    read(loc) {
        // console.log(loc_hex);
        if (this.__isInRange(loc)) {
            return this.memory_locations[loc].get();
        }
        else {
            console.error(`Unauthorized Memory Access At Location ${HEX(loc, 4)}`);
            return null;
        }
    }
    resetLocation(loc) {
        this.memory_locations[loc].reset();
    }
    createRow(row_number, col_count) {

        if (row_number == 0) {
            const row = document.createElement('div');
            row.id = `memory-row-sp`;
            row.classList.toggle('memory-row', true);
            for (let i = -1; i < col_count; i++) {
                const cell = document.createElement('div');
                cell.id = `memory-cell-sp-row-${i}`;
                if (i != -1)
                    cell.innerText = ('value', `${HEX(i, 1)}`);
                cell.classList.toggle('memory-cell', true);
                cell.classList.toggle('memory-cell-sp', true);
                row.append(cell);
            }
            this.memoryViewRoot.append(row);
        }

        const row = document.createElement('div');
        row.id = `memory-row-${row_number}`;
        row.classList.toggle('memory-row', true);
        for (let i = 0; i < col_count; i++) {
            if (i == 0) {
                const cell = document.createElement('div');
                cell.id = `memory-cell-sp-cp-${row_number}`;
                cell.innerText = ('value', `${HEX(row_number, 3)}`);
                cell.classList.toggle('memory-cell', true);
                cell.classList.toggle('memory-cell-sp', true);
                row.append(cell);
            }
            const cell = document.createElement('input');
            cell.id = `memory-cell-${row_number}-${i}`;
            cell.setAttribute('type', 'text');
            cell.setAttribute('value', '00');
            cell.setAttribute('maxlength', 2);
            cell.classList.toggle('memory-cell', true);
            cell.addEventListener('input', (e) => {
                if (e.inputType === "insertText" && !IsHexChar(e.data)) {
                    if (e.target.length == 1) {
                        e.target.value == ''
                    }
                    else if (e.target.value[0] == e.data)
                        e.target.value = e.target.value.substr(1, 2)
                    else
                        e.target.value = e.target.value.substr(0, 1)
                }
            })
            cell.addEventListener('blur', (e) => {
                e.target.value = e.target.value.toUpperCase();
                if (e.target.value == '') {
                    e.target.value = '00'
                }
                if (e.target.value.length == 1) {
                    e.target.value = '0' + e.target.value
                }
                this.write(this.currentFrame * 256 + row_number * 16 + i, DEC(e.target.value), 'sync')
                // console.log(this.read(this.currentFrame * 256 + row_number * 16 + i));
            })
            row.append(cell);
        }
        this.memoryViewRoot.append(row);
    }
    updateRow(row_number, col_count, update_address) {
        const spCell = document.getElementById(`memory-cell-sp-cp-${row_number}`)
        let hexMem = HEX(update_address, 4)
        // console.log(hexMem);
        hexMem = hexMem.substr(0, 3)
        spCell.innerText = ('value', `${hexMem}`);
        for (let i = 0; i < col_count; i++) {
            const cell = document.getElementById(`memory-cell-${row_number}-${i}`);
            cell.value = HEX(this.memory_locations[update_address + i].get(), 2);
        }
    }
    setMemoryView() {
        this.memoryViewRoot.innerHTML = ''
        this.memoryViewRoot.classList.toggle('memory-view-class', true);
        for (let r = 0; r < 16; r++) {
            this.createRow(r, 16);
        }
    }
    showMemoryByLoc(loc) {

        const frame = Math.floor(loc / 256)
        if (!this.is_location_in_current_frame(loc)) {
            this.updateFrame(frame);
        }
    }
    updateFrame(frameNumber) {
        for (let r = 0; r < 16; r++) {
            // console.log(frame);
            // console.log(frame*256 + r*16);
            this.updateRow(r, 16, frameNumber * 256 + r * 16);
        }
        this.currentFrame = frameNumber
    }
    updateCurrentFrame(){
        this.updateFrame(this.currentFrame);
    }

}

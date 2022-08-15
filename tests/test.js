export class TestSuite {
    constructor(proc, ram, editor, assembler, toTest) {
        this.proc = proc;
        this.ram = ram;
        this.editor = editor;
        this.assembler = assembler;
        if (toTest) {
            this.runTests();
        }

    }
    runTests() {
        this.testRam();
        this.testEditor();
        this.testAssembler();
        this.testProc();
        this.testLocalStorage();
    }

    testLocalStorage(){
        localStorage.setItem("8085_test", 7);
        console.log("Test Storage:", 7 === parseInt(localStorage.getItem("8085_test")));
    }

    testProc() {
        const code = [0x3E, 0x00, 0x0E, 0x05, 0x81, 0x0D
            , 0xC2, 0x04, 0x00
            , 0x32, 0x70, 0x00
            , 0x76];
        let i = 0;
        this.proc.reset();
        code.forEach(bin => {
            this.ram.write(i++, bin);
        });
        let passed = false ;
        this.proc.executor(0, { reg_db: false, flag_db: false });
        if(this.ram.read(0x0070) === 0x0f){
            if(this.proc.registerConfig['A'].value === 0x0F){
                if(this.proc.registerConfig['C'].value === 0x00){
                    if(this.proc.registerConfig['PC'].value === 0x000C){
                        if(this.proc.flagConfig['S'].value === 0 &&
                        this.proc.flagConfig['Z'].value === 1 &&
                        this.proc.flagConfig['AC'].value === 1&&
                        this.proc.flagConfig['P'].value === 1 &&
                        this.proc.flagConfig['CY'].value === 0){
                            passed = true;
                        }
                    }
                }
            }
        }
        console.log("Test Proc:", passed);

    }
    testAssembler() {
        this.editor.setValue(`
            mov a, b;
            lable: adi 10h;
            hlt;
        `);
        const dbBins = this.assembler.assemble(0);
 
        console.log('Test Assembler', "[[],[120],[198,16],[118],[]]" === JSON.stringify(dbBins));
        this.editor.setValue('');
    }
    testRam() {

        this.ram.write(400, 78);
        console.log("Test Ram:", this.ram.read(400) === 78);
        this.ram.write(400, 0);
    }
    testEditor() {
        this.editor.setValue('testing text');
        console.log("Test Editor:", this.editor.getValue() === 'testing text');
        this.editor.setValue('');

    }
}


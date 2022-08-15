import { Memory } from "./Memory.js";
import { Processor } from "./Processor.js";
import { editor, setNextMarker, clearAllMarker } from "./editor.js"
import { Assembler } from "./assembler.js"
import { HEX } from "./util/util.js";
import { TestSuite } from "../tests/test.js";
const ram = new Memory(64 * 1e3, { start: 0, end: 6000 }, document.getElementById("memory-container"));
const processor = new Processor(ram);
const assembler = new Assembler(editor);
loadScriptFromLocalStorage();
const LOAD_LOCATION = 0x0000;
const run_btn = document.getElementById("run-btn");
const start_db_btn = document.getElementById("start-db-btn");
const execute_next_btn = document.getElementById("execute-next-btn");
const help_btn = document.getElementById("help-btn");
// const move_prev_btn = document.getElementById("move-prev-btn");
const opcode_container = document.getElementById("opcode-container-box");
const help_container = document.getElementById("help-container");

help_container.addEventListener("click", (e) => {
  if(e.target.id === "close-help"){
    help_container.classList.toggle("hidden", true);
  }
})

help_btn.addEventListener("click", () => {
  help_container.classList.toggle("hidden");
})

document.getElementById("gh-btn").addEventListener("click", () => {
  window.open("https://github.com/ayushk7/simsim85");
})



document.getElementById("assemble-btn").addEventListener("click", () => {
  const assembled = assembler.assemble(LOAD_LOCATION);
  setOpcodeBox(assembled);
  window.scrollTo({
    top: 1000
  })
})


opcode_container.addEventListener("click", (e) => {
  if(e.target.id === "close-opcode"){
    opcode_container.classList.toggle("hidden", true);
  }
})

let isDebugging = false;
let debugBinaries = null;
let curr_line = 0;
execute_next_btn.addEventListener("click", () => {
  executeNext();
  while (isDebugging && curr_line < debugBinaries.length && debugBinaries[curr_line].length === 0) {
    curr_line++;
    continue;
  }
  if(curr_line < debugBinaries.length)
    setNextMarker(curr_line);
});
execute_next_btn.disabled = true;
// move_prev_btn.disabled = true;
// editor.setOption();

function stopDebugging() {
  start_db_btn.innerText = "Start Debugging";
  execute_next_btn.disabled = true;
  // move_prev_btn.disabled = true;
  run_btn.disabled = false;
  debugBinaries = null;
  processor.offJump();
  isDebugging = false;
  editor.setOption("readOnly", false);
  console.log('stopped');
  clearAllMarker();
}

function startDebugging() {
  isDebugging = true;
  curr_line = 0;
  start_db_btn.innerText = "Stop Debugging";
  execute_next_btn.disabled = false;
  // move_prev_btn.disabled = false;
  run_btn.disabled = true;
  editor.setOption("readOnly", true);
  while (curr_line < debugBinaries.length && debugBinaries[curr_line].length === 0) {
    curr_line++;
    continue;
  }
  setNextMarker(curr_line);

}

function executeNext() {
  console.log("exec");
  while (curr_line < debugBinaries.length) {
    if (debugBinaries[curr_line].length === 0) {
      curr_line++;
      continue;
    }
    const ret = processor.execute();
    curr_line++;
    processor.updateDebugView();
    if (ret === "STOP") {
      stopDebugging();
      return;
    }
    break;
  }
  if (curr_line === debugBinaries.length) {
    console.error('yo');
    stopDebugging();
    return;
  }
}

start_db_btn.addEventListener("click", () => {
  isDebugging = !isDebugging;
  if (isDebugging) {
    debugBinaries = assembler.assemble(LOAD_LOCATION);
    startDebugging();
    load(debugBinaries, LOAD_LOCATION);
    processor.setPCNoJump(LOAD_LOCATION);
    const pcOnLine = pcToLine(debugBinaries, LOAD_LOCATION);
    processor.onJump((from, to) => {
      curr_line = pcOnLine.get(to) - 1;
    });
  }
  else {
    // execute_next_btn.removeEventListener("click", executeNext);
    stopDebugging();
  }
});








run_btn.addEventListener("click", () => {
  saveScript();
  const assembled = assembler.assemble(LOAD_LOCATION);
  console.log(assembled);
  setOpcodeBox(assembled);
  // assembled.forEach(item => console.log(item));
  load(assembled, LOAD_LOCATION);
  processor.executor(LOAD_LOCATION, { reg_db: true, flag_db: true });
});








function getLinesFromEditor() {
  const lc = editor.lineCount();
  let data = []
  for (let i = 0; i < lc; i++) {
    data.push(editor.getLine(i));
  }
  return data;
}
function saveScript() {
  const data = getLinesFromEditor();
  const str = JSON.stringify({ "script": data });
  localStorage.setItem('8085-sim-sim-script', str);
}
function loadScriptFromLocalStorage() {
  let data = localStorage.getItem('8085-sim-sim-script');
  if (data) {
    data = JSON.parse(localStorage.getItem('8085-sim-sim-script'));
    if (data.script) {
      data = data.script;
      data = data.join('\n');
      editor.setValue(data);
    }
  }
}

function load(assembled, start_address) {
  if (assembled.length + start_address >= 0xffff) {
    console.error("The location of code goes beyond the available memory");
  }
  let i = 0;
  assembled.forEach((bins, lineNumber) => {
    bins.forEach(bin => {
      ram.write(start_address + i++, bin);
    });
  });
  processor.memory.updateCurrentFrame();
}

function pcToLine(lineToInst, start_address) {
  let ans = new Map();
  let i = 0;
  lineToInst.forEach((bins, lineNumber) => {
    bins.forEach((bin, id) => {
      ans.set(start_address + i++, lineNumber);
    });
  });
  return ans;

}

function setOpcodeBox(assembled){
  const line_srings = [];
  assembled.forEach((bins, lineNumber) => {
    const tmp = [];
    bins.forEach(bin => {
      tmp.push(HEX(bin, 2));
    })
    line_srings.push(tmp.join(" "));
  })

  const text = line_srings.join("\n");
  opcode_container.children[1].innerText = text;
  opcode_container.classList.toggle("hidden", false);
}

// for(let i=0; i<code.length; i++){
//     const address = (parseInt(start_address, 16) + i).toString(16);
//     console.log(ram.read(address));
// }
// processor.executor(code[0].start_address, {reg_db: true, flag_db: true});


// new TestSuite(processor, ram, editor, assembler, true);

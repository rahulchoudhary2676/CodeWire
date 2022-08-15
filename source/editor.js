export const editor = CodeMirror(document.getElementById("editor-container"), {
    value: "//the program is loaded at 0000h\n",
    mode: "assembly8085",
    lineNumbers: true,
    // indentWithTabs: true,
    indentUnit: 4,
    gutter: ["CodeMirror-linenumbers", "breakpoints"]
});
// editor.on("gutterClick", function (cm, n) {
//     var info = cm.lineInfo(n);
//     console.log(info);
//     cm.clearGutter("breakpoints");
// });
export function setNextMarker(lineNumber){
    editor.doc.clearGutter("breakpoints");
    editor.doc.setGutterMarker(lineNumber, "breakpoints", makeMarker());
}
export function clearAllMarker(){
    editor.doc.clearGutter("breakpoints");
}

function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "red";
    marker.innerHTML = "●";
    return marker;
}
editor.setSize("100%", 800)

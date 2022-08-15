// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
(function () {
   function id(x) { return x[0]; }
    function nullify(d) { return null } var grammar = {
       Lexer: undefined,
       ParserRules: [
       {"name": "line$ebnf$1", "symbols": ["lbl"], "postprocess": id},
       {"name": "line$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
       {"name": "line$ebnf$2", "symbols": ["instruction"], "postprocess": id},
       {"name": "line$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
       {"name": "line$ebnf$3", "symbols": ["comment"], "postprocess": id},
       {"name": "line$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
       {"name": "line", "symbols": ["line$ebnf$1", "_", "line$ebnf$2", "_", "line$ebnf$3"], "postprocess": function(d, l) {return {label: d[0], inst: d[2]}}},
       {"name": "lbl", "symbols": ["word", "_", {"literal":":","pos":34}], "postprocess": function(d, l) {return {labelName: d[0], location: l}}},
       {"name": "instruction", "symbols": ["opcode", "_", {"literal":";","pos":46}], "postprocess": function(d) { return {opcode: d[0], arg1: null, arg2: null} }},
       {"name": "instruction", "symbols": ["opcode", "__", "arg", "_", {"literal":";","pos":60}], "postprocess": function(d) { return {opcode: d[0], arg1: d[2], arg2: null} }},
       {"name": "instruction", "symbols": ["opcode", "__", "arg", "_", {"literal":",","pos":74}, "_", "arg", "_", {"literal":";","pos":82}], "postprocess": function(d) { return {opcode: d[0], arg1: d[2], arg2: d[6]} }},
       {"name": "comment$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "comment", "symbols": ["comment$string$1", "LineEnd"]},
       {"name": "opcode", "symbols": [/[A-Za-z]/], "postprocess": id},
       {"name": "opcode", "symbols": ["opcode", /[A-Za-z]/], "postprocess": function(d) { return "" + d[0] + d[1] }},
       {"name": "arg", "symbols": ["register"], "postprocess": function(d) {return {'type': 'reg', 'value': d[0]}}},
       {"name": "arg", "symbols": ["hex"], "postprocess": function(d) {return {'type': 'hex', 'value': d[0]}}},
       {"name": "arg", "symbols": ["label"], "postprocess": function(d) {return {'type': 'label', 'value': d[0]}}},
       {"name": "register", "symbols": [/[aAbBcCdDeEhHlLmM]/], "postprocess": id},
       {"name": "register$string$1", "symbols": [{"literal":"s"}, {"literal":"p"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$1"], "postprocess": id},
       {"name": "register$string$2", "symbols": [{"literal":"S"}, {"literal":"P"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$2"], "postprocess": id},
       {"name": "register$string$3", "symbols": [{"literal":"p"}, {"literal":"c"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$3"], "postprocess": id},
       {"name": "register$string$4", "symbols": [{"literal":"P"}, {"literal":"C"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$4"], "postprocess": id},
       {"name": "register$string$5", "symbols": [{"literal":"p"}, {"literal":"s"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$5"], "postprocess": id},
       {"name": "register$string$6", "symbols": [{"literal":"P"}, {"literal":"S"}, {"literal":"W"}], "postprocess": function joiner(d) {return d.join('');}},
       {"name": "register", "symbols": ["register$string$6"], "postprocess": id},
       {"name": "hex", "symbols": [/[0-9a-fA-F]/, /[hH]/], "postprocess": function(d) { return "" + d[0] + d[1] }},
       {"name": "hex", "symbols": [/[0-9a-fA-F]/, "hex"], "postprocess": function(d) { return "" + d[0] + d[1] }},
       {"name": "label", "symbols": [{"literal":"#","pos":195}, "word"], "postprocess": function(d) { return "" + d[1] }},
       {"name": "word", "symbols": [/[A-Za-z]/], "postprocess": id},
       {"name": "word", "symbols": ["word", /[A-Za-z0-9]/], "postprocess": function(d) { return "" + d[0] + d[1] }},
       {"name": "_", "symbols": [], "postprocess": nullify},
       {"name": "_", "symbols": [/[ \t]/, "_"], "postprocess": nullify},
       {"name": "__", "symbols": [/[ \t]/, "_"]},
       {"name": "LineEnd", "symbols": [], "postprocess": nullify},
       {"name": "LineEnd", "symbols": [/[^\n]/, "LineEnd"], "postprocess": nullify}
   ]
     , ParserStart: "line"
   }
   if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
      module.exports = grammar;
   } else {
      window.grammar = grammar;
   }
   })();

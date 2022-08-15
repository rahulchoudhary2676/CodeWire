@{% function nullify(d) { return null } %}
#prog -> _ prog line {% function(d) { return d[0].concat([d[1]]) }%}
#        | null {% nullify %}

line -> lbl:? _ instruction:? _ comment:? {% function(d, l) {return {label: d[0], inst: d[2]}} %}

lbl -> word _ ":" {% function(d, l) {return {labelName: d[0], location: l}} %}

instruction -> opcode _ ";" {% function(d) { return {opcode: d[0], arg1: null, arg2: null} } %}
				| opcode __ arg _ ";" {% function(d) { return {opcode: d[0], arg1: d[2], arg2: null} } %}
				| opcode __ arg _ "," _ arg _ ";" {% function(d) { return {opcode: d[0], arg1: d[2], arg2: d[6]} } %}

comment -> "//" LineEnd



opcode -> [A-Za-z] {% id %}
        | opcode [A-Za-z] {% function(d) { return "" + d[0] + d[1] } %}

arg -> register {%function(d) {return {'type': 'reg', 'value': d[0]}}%} 
	| hex {%function(d) {return {'type': 'hex', 'value': d[0]}}%}
	| label {%function(d) {return {'type': 'label', 'value': d[0]}}%}

register -> [aAbBcCdDeEhHlLmM] {%id%}
			| "sp" {%id%}
			| "SP" {%id%}
			| "pc" {%id%}
			| "PC" {%id%}
			| "psw" {%id%}
			| "PSW" {%id%}
			
hex -> [0-9a-fA-F] [hH] {%function(d) { return "" + d[0] + d[1] }%}
		|[0-9a-fA-F] hex {% function(d) { return "" + d[0] + d[1] } %}

label -> "#" word {% function(d) { return "" + d[1] } %}

word -> [A-Za-z] {% id %}
        | word [A-Za-z0-9] {% function(d) { return "" + d[0] + d[1] } %}

_ -> null {% nullify %}
    | [ \t] _ {% nullify %}
__ -> [ \t] _

LineEnd -> null {% nullify %}
        | [^\n] LineEnd {% nullify %}

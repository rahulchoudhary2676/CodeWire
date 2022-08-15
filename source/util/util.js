function HEX(val_dec, format) {
    let tmp = val_dec.toString(16);
    // console.log(tmp);
    if(format < tmp.length){
        throw `${val_dec} can't be represented in ${format} digits`
    }
    else{
        let more = format - tmp.length
        while(more--){
            tmp = '0' + tmp
        }
    }
    return tmp.toUpperCase();
}
function DEC(val_hex) {
    return parseInt(val_hex, 16);
}
function TwoComp8Bit(val){
    return (((val&0xFF)^0xFF)+1)&0xFF;
}
// console.log(TwoComp(2));

function HexToBin(val_hex){
    let ans = 0;
    val_hex = HEX(DEC(val_hex));
    ans = DEC(val_hex[0]);
    ans = ans << 4;
    ans = ans | DEC(val_hex[1]);
    return ans;
}
function IsHexChar(char){
    return (char >= '0' && char <= '9') || (char >= 'a' && char <= 'f') || (char >= 'A' && char <= 'F')
}

// let tt = "ayush";

export {HEX, DEC, TwoComp8Bit, HexToBin, IsHexChar}

const crypto   = require('crypto');
exports.MD5=function(data){
    const hash = crypto.createHash("MD5")
    hash.update(data);
    const arr = hash.digest("decimal");
    let MD5 = 0;
    arr.forEach((value,index)=>{MD5 +=value});
    return MD5;
};

import * as CryptoJS from 'crypto-js';
let secret = 'dskngiuewnvlkdnvioenvlkniowe';
let options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };  

let decrypt = CryptoJS.AES.decrypt("U2FsdGVkX187snBEW6jsgSS4M/zgjPFTvBbjCTT7U8fNqxnZPdQOc4UcCnUCqi/u+2bH2Zd60Km23hcyZhgjO5D543Um6J90aX7I5HS89ZolKD44okTxW5xUorc9pEYwkqPUkVa5SDj3TsVw2QHb52v7YXxVN70qN85A6fTc55BoxYW2dcJbAZZ8HlW8CXQjlDrtYiM3HS34DtHwwLoyfiSpgm0tX6JHyWG9a7eGobGWuF9H5rwBd/yBf0KttzyzgHGuDsrPvWVI0nk6SIv2ng==", secret, options);
console.log(decrypt)  
let data = decrypt.toString(CryptoJS.enc.Utf8);  
console.log("decrypt", data);
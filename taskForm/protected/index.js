async function fetchTemplate(path,cb){
    let res = await fetch(path)
    let html = await res.text()
    cb(html)
}

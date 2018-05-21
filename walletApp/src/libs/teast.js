function validateAccount(ethAddress) {
  let falg = false
  if (ethAddress.length === 42) {
    let address = ethAddress.split('0x')[1]
    let addArr = address.split('')
    for(var i = 0; i++; i< 40){
      let item = addArr[i]
      console.log(item)
      if (/^[0123456789a-fA-F]+$/.test(item)) {
        falg = /^[0123456789a-fA-F]+$/.test(item) || falg
      } else {
        falg = false
        break
      }
    }
    return falg
  } else {
    return falg
  }
}
console.log(validateAccount('0xad0945e4Ecdf9B300a882C8F18972e965f7d005C'))


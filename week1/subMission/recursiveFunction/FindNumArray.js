//숫자타입으로만 구성된 요소를 뽑아 배열만들기
const o = require('./o.js')

class FindNumArray {
  constructor() {
    this.arr = [];
  }
  filteringNumberTypeToArr(obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        this.filteringNumberTypeToArr(obj[key]);
      } else {
        if (typeof obj[key] === 'number') {
          this.arr.push(key);
        }
      }
    });
    return this.arr;
  }
}

const findNumArray = new FindNumArray();
console.log(findNumArray.filteringNumberTypeToArr(o));
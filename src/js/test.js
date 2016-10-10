// document.write('test js aaqqq'); bazinga document已经加载解析完毕,文档流已经结束,因此异步加载的js不能操作document,可以操作dom
document.getElementsByClassName('img2')[0].style.color = 'red';
console.log('aaa');
var imgUrl = require('../img/yellowKill.jpg');
var imgTemp1 = '<img src = "'+imgUrl+'" />';
document.getElementsByClassName('img3')[0].innerHTML = imgTemp1;


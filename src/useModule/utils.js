//节流函数
export function throttlen(func, delay) {
    let timer = null;
    return function () {
       let context = this;
       let args = arguments;
       if (!timer) {
          timer = setTimeout(function () {
             func.apply(context, args);
             timer = null;
          }, delay);
       }
    }
 }

 //防抖函数
 export function debounce(fun, delay = 500) {
    let timer = null;
    return function (...rest) {
       if (timer)
          //每次进入 调用这个函数都会清除上一次 注册的定时器
          clearTimeout(timer);
       timer = setTimeout(() => {
          fun.apply(this, rest); // 延时调用
       }, delay);
    };
 }
 
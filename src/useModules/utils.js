//节流函数
export function throttlen(func, delay) {
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    };
}

//防抖函数
export function debounce(fun, delay = 500) {
    let timer = null;
    return function(...rest) {
        if (timer)
            //每次进入 调用这个函数都会清除上一次 注册的定时器
            clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(this, rest); // 延时调用
        }, delay);
    };
}

//计算日期 所在月份有多少天
export function getMonthLength(datePrams) {
    let date = new Date(datePrams);
    // 将日期设置为下月一号
    date.setDate('1');
    date.setMonth(date.getMonth() + 1);

    // 获取本月最后一天
    date.setDate(date.getDate() - 1);
    return date.getDate();
}

//传入 检查点 坐标 计算 几何中心
export function computeCenter(checkpoints) {
    let l = checkpoints[0].positionX; //最小的 经度
    let t = checkpoints[0].positionY; //最大 经度
    let r = l;
    let b = t;
    checkpoints.forEach(({ positionX, positionY }) => {
        positionX < l && (l = positionX);
        positionX > r && (r = positionX);
        positionY > t && (t = positionY);
        positionY < b && (b = positionY);
    });
    return [(l + r) / 2, (t + b) / 2];
}
//时间 格式化
export function formatDate(str, fmt) {
    function padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
    const date = str instanceof Date ? str : new Date(str);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        'M+': date.getMonth() + 1,
        'date+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }
    return fmt;
}

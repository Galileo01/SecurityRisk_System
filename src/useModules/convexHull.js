//凸包 计算 外轮廓
//判断第三个点在直线的左方还是右方
function multi(p1, p2, p3) {
  return (
    p1.x * p2.y +
    p3.x * p1.y +
    p2.x * p3.y -
    p3.x * p2.y -
    p2.x * p1.y -
    p1.x * p3.y
  );
}

//求p3到p1p2直线的距离
function dist(p1, p2, p3) {
  return (
    Math.abs(
      (p2.y - p1.y) * p3.x +
      (p1.x - p2.x) * p3.y +
      (p1.y - p2.y) * p1.x +
      (p2.x - p1.x) * p1.y
    ) / Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p1.x - p2.x, 2))
  );
}

//按x升序重载排序规则，如果x相同按照y升序
function cmp(a, b) {
  if (a.x - b.x === 0) {
    if (a.y > b.y) {
      return 1;
    } else {
      return -1;
    }
  }
  return -1;
}

//按照横坐标升序排序之后，下标为0的点和下标为n-1的点连线将凸包分成上下两个凸包
function convex_hull(n, p, s) {
  p.sort((a, b) => cmp(a, b));
  dhull(0, n - 1, p, s);
  uhull(0, n - 1, p, s);
}

//求解下凸包，分界线为下标为x的点指向下标为y的点
function dhull(x, y, p, s) {
  let j = -1;
  let dis = -1;
  let l = x;
  let r = y;
  if (l > r) {
    l = y;
    r = x;
  }
  for (let i = l + 1; i < r; i++) {
    if (multi(p[x], p[y], p[i]) <= 0) {
      if (dist(p[x], p[y], p[i]) > dis) {
        dis = dist(p[x], p[y], p[i]);
        j = i;
      }
    }
  }

  //未找到最远点那么这两个点是在凸包上直接相连的两个点
  if (j === -1) {
    s.push(p[x]);
    return;
  }

  let uh = x;
  let dh = y;

  if (multi(p[x], p[j], p[y]) >= 0) {
    uh = y;
    dh = x;
  }
  dhull(dh, j, p, s);
  uhull(uh, j, p, s);
}

//求解上凸包
function uhull(x, y, p, s) {
  let j = -1;
  let dis = -1;
  let l = x;
  let r = y;
  if (l > r) {
    l = y;
    r = x;
  }
  for (let i = l + 1; i < r; i++) {
    if (multi(p[x], p[y], p[i]) >= 0) {
      if (dist(p[x], p[y], p[i]) > dis) {
        dis = dist(p[x], p[y], p[i]);
        j = i;
      }
    }
  }

  //未找到最远点那么这两个点是在凸包上直接相连的两个点
  if (j === -1) {
    s.push(p[y]);
    return;
  }

  let uh = x;
  let dh = y;

  if (multi(p[x], p[j], p[y]) > 0) {
    uh = y;
    dh = x;
  }
  dhull(dh, j, p, s);
  uhull(uh, j, p, s);
}

//checkpoints 转换为 node 属性
function transform(checkpoints) {
  return checkpoints.map(points => {
    return {
      x: points.positionX,
      y: points.positionY
    }
  })
}
//凸包问题 根据企业 检查点 计算 企业外轮廓
export default function convexHull(checkpoints) {
  const AMap = window.AMap;
  const p = transform(checkpoints);
  const s = [];
  convex_hull(p.length, p, s);
  // console.log(s);
  return s.map(points => new AMap.LngLat(points.x, points.y));
}
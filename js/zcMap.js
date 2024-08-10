(function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const typeList = [
    "com",
    "fortress",
    "copper",
    "silver",
    "gold",
    "baseCamp",
    "core",
  ];

  const lineList = [];
  let clubInfoList = [
    { name: "俱乐部1", rel: "1" },
    { name: "俱乐部2", rel: "1" },
    { name: "俱乐部3", rel: "0" },
    { name: "俱乐部4", rel: "1" },
    { name: "俱乐部5", rel: "0" },
    { name: "俱乐部6", rel: "0" },
    { name: "俱乐部7", rel: "1" },
    { name: "俱乐部8", rel: "0" },
    { name: "俱乐部9", rel: "0" },
    { name: "俱乐部10", rel: "0" },
    { name: "俱乐部11", rel: "0" },
    { name: "俱乐部12", rel: "0" },
    { name: "俱乐部13", rel: "1" },
    { name: "俱乐部14", rel: "1" },
    { name: "俱乐部15", rel: "0" },
    { name: "俱乐部16", rel: "0" },
    { name: "俱乐部17", rel: "0" },
    { name: "俱乐部18", rel: "1" },
    { name: "俱乐部19", rel: "0" },
    { name: "俱乐部20", rel: "1" },
  ];
  let actineLineIndex = 0;

  // 拖拽
  let dragging = false;
  // 鼠标按下的点
  let cachePageX = 0;
  let cachePageY = 0;
  // 偏移值
  let offsetPageX = 0;
  let offsetPageY = 0;

  let scaleFactor = 1.0; // 初始缩放比例

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 将变换原点移动到中心点
  ctx.translate(centerX, centerY);

  let shapes = {};
  // let rank = 63;

  // 正六边形的边长
  const sideLength = 25;

  // 边数
  const numSides = 6;

  // 绘制六边形的函数
  function drawHexagon(ctx, vertexList, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    //   for (let i = 0; i < numSides; i++) {
    //     const x = centerX + sideLength * Math.cos((i * 2 * Math.PI) / numSides);
    //     const y = centerY + sideLength * Math.sin((i * 2 * Math.PI) / numSides);
    //     ctx.lineTo(x, y);
    //   }
    vertexList.map((itm) => {
      ctx.lineTo(
        itm.x / scaleFactor + offsetPageX,
        itm.y / scaleFactor + offsetPageY
      );
    });
    ctx.closePath();
    ctx.fill();
  }

  // 绘制直线
  function drawLine(ctx, vertexList, color) {
    if (vertexList.length === 1) {
      ctx.fillStyle = color;
      ctx.fillRect(
        vertexList[0].x / scaleFactor + offsetPageX,
        vertexList[0].y / scaleFactor + offsetPageY,
        5,
        5
      );
    } else {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;
      vertexList.map((itm) => {
        ctx.lineTo(
          itm.x / scaleFactor + offsetPageX,
          itm.y / scaleFactor + offsetPageY
        );
      });
      ctx.stroke();
    }
  }

  const typeColor = {
    core: "#c45655",
    baseCamp: "#593737",
    gold: "#f0d52d",
    silver: "#c0bdc1",
    copper: "#4d400f",
  };

  // 绘制
  function draw() {
    cleanDraw();
    // 设置缩放
    // ctx.save();
    // ctx.scale(scaleFactor, scaleFactor);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    typeList.map((type) => {
      const list = shapes[type];
      list.map((shape) => {
        if (
          shape.type &&
          shape.type === "baseCamp" &&
          clubInfoList[shape.rank - 1]
        ) {
          const clubInfo = clubInfoList[shape.rank - 1];

          if (clubInfo.rel === "0") {
            shape.color = "#00ff00";
          } else if (clubInfo.rel === "1") {
            shape.color = "#ff0000";
          } else if (clubInfo.rel === "2") {
            shape.color = "#ff8888";
          } else if (clubInfo.rel === "this") {
            shape.color = "#87ceeb";
          }
          drawHexagon(ctx, shape.vertexList, shape.color);

          const txt = clubInfo.name || shape.name;
          ctx.fillStyle = "#000";
          ctx.font = "normal 12px bold serif";
          ctx.fillText(
            txt,
            (shape.x - 20) / scaleFactor + offsetPageX,
            (shape.y + 6) / scaleFactor + offsetPageY
          );
        } else {
          drawHexagon(ctx, shape.vertexList, shape.color);
        }
      });
    });
    lineList.map((line) => {
      drawLine(ctx, line.list, line.color);
    });

    // ctx.restore(); // 恢复缩放状态
  }

  function generateRandomBrightColor() {
    const randomChannel = () => Math.floor(Math.random() * 256); // 生成0-255之间的随机整数
    return `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`;
  }

  function cleanDraw() {
    ctx.clearRect(
      -(canvas.width / 2),
      -(canvas.height / 2),
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "#f2f2f2";
    // 使用fillRect方法填充整个Canvas
    ctx.fillRect(
      -(canvas.width / 2),
      -(canvas.height / 2),
      canvas.width,
      canvas.height
    );
  }

  // 检查鼠标点击是否在形状内
  function isPointInShape(x2, y2, x3, y3, x4, y4, x5, y5, x_p, y_p) {
    const x_o = (x2 + x5) / 2;
    const y_o = (y2 + y5) / 2;
    const A = ((x4 - x_o) ** 2 + (y4 - y_o) ** 2) ** 0.5;
    const A1 = (3 ** 0.5 / 2) * A;
    const T_module = ((x3 - x5) ** 2 + (y3 - y5) ** 2) ** 0.5;
    //T 即为单位向量 t_53
    const T = [(x3 - x5) / T_module, (y3 - y5) / T_module];
    const t_op = [x_p - x_o, y_p - y_o];
    x = Math.abs(t_op[0] * T[0] + t_op[1] * T[1]);
    y = Math.abs(t_op[0] * T[1] - t_op[1] * T[0]);
    if (y > A || x > A1) {
      return false;
    }
    if (A < (3 ** 0.5 / 3) * x + y) {
      return false;
    }
    return true;
  }

  // 鼠标点击事件处理
  function handleMouseClick(event) {
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const target = {
      x: (point.x - centerX - offsetPageX) * scaleFactor,
      y: (point.y - centerY - offsetPageY) * scaleFactor,
    };
    if (lineList.length === 0 || !lineList[actineLineIndex]) {
      lineList.push({
        list: [],
        color: generateRandomBrightColor(),
      });
    }

    lineList[actineLineIndex].list.push(target);

    // 检查是否有形状与点击点相交
    // typeList.map((type) => {
    //   const list = shapes[type];
    //   list.map((shape) => {
    //     const { x2, y2, x3, y3, x4, y4, x5, y5 } = shape.vertexCoordinates;
    //     if (
    //       isPointInShape(
    //         x2,
    //         y2,
    //         x3,
    //         y3,
    //         x4,
    //         y4,
    //         x5,
    //         y5,
    //         point.x,
    //         point.y
    //       )
    //     ) {
    //       lineList.push(shape);
    //       // baseCamp
    //       // gold
    //       // silver
    //       // copper
    //       // shape.name = "核心";
    //       // shape.type = "core";
    //       // shape.rank = rank;
    //       // console.log(shapes[i]);
    //       // shape.color = shape.color == "#c45655" ? "transparent" : "#c45655";
    //       // rank++;
    //     }
    //   });
    // });

    draw(); // 重绘
  }

  //  获得距离
  function getDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // for (let i = 1; i <= 60; i++) {
  //   for (let j = 1; j <= 60; j++) {
  //     const centerX = i * sideLength * 1.6;
  //     let centerY = j * sideLength * 1.8;
  //     const vertexCoordinates = {};
  //     const vertexList = [];
  //     if (i % 2 == 0) {
  //       centerY += 22;
  //     }
  //     for (let i = 0; i < numSides; i++) {
  //       const x = centerX + sideLength * Math.cos((i * 2 * Math.PI) / numSides);
  //       const y = centerY + sideLength * Math.sin((i * 2 * Math.PI) / numSides);
  //       const _x = parseFloat(Number(x).toFixed(4))
  //       const _y = parseFloat(Number(y).toFixed(4))
  //       vertexCoordinates[`x${i + 1}`] = _x;
  //       vertexCoordinates[`y${i + 1}`] = _y;
  //       vertexList.push({
  //         x:_x,
  //         y:_y,
  //       });
  //     }
  //     shapes.push({
  //       x: centerX,
  //       y: centerY,
  //       color: "#F2F2F2",
  //       vertexCoordinates,
  //       vertexList,
  //       //   color: "#333",
  //     });
  //   }
  // }

  function setClubInfo() {
    const clubInfo = document.getElementById("clubInfo");
    const nameList = clubInfo.querySelectorAll(".name");
    const relList = clubInfo.querySelectorAll(".rel");
    const resList = [];

    for (let index = 0; index < 20; index++) {
      resList.push({
        name: nameList[index].value,
        rel: relList[index].value,
      });
    }
    clubInfoList = resList;
    localStorage.setItem("ClubInfo", JSON.stringify(resList));
    draw();
  }

  function getLocalClubInfo() {
    const localClubInfo = localStorage.getItem("ClubInfo");
    if (localClubInfo) {
      clubInfoList = JSON.parse(localClubInfo);
      const clubInfo = document.getElementById("clubInfo");
      const nameList = clubInfo.querySelectorAll(".name");
      const relList = clubInfo.querySelectorAll(".rel");
      clubInfoList.map((itm, index) => {
        nameList[index].value = itm.name;
        relList[index].value = itm.rel;
      });
    }
  }

  function getMapInfoDraw() {
    fetch("./js/mapInfo.json")
      .then((res) => {
        if (res.status === 200) {
          //json是返回的response提供的一个方法,会把返回的json字符串反序列化成对象,也被包装成一个Promise了
          return res.json();
        } else {
          alert("请求地图数据失败");
        }
      })
      .then((data) => {
        shapes = data;
        draw();
      });
  }

  function init() {
    getLocalClubInfo();
    getMapInfoDraw();

    // 添加事件监听器
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousewheel", onWheel, { passive: false }); // 兼容不同浏览器

    document
      .getElementById("setClubInfoBtn")
      .addEventListener("click", setClubInfo);
    document.getElementById("addLineBtn").addEventListener("click", addLine);

    canvas.addEventListener(
      "mousedown",
      (e) => {
        const mousedownPageX = e.pageX;
        const mousedownPageY = e.pageY;
        dragging = true;
        cachePageX = e.pageX;
        cachePageY = e.pageY;
        function mouseup(e) {
          dragging = false;
          if (
            Math.abs(mousedownPageX - e.pageX) <= 10 ||
            Math.abs(mousedownPageY - e.pageY) <= 10
          ) {
            handleMouseClick(e);
          }
          window.removeEventListener("mouseup", mouseup);
          window.removeEventListener("mousemove", mousemove);
          // draw();
        }

        function mousemove(e) {
          if (dragging) {
            offsetPageX += e.pageX - cachePageX;
            offsetPageY += e.pageY - cachePageY;
            cachePageX = e.pageX;
            cachePageY = e.pageY;
            draw();
          }
        }

        window.addEventListener("mouseup", mouseup, false);
        canvas.addEventListener("mousemove", mousemove, false);
      },
      false
    );

    // 监听鼠标点击
    // canvas.onclick = handleMouseClick;
    // canvas.addEventListener("click", handleMouseClick);

    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "z") {
        if (!lineList[actineLineIndex]) return;

        lineList[actineLineIndex].list.pop();

        draw();
      }
    });
  }

  function onWheel(event) {
    event.preventDefault(); // 防止默认的滚轮行为
    const delta = event.wheelDelta ? event.wheelDelta : -event.detail; // 兼容不同浏览器的滚动值

    // 根据滚轮滚动值来调整缩放比例
    if (delta > 0) {
      scaleFactor /= 1.1; // 放大
    } else {
      scaleFactor *= 1.1; // 缩小
    }
    draw();
  }

  function addLine() {
    actineLineIndex += 1;
  }

  init();
})();

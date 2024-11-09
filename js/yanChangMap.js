class yanChangMap {
  // 定义画布
  canvas;
  // 定义画布上下文环境
  ctx;
  // 渲染点类型数组
  typeList = [
    "com",
    "fortress",
    "copper",
    "silver",
    "gold",
    "baseCamp",
    "core",
  ];

  // 初始化社团信息列表
  clubInfoList = [
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
  // 当前绘制线数组下标
  actineLineIndex = 0;
  // 绘制线数组，包含点列表和颜色
  lineList = [];
  // 偏移值
  offsetPageX = 0;
  offsetPageY = 0;
  // 初始缩放比例
  scaleFactor = 1.0;
  // 中心点坐标
  centerX;
  centerY;
  // 各种形状的集合
  shapes = {
    // 大本营
    baseCamp: [],
    // 金点
    gold: [],
    // 银点
    silver: [],
    // 铜点
    copper: [],
    // 核心
    core: [],
    // 路径点
    com: [],
    // 堡垒点 1分
    fortress: [],
  };
  // 正六边形的边长
  sideLength = 25;
  // 边数
  numSides = 6;
  // 绘制线条函数（未初始化）
  drawLine = () => console.log("set drawLine ");
  // 素材图片
  materialImg = null;

  // 素材类型文档对象，包含素材各种属性
  materiaTypeDoc = {
    com: undefined,
    fortress: {
      width: 152,
      height: 174,
      positionX: 1350,
      positionY: 1490,
      offsetX: 20,
      offsetY: 30,
    },
    copper: {
      width: 144,
      height: 130,
      positionX: 1658,
      positionY: 1538,
      offsetX: 20,
      offsetY: 18,
    },
    silver: {
      width: 153,
      height: 140,
      positionX: 1504,
      positionY: 1452,
      offsetX: 20,
      offsetY: 23,
    },
    gold: {
      width: 153,
      height: 153,
      positionX: 1040,
      positionY: 1376,
      offsetX: 20,
      offsetY: 25,
    },
    baseCamp: {
      width: 160,
      height: 190,
      positionX: 1040,
      positionY: 1180,
      offsetX: 20,
      offsetY: 30,
    },
    core: {
      width: 389,
      height: 389,
      positionX: 1580,
      positionY: 0,
      offsetX: 20,
      offsetY: 40,
    },
  };

  constructor(canvas, lineType = "Line", materialImg = null) {
    // 初始化，设置画布等属性
    this.setCanvas(canvas);
    this.ctx = this.getCanvas().getContext("2d");
    this.setLineType(lineType);
    this.init();
    // 初始化线段
    this.actineLineIndex = 0;
    this.lineList = [
      {
        list: [],
        color: this.generateRandomBrightColorByHex(),
      },
    ];
    this.materialImg = materialImg;
  }

  // 初始化函数
  init() {
    // 设置画布宽度高度与视窗大小一致，移动画布原点到中心
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.ctx.translate(this.centerX, this.centerY);
  }

  // 获取线条类型
  getLineType() {
    return this.lineType;
  }

  // 设置线条类型，并更新绘制线条的函数
  setLineType(lineType) {
    this.lineType = lineType;
    if (lineType === "Line") {
      this.drawLine = this.drawLineFn;
    } else if (lineType === "Arrow") {
      this.drawLine = this.drawArrowListFn;
    }
  }

  // 设置画布
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  // 获取画布
  getCanvas() {
    return this.canvas;
  }

  // 设置形状集合
  setShapes(shapes) {
    this.shapes = shapes;
  }
  // 获取形状集合
  getShapes() {
    return this.shapes;
  }

  // 设置社团信息列表
  setClubInfoList(clubInfoList) {
    this.clubInfoList = clubInfoList;
  }
  // 获取社团信息列表
  getClubInfoList() {
    return this.clubInfoList;
  }

  // 设置当前绘制线数组下标
  setActineLineIndex(index) {
    this.actineLineIndex = index;
  }

  // 获取当前绘制线数组下标
  getActineLineIndex() {
    return this.actineLineIndex;
  }

  // 设置缩放比例
  setScaleFactor(scaleFactor) {
    this.scaleFactor = scaleFactor;
  }
  // 获取缩放比例
  getScaleFactor() {
    return this.scaleFactor;
  }

  // 获取绘制线数组
  getLineList() {
    return this.lineList;
  }
  // 增加线条到绘制线数组
  addLine() {
    this.actineLineIndex = this.lineList.length;
    if (!this.lineList[this.actineLineIndex]) {
      this.lineList.push({
        list: [],
        color: this.generateRandomBrightColorByHex(),
      });
    }
  }

  // 绘制六边形函数
  drawHexagon(vertexList, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    vertexList.map((itm) => {
      const target = [
        this.getConvertByAdd(itm.x, "offsetPageX"),
        this.getConvertByAdd(itm.y, "offsetPageY"),
      ];
      this.ctx.lineTo(...target);
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 绘制直线函数
  drawLineFn(vertexList, color) {
    if (vertexList.length === 1) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(vertexList[0].x, vertexList[0].y, 5, 5);
    } else {
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 5;
      vertexList.map((itm) => {
        this.ctx.lineTo(
          this.getConvertByAdd(itm.x, "offsetPageX"),
          this.getConvertByAdd(itm.y, "offsetPageY")
        );
      });
      this.ctx.stroke();
    }
  }

  // 绘制素材图标
  drawPicture(shape) {
    if (this.materiaTypeDoc[shape.type] && shape.type !== "core") {
      const materia = this.materiaTypeDoc[shape.type];
      const proportion = materia.height / materia.width;
      const imgW = 40 / this.scaleFactor;
      const imgH = (40 * proportion) / this.scaleFactor;
      this.drawImage(materia, imgW, imgH, shape);
    } else if (
      shape.type === "core" &&
      this.materiaTypeDoc[shape.type] &&
      shape.x == 0 &&
      shape.y == 0
    ) {
      const materia = this.materiaTypeDoc[shape.type];
      const proportion = materia.height / materia.width;
      const imgW = 120 / this.scaleFactor;
      const imgH = (120 * proportion) / this.scaleFactor;
      this.drawImage(materia, imgW, imgH, shape);
    }
  }

  drawImage(materia, imgW, imgH, shape) {
    this.ctx.drawImage(
      this.materialImg,
      materia.positionX,
      materia.positionY,
      materia.width,
      materia.height,
      this.getConvertByAdd(shape.x - materia.offsetX, "offsetPageX"),
      this.getConvertByAdd(shape.y - materia.offsetY, "offsetPageY"),
      imgW,
      imgH
    );
  }

  // 清除画布
  cleanDraw() {
    this.ctx.clearRect(
      -(this.canvas.width / 2),
      -(this.canvas.height / 2),
      this.canvas.width,
      this.canvas.height
    );

    this.ctx.fillStyle = "#f2f2f2";
    // 使用fillRect方法填充整个Canvas
    this.ctx.fillRect(
      -(this.canvas.width / 2),
      -(this.canvas.height / 2),
      this.canvas.width,
      this.canvas.height
    );
  }

  randomChannel() {
    return Math.floor(Math.random() * 256);
  }

  generateRandomBrightColor() {
    return `rgb(${this.randomChannel()}, ${this.randomChannel()}, ${this.randomChannel()})`;
  }

  randomChannelTo16() {
    return Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  }

  generateRandomBrightColorByHex() {
    return `#${this.randomChannelTo16()}${this.randomChannelTo16()}${this.randomChannelTo16()}`;
  }

  // 绘制所有图形和线条
  draw() {
    this.cleanDraw();
    this.typeList.map((type) => {
      const list = this.shapes[type];
      list.map((shape) => {
        if (
          shape.type &&
          shape.type === "baseCamp" &&
          this.clubInfoList[shape.rank - 1]
        ) {
          const clubInfo = this.clubInfoList[shape.rank - 1];
          let txtColor = "#00ff00";
          let backColor = "rgba(0, 0, 0, 0.6)";
          if (clubInfo.rel === "0") {
            shape.color = "#00ff00";
          } else if (clubInfo.rel === "1") {
            shape.color = "#ff0000";
            txtColor = "#ff0000";
          } else if (clubInfo.rel === "2") {
            shape.color = "#ff8888";
            txtColor = "#ff8888";
          } else if (clubInfo.rel === "this") {
            shape.color = "#87ceeb";
          }

          this.drawHexagon(shape.vertexList, shape.color);
          this.drawPicture(shape);

          const fontSize = 18 / this.scaleFactor;
          // 不提前设置字体会有长度对不上的bug
          this.ctx.font = `normal ${fontSize}px bold serif`;

          const txt = clubInfo.name || shape.name;
          const backHeight = 25 / this.scaleFactor;
          const backWidth = this.ctx.measureText(txt).width + 10;

          const heightDeviation = backHeight - 8 / this.scaleFactor;

          const offsetPageX =
            this.getConvertByAdd(shape.x, "offsetPageX") - backWidth / 2;

          const offsetPageY = this.getConvertByAdd(shape.y + 40, "offsetPageY");

          this.ctx.fillStyle = backColor; // 背景
          this.ctx.fillRect(
            offsetPageX - 5,
            offsetPageY - heightDeviation,
            backWidth,
            backHeight
          );

          this.ctx.fillStyle = txtColor;

          this.ctx.fillText(txt, offsetPageX, offsetPageY);
        } else if (shape.type) {
          this.drawHexagon(shape.vertexList, shape.color);
          this.drawPicture(shape);
        } else {
          this.drawHexagon(shape.vertexList, shape.color);
        }
      });
    });
    this.lineList.map((line) => {
      this.drawLine(line.list, line.color);
    });
  }
  // 数值转换，相对地图放大和缩小
  getXConvert(num) {
    return this.getConvert(num, "centerX", "offsetPageX");
  }

  getYConvert(num) {
    return this.getConvert(num, "centerY", "offsetPageY");
  }

  getConvert(num, k1, k2) {
    return (num - this[k1] - this[k2]) * this.scaleFactor;
  }

  drawArrowListFn(list, color) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 1;
    list.map((itm) => {
      this.drawArrow(
        itm.startPointX,
        itm.startPointY,
        itm.endPointX,
        itm.endPointY,
        4
      );
    });
  }

  getConvertByAdd(num, key) {
    return num / this.scaleFactor + this[key];
  }
  
  drawArrow(startX, startY, endX, endY, arrowSize) {
    const dx = endX - startX;
    const dy = endY - startY;

    const angle = Math.atan2(dy, dx);

    this.ctx.beginPath();
    this.ctx.moveTo(
      this.getConvertByAdd(startX, "offsetPageX"),
      this.getConvertByAdd(startY, "offsetPageY")
    );

    const tX = arrowSize * Math.cos(angle - Math.PI / 6);
    const tY = arrowSize * Math.sin(angle - Math.PI / 6);
    const dX = arrowSize * Math.cos(angle + Math.PI / 6);
    const dY = arrowSize * Math.sin(angle + Math.PI / 6);

    this.ctx.lineTo(
      this.getConvertByAdd(endX - tX, "offsetPageX"),
      this.getConvertByAdd(endY - tY, "offsetPageY")
    );
    this.ctx.lineTo(
      this.getConvertByAdd(endX - dX, "offsetPageX"),
      this.getConvertByAdd(endY - dY, "offsetPageY")
    );

    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();

    this.ctx.moveTo(
      this.getConvertByAdd(endX, "offsetPageX"),
      this.getConvertByAdd(endY, "offsetPageY")
    );
    this.ctx.lineTo(
      this.getConvertByAdd(endX - tX * 3, "offsetPageX"),
      this.getConvertByAdd(endY - tY * 3, "offsetPageY")
    );

    this.ctx.lineTo(
      this.getConvertByAdd(endX - dX * 3, "offsetPageX"),
      this.getConvertByAdd(endY - dY * 3, "offsetPageY")
    );
    this.ctx.closePath();
    this.ctx.fill();
  }
  // dataURL转布尔
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(",");
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  // 画布生成图片到剪切板或者下载
  downloadCanvasImage(filename) {
    const oldScaleFactor = this.scaleFactor;
    const width = 4096;
    const height = 3600;
    document.querySelector("canvas").width = width;
    document.querySelector("canvas").height = height;
    this.ctx.translate(width / 2, height / 2);
    this.scaleFactor = 0.45;
    this.draw();
    setTimeout(() => {
      var dataURL = this.canvas.toDataURL();
      if (navigator && navigator.clipboard) {
        const png = new ClipboardItem({
          "image/png": this.dataURLtoBlob(dataURL),
        });
        navigator.clipboard
          .write([png])
          .then(function () {
            console.log("图片已被复制到剪切板");
          })
          .catch(function (error) {
            console.error("复制失败", error);
          });
      } else {
        var downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = dataURL;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      setTimeout(() => {
        this.scaleFactor = oldScaleFactor;
        this.init();
        this.draw();
      }, 0);
    }, 0);
  }
}

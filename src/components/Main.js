require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import ReactDOM from 'react-dom';
//获取图片数据
let imageData = require('json!../data/imageData.json');

//自执行函数，将图片信息转化为图片路径
imageData = (function getImageUrl(imageDataArr) {
	for (var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageData);

function getRangeRandom(low, high) { //获取区间内的随机值
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() { //设定旋转角度，0~30°的正负值
	return ((Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30));
}

var ImgFigure = React.createClass({
	handleClick: function(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();

	},
	render: function() {
		var styleObj = {};
		//如果props属性中指定了这张图片的位置
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
			// alert(styleObj.left);
		}
		//如果图片的旋转角度有值且不为零，添加角度属性
		if (this.props.arrange.rotate) {
			//为了兼容各浏览器，添加前缀,使用['-moz-', '-ms-', '-webkit-', '']时控制台会报警告，Unsupported style property -moz-transform等
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}
		//图片如果居中，设置其index值保证图片不被覆盖
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		//控制图片的类名来控制图片是否翻转
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//控制组件
var ControllerUnit = React.createClass({
	handleClick: function(e) {
		//点击的为当前选中态的按钮，翻转图片，否则进行图片居中操作
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},
	render: function() {
		var controllerUnitClassName = 'controller-unit';
		//对应的是居中的图片，显示按钮居中态
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
			//居中的同时为翻转状态
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
});


//舞台组件
var GalleryByReactApp = React.createClass({
	getInitialState: function() {
		return {
			imgsArrangeArr: [
				/*{
								pos: {
									left: '0',
									top: '0'
								},
								rotate:0, //旋转角度
								isInverse:false ,//是否翻转
								isCenter: false //是否居中
							}*/
			]
		}
	},
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		}
	},
	/*
	 * 翻转图片
	 * @param index 当前被执行翻转操作的图片对应的数组index值
	 * return {function} 闭包函数
	 */
	inverse: function(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	},
	/*
	 * 点击左右的图片，将图片居中显示
	 * @param index 当前被居中的图片对应的数组index值
	 * return {function} 闭包函数
	 */
	center: function(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	},

	/*
	 * 布局json中的所有图片
	 * @param centerIndex 指定居中排布的图片索引
	 *
	 */
	rearrange: function(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRihgtSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangeTopArr = [], //存储布局在上侧的图片信息
			topImgNum = Math.floor(Math.random() * 2), //设定布局在上侧的图片张数
			topImgeSpliceIndex = 0, //布局在上侧的图片索引
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //布局在中心的图片

		imgsArrangeCenterArr[0] = { //设定中心图片的位置,中心图片不需要旋转，角度置为0
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		//计算一个随机数，设定布局上侧的图片索引，并保存图片信息
		topImgeSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgeSpliceIndex, topImgNum);
		//布局上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});
		//布局左右侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;
			if (i < k) { //小于k时布在左侧
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRihgtSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		}

		// debugger;

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgeSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	},
	componentDidMount: function() { //组件加载后计算每张图片的位置范围
		//舞台的大小
		var stageDOM = this.refs.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);


		//拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0), //坑1，原来使用this.refs.imgFigure0，无法获取到节点，引入react-dom后调用findnode正常
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		this.Constant.centerPos = { //中心展示图片的位置
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};
		//指定左侧、右侧、上侧图片的可选区域
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	},
	render: function() {
		var controllerUnits = [],
			imgFigures = [];

		imageData.forEach(function(value, index) {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenrer: false
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this)); //坑2，组件执行时报Each child in an array or iterator should have a unique “key” prop 错误，不影响效果，但为了避免，加上了key={index}，得以解决
		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
});


GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
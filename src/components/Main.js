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

var ImgFigure = React.createClass({
	render: function() {
		var styleObj = {};
		//如果props属性中指定了这张图片的位置
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
			// alert(styleObj.left);
		}
		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption><h2 className="img-title">{this.props.data.title}</h2></figcaption>
			</figure>
		);
	}
});

var GalleryByReactApp = React.createClass({
	getInitialState: function() {
		return {
			imgsArrangeArr: [
				/*{
								pos: {
									left: '0',
									top: '0'
								}
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
		imgsArrangeCenterArr[0].pos = centerPos; //设定中心图片的位置
		//计算一个随机数，设定布局上侧的图片索引，并保存图片信息
		topImgeSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgeSpliceIndex, topImgNum);
		//布局上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			}
		});
		//布局左右侧的图片
		for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;
			if (i < k) { //小于k时布在左侧
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRihgtSecX;
			}
			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
			}
		}

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
					}
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>);
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


/*class AppComponent extends React.Component {
	render() {
		return (
			<div className="index">
		      	<img src={yeomanImage} alt="Yeoman Generator" />
		        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
		      </div>
		);
	}
}*/

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
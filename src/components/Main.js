require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
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

var ImgFigure = React.createClass({
	render: function() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption><h2 className="img-title">{this.props.data.title}</h2></figcaption>
			</figure>
		);
	}
});

var GalleryByReactApp = React.createClass({
	render: function() {
		var controllerUnits = [],
			imgFigures = [];

		imageData.forEach(function(value) {
			imgFigures.push(<ImgFigure data={value} />);
		});
		return (
			<section className="stage">
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
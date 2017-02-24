require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
//获取图片数据
let imageData = require('json!../data/imageData.json');

//自执行函数，将图片信息转化为图片路径
imageData = (function getImageUrl(imageDataArr) {
	for (var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageData);

var GalleryByReactApp = React.createClass({
	render: function() {
		return (
			<section className="stage">
				<section className="img-sec"></section>
				<nav className="controller-nav"></nav>
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
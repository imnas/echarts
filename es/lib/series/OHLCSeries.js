"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { nest } from "d3-collection";
import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import { isDefined, functor } from "../utils";

var OHLCSeries = function (_Component) {
	_inherits(OHLCSeries, _Component);

	function OHLCSeries(props) {
		_classCallCheck(this, OHLCSeries);

		var _this = _possibleConstructorReturn(this, (OHLCSeries.__proto__ || Object.getPrototypeOf(OHLCSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(OHLCSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var yAccessor = this.props.yAccessor;
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;


			var barData = getOHLCBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);
			_drawOnCanvas(ctx, barData);
		}
	}, {
		key: "render",
		value: function render() {
			var clip = this.props.clip;


			return React.createElement(GenericChartComponent, {
				svgDraw: this.renderSVG,
				canvasToDraw: getAxisCanvas,
				canvasDraw: this.drawOnCanvas,
				clip: clip,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    className = _props.className,
			    yAccessor = _props.yAccessor;
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;


			var barData = getOHLCBars(this.props, xAccessor, yAccessor, xScale, yScale, plotData);

			var strokeWidth = barData.strokeWidth,
			    bars = barData.bars;


			return React.createElement(
				"g",
				{ className: className },
				bars.map(function (d, idx) {
					return React.createElement("path", { key: idx,
						className: d.className, stroke: d.stroke, strokeWidth: strokeWidth,
						d: "M" + d.openX1 + " " + d.openY + " L" + d.openX2 + " " + d.openY + " M" + d.x + " " + d.y1 + " L" + d.x + " " + d.y2 + " M" + d.closeX1 + " " + d.closeY + " L" + d.closeX2 + " " + d.closeY });
				})
			);
		}
	}]);

	return OHLCSeries;
}(Component);

OHLCSeries.propTypes = {
	className: PropTypes.string,
	classNames: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
	yAccessor: PropTypes.func.isRequired,
	clip: PropTypes.bool.isRequired
};

OHLCSeries.defaultProps = {
	className: "react-stockcharts-ohlc",
	yAccessor: function yAccessor(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close };
	},
	classNames: function classNames(d) {
		return isDefined(d.absoluteChange) ? d.absoluteChange > 0 ? "up" : "down" : "firstbar";
	},
	stroke: function stroke(d) {
		return isDefined(d.absoluteChange) ? d.absoluteChange > 0 ? "#6BA583" : "#FF0000" : "#000000";
	},
	clip: true
};

function _drawOnCanvas(ctx, barData) {
	var strokeWidth = barData.strokeWidth,
	    bars = barData.bars;


	var wickNest = nest().key(function (d) {
		return d.stroke;
	}).entries(bars);

	ctx.lineWidth = strokeWidth;

	wickNest.forEach(function (outer) {
		var key = outer.key,
		    values = outer.values;

		ctx.strokeStyle = key;
		values.forEach(function (d) {
			ctx.beginPath();
			ctx.moveTo(d.x, d.y1);
			ctx.lineTo(d.x, d.y2);

			ctx.moveTo(d.openX1, d.openY);
			ctx.lineTo(d.openX2, d.openY);

			ctx.moveTo(d.closeX1, d.closeY);
			ctx.lineTo(d.closeX2, d.closeY);

			ctx.stroke();
		});
	});
}

function getOHLCBars(props, xAccessor, yAccessor, xScale, yScale, plotData) {
	var classNamesProp = props.classNames,
	    strokeProp = props.stroke;


	var strokeFunc = functor(strokeProp);
	var classNameFunc = functor(classNamesProp);

	var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));

	var barWidth = Math.max(1, Math.round(width / (plotData.length - 1) / 2) - 1.5);
	var strokeWidth = Math.min(barWidth, 6);

	var bars = plotData.filter(function (d) {
		return isDefined(yAccessor(d).close);
	}).map(function (d) {
		var ohlc = yAccessor(d),
		    x = Math.round(xScale(xAccessor(d))),
		    y1 = yScale(ohlc.high),
		    y2 = yScale(ohlc.low),
		    openX1 = x - barWidth,
		    openX2 = x + strokeWidth / 2,
		    openY = yScale(ohlc.open),
		    closeX1 = x - strokeWidth / 2,
		    closeX2 = x + barWidth,
		    closeY = yScale(ohlc.close),
		    className = classNameFunc(d),
		    stroke = strokeFunc(d);

		return { x: x, y1: y1, y2: y2, openX1: openX1, openX2: openX2, openY: openY, closeX1: closeX1, closeX2: closeX2, closeY: closeY, stroke: stroke, className: className };
	});
	return { barWidth: barWidth, strokeWidth: strokeWidth, bars: bars };
}

export default OHLCSeries;
//# sourceMappingURL=OHLCSeries.js.map
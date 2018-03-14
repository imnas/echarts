"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { line as d3Line } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas, getMouseCanvas } from "../GenericComponent";

import { isDefined, getClosestItemIndexes, strokeDashTypes, getStrokeDasharray } from "../utils";

var LineSeries = function (_Component) {
	_inherits(LineSeries, _Component);

	function LineSeries(props) {
		_classCallCheck(this, LineSeries);

		var _this = _possibleConstructorReturn(this, (LineSeries.__proto__ || Object.getPrototypeOf(LineSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(LineSeries, [{
		key: "isHover",
		value: function isHover(moreProps) {
			// console.log("HERE")
			var _props = this.props,
			    highlightOnHover = _props.highlightOnHover,
			    yAccessor = _props.yAccessor,
			    hoverTolerance = _props.hoverTolerance;


			if (!highlightOnHover) return false;

			var mouseXY = moreProps.mouseXY,
			    currentItem = moreProps.currentItem,
			    xScale = moreProps.xScale,
			    plotData = moreProps.plotData;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    yScale = _moreProps$chartConfi.yScale,
			    origin = _moreProps$chartConfi.origin;
			var xAccessor = moreProps.xAccessor;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    x = _mouseXY[0],
			    y = _mouseXY[1];

			var radius = hoverTolerance;

			var _getClosestItemIndexe = getClosestItemIndexes(plotData, xScale.invert(x), xAccessor),
			    left = _getClosestItemIndexe.left,
			    right = _getClosestItemIndexe.right;

			if (left === right) {
				var cy = yScale(yAccessor(currentItem)) + origin[1];
				var cx = xScale(xAccessor(currentItem)) + origin[0];

				var hovering1 = Math.pow(x - cx, 2) + Math.pow(y - cy, 2) < Math.pow(radius, 2);

				return hovering1;
			} else {
				var l = plotData[left];
				var r = plotData[right];
				var x1 = xScale(xAccessor(l)) + origin[0];
				var y1 = yScale(yAccessor(l)) + origin[1];
				var x2 = xScale(xAccessor(r)) + origin[0];
				var y2 = yScale(yAccessor(r)) + origin[1];

				// y = m * x + b
				var m /* slope */ = (y2 - y1) / (x2 - x1);
				var b /* y intercept */ = -1 * m * x1 + y1;

				var desiredY = Math.round(m * x + b);

				var hovering2 = y >= desiredY - radius && y <= desiredY + radius;

				return hovering2;
			}
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    yAccessor = _props2.yAccessor,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth,
			    hoverStrokeWidth = _props2.hoverStrokeWidth,
			    defined = _props2.defined,
			    strokeDasharray = _props2.strokeDasharray,
			    interpolation = _props2.interpolation;
			var connectNulls = this.props.connectNulls;
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    hovering = moreProps.hovering;


			ctx.lineWidth = hovering ? hoverStrokeWidth : strokeWidth;

			ctx.strokeStyle = stroke;
			ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));

			var dataSeries = d3Line().x(function (d) {
				return xScale(xAccessor(d));
			}).y(function (d) {
				return yScale(yAccessor(d));
			});

			if (isDefined(interpolation)) {
				dataSeries.curve(interpolation);
			}
			if (!connectNulls) {
				dataSeries.defined(function (d) {
					return defined(yAccessor(d));
				});
			}

			ctx.beginPath();
			dataSeries.context(ctx)(plotData);
			ctx.stroke();
			/*
   let points = [];
   for (let i = 0; i < plotData.length; i++) {
   	const d = plotData[i];
   	if (defined(yAccessor(d), i)) {
   		const [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
   			points.push([x, y]);
   	} else if (points.length) {
   		segment(points, ctx);
   		points = connectNulls ? points : [];
   	}
   }
   	if (points.length) segment(points, ctx);*/
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    yAccessor = _props3.yAccessor,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    hoverStrokeWidth = _props3.hoverStrokeWidth,
			    defined = _props3.defined,
			    strokeDasharray = _props3.strokeDasharray;
			var connectNulls = this.props.connectNulls;
			var interpolation = this.props.interpolation;
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData,
			    hovering = moreProps.hovering;


			var dataSeries = d3Line().x(function (d) {
				return xScale(xAccessor(d));
			}).y(function (d) {
				return yScale(yAccessor(d));
			});

			if (isDefined(interpolation)) {
				dataSeries.curve(interpolation);
			}
			if (!connectNulls) {
				dataSeries.defined(function (d) {
					return defined(yAccessor(d));
				});
			}
			var d = dataSeries(plotData);

			var _props4 = this.props,
			    fill = _props4.fill,
			    className = _props4.className;


			return React.createElement("path", { className: className + " " + (stroke ? "" : " line-stroke"),
				d: d,
				stroke: stroke,
				strokeWidth: hovering ? hoverStrokeWidth : strokeWidth,
				strokeDasharray: getStrokeDasharray(strokeDasharray),
				fill: fill
			});
		}
	}, {
		key: "render",
		value: function render() {
			var highlightOnHover = this.props.highlightOnHover;

			var hoverProps = highlightOnHover ? {
				isHover: this.isHover,
				drawOn: ["mousemove", "pan"],
				canvasToDraw: getMouseCanvas
			} : {
				drawOn: ["pan"],
				canvasToDraw: getAxisCanvas
			};

			return React.createElement(GenericChartComponent, _extends({
				svgDraw: this.renderSVG,

				canvasDraw: this.drawOnCanvas,

				onClickWhenHover: this.props.onClick,
				onDoubleClickWhenHover: this.props.onDoubleClick,
				onContextMenuWhenHover: this.props.onContextMenu
			}, hoverProps));
		}
	}]);

	return LineSeries;
}(Component);

/*
function segment(points, ctx) {
	ctx.beginPath();

	const [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	}

	ctx.stroke();
}
*/

LineSeries.propTypes = {
	className: PropTypes.string,
	strokeWidth: PropTypes.number,
	stroke: PropTypes.string,
	hoverStrokeWidth: PropTypes.number,
	fill: PropTypes.string,
	defined: PropTypes.func,
	hoverTolerance: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	highlightOnHover: PropTypes.bool,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
	yAccessor: PropTypes.func,
	connectNulls: PropTypes.bool,
	interpolation: PropTypes.func
};

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	strokeDasharray: "Solid",
	defined: function defined(d) {
		return !isNaN(d);
	},
	hoverTolerance: 6,
	highlightOnHover: false,
	connectNulls: false,
	onClick: function onClick(e) {
		console.log("Click", e);
	},
	onDoubleClick: function onDoubleClick(e) {
		console.log("Double Click", e);
	},
	onContextMenu: function onContextMenu(e) {
		console.log("Right Click", e);
	}
};

export default LineSeries;
//# sourceMappingURL=LineSeries.js.map
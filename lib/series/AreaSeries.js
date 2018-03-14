"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _LineSeries = require("./LineSeries");

var _LineSeries2 = _interopRequireDefault(_LineSeries);

var _AreaOnlySeries = require("./AreaOnlySeries");

var _AreaOnlySeries2 = _interopRequireDefault(_AreaOnlySeries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AreaSeries(props) {
	var yAccessor = props.yAccessor,
	    baseAt = props.baseAt;
	var className = props.className,
	    opacity = props.opacity,
	    stroke = props.stroke,
	    strokeWidth = props.strokeWidth,
	    fill = props.fill,
	    interpolation = props.interpolation;


	return _react2.default.createElement(
		"g",
		{ className: className },
		_react2.default.createElement(_LineSeries2.default, {
			yAccessor: yAccessor,
			stroke: stroke, fill: "none",
			strokeWidth: strokeWidth,
			interpolation: interpolation,
			hoverHighlight: false }),
		_react2.default.createElement(_AreaOnlySeries2.default, {
			yAccessor: yAccessor,
			interpolation: interpolation,
			base: baseAt,
			stroke: "none", fill: fill,
			opacity: opacity })
	);
}

AreaSeries.propTypes = {
	stroke: _propTypes2.default.string,
	strokeWidth: _propTypes2.default.number,
	fill: _propTypes2.default.string.isRequired,
	opacity: _propTypes2.default.number.isRequired,
	className: _propTypes2.default.string,
	yAccessor: _propTypes2.default.func.isRequired,
	baseAt: _propTypes2.default.func,
	interpolation: _propTypes2.default.func
};

AreaSeries.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-area"
};

exports.default = AreaSeries;
//# sourceMappingURL=AreaSeries.js.map
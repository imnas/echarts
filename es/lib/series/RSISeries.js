"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

var RSISeries = function (_Component) {
	_inherits(RSISeries, _Component);

	function RSISeries() {
		_classCallCheck(this, RSISeries);

		return _possibleConstructorReturn(this, (RSISeries.__proto__ || Object.getPrototypeOf(RSISeries)).apply(this, arguments));
	}

	_createClass(RSISeries, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    className = _props.className,
			    stroke = _props.stroke,
			    opacity = _props.opacity;
			var yAccessor = this.props.yAccessor;
			var _props2 = this.props,
			    overSold = _props2.overSold,
			    middle = _props2.middle,
			    overBought = _props2.overBought;


			return React.createElement(
				"g",
				{ className: className },
				React.createElement(LineSeries, {
					className: className,
					yAccessor: yAccessor,
					stroke: stroke.line, fill: "none" }),
				React.createElement(StraightLine, {
					stroke: stroke.top, opacity: opacity.top,
					yValue: overSold }),
				React.createElement(StraightLine, {
					stroke: stroke.middle, opacity: opacity.middle,
					yValue: middle }),
				React.createElement(StraightLine, {
					stroke: stroke.bottom, opacity: opacity.bottom,
					yValue: overBought })
			);
		}
	}]);

	return RSISeries;
}(Component);

RSISeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		line: PropTypes.string.isRequired,
		top: PropTypes.string.isRequired,
		middle: PropTypes.string.isRequired,
		bottom: PropTypes.string.isRequired
	}).isRequired,
	opacity: PropTypes.shape({
		top: PropTypes.number.isRequired,
		middle: PropTypes.number.isRequired,
		bottom: PropTypes.number.isRequired
	}).isRequired,
	overSold: PropTypes.number.isRequired,
	middle: PropTypes.number.isRequired,
	overBought: PropTypes.number.isRequired
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	},
	opacity: {
		top: 0.3,
		middle: 0.3,
		bottom: 0.3
	},
	overSold: 70,
	middle: 50,
	overBought: 30
};

export default RSISeries;
//# sourceMappingURL=RSISeries.js.map
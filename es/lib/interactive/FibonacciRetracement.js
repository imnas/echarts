"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import { terminate, saveNodeType, isHoverForInteractiveType } from "./utils";
import EachFibRetracement from "./hoc/EachFibRetracement";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

var FibonacciRetracement = function (_Component) {
	_inherits(FibonacciRetracement, _Component);

	function FibonacciRetracement(props) {
		_classCallCheck(this, FibonacciRetracement);

		var _this = _possibleConstructorReturn(this, (FibonacciRetracement.__proto__ || Object.getPrototypeOf(FibonacciRetracement)).call(this, props));

		_this.handleStart = _this.handleStart.bind(_this);
		_this.handleEnd = _this.handleEnd.bind(_this);
		_this.handleDrawRetracement = _this.handleDrawRetracement.bind(_this);

		_this.handleEdge1Drag = _this.handleEdge1Drag.bind(_this);
		_this.handleEdge2Drag = _this.handleEdge2Drag.bind(_this);

		_this.handleDrag = _this.handleDrag.bind(_this);
		_this.handleDragComplete = _this.handleDragComplete.bind(_this);

		_this.terminate = terminate.bind(_this);
		_this.getSelectionState = isHoverForInteractiveType("retracements").bind(_this);

		_this.saveNodeType = saveNodeType.bind(_this);
		_this.nodes = [];

		_this.state = {};
		return _this;
	}

	_createClass(FibonacciRetracement, [{
		key: "handleDrawRetracement",
		value: function handleDrawRetracement(xyValue) {
			var current = this.state.current;

			if (isDefined(current) && isDefined(current.x1)) {
				this.mouseMoved = true;
				this.setState({
					current: _extends({}, current, {
						x2: xyValue[0],
						y2: xyValue[1]
					})
				});
			}
		}
	}, {
		key: "handleDrag",
		value: function handleDrag(index, xy) {
			this.setState({
				override: _extends({
					index: index
				}, xy)
			});
		}
	}, {
		key: "handleEdge1Drag",
		value: function handleEdge1Drag(echo, newXYValue, origXYValue) {
			var retracements = this.props.retracements;
			var index = echo.index;


			var dx = origXYValue.x1Value - newXYValue.x1Value;

			this.setState({
				override: {
					index: index,
					x1: retracements[index].x1 - dx,
					y1: retracements[index].y1,
					x2: retracements[index].x2,
					y2: retracements[index].y2
				}
			});
		}
	}, {
		key: "handleEdge2Drag",
		value: function handleEdge2Drag(echo, newXYValue, origXYValue) {
			var retracements = this.props.retracements;
			var index = echo.index;


			var dx = origXYValue.x2Value - newXYValue.x2Value;

			this.setState({
				override: {
					index: index,
					x1: retracements[index].x1,
					y1: retracements[index].y1,
					x2: retracements[index].x2 - dx,
					y2: retracements[index].y2
				}
			});
		}
	}, {
		key: "handleDragComplete",
		value: function handleDragComplete(moreProps) {
			var _this2 = this;

			var retracements = this.props.retracements;
			var override = this.state.override;

			if (isDefined(override)) {
				var index = override.index,
				    rest = _objectWithoutProperties(override, ["index"]);

				var newRetracements = retracements.map(function (each, idx) {
					return idx === index ? _extends({}, each, rest, { selected: true }) : each;
				});
				this.setState({
					override: null
				}, function () {
					_this2.props.onComplete(newRetracements, moreProps);
				});
			}
		}
	}, {
		key: "handleStart",
		value: function handleStart(xyValue, moreProps) {
			var _this3 = this;

			var current = this.state.current;

			if (isNotDefined(current) || isNotDefined(current.x1)) {
				this.mouseMoved = false;
				this.setState({
					current: {
						x1: xyValue[0],
						y1: xyValue[1],
						x2: null,
						y2: null
					}
				}, function () {
					_this3.props.onStart(moreProps);
				});
			}
		}
	}, {
		key: "handleEnd",
		value: function handleEnd(xyValue, moreProps, e) {
			var _this4 = this;

			var _props = this.props,
			    retracements = _props.retracements,
			    appearance = _props.appearance,
			    type = _props.type;
			var current = this.state.current;


			if (this.mouseMoved && isDefined(current) && isDefined(current.x1)) {
				var newRetracements = retracements.concat(_extends({}, current, {
					x2: xyValue[0],
					y2: xyValue[1],
					selected: true,
					appearance: appearance,
					type: type
				}));

				this.setState({
					current: null
				}, function () {
					_this4.props.onComplete(newRetracements, moreProps, e);
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var _state = this.state,
			    current = _state.current,
			    override = _state.override;
			var retracements = this.props.retracements;
			var _props2 = this.props,
			    appearance = _props2.appearance,
			    type = _props2.type;
			var _props3 = this.props,
			    currentPositionStroke = _props3.currentPositionStroke,
			    currentPositionOpacity = _props3.currentPositionOpacity,
			    currentPositionStrokeWidth = _props3.currentPositionStrokeWidth,
			    currentPositionRadius = _props3.currentPositionRadius;
			var _props4 = this.props,
			    enabled = _props4.enabled,
			    hoverText = _props4.hoverText;

			var overrideIndex = isDefined(override) ? override.index : null;

			var currentRetracement = isDefined(current) && isDefined(current.x2) ? React.createElement(EachFibRetracement, _extends({
				interactive: false,
				type: type,
				appearance: appearance,
				hoverText: hoverText
			}, current)) : null;
			return React.createElement(
				"g",
				null,
				retracements.map(function (each, idx) {
					var eachAppearance = isDefined(each.appearance) ? _extends({}, appearance, each.appearance) : appearance;

					return React.createElement(EachFibRetracement, _extends({
						key: idx,
						ref: _this5.saveNodeType(idx),
						index: idx,
						type: each.type,
						selected: each.selected,
						hoverText: hoverText
					}, idx === overrideIndex ? override : each, {
						appearance: eachAppearance,
						onDrag: _this5.handleDrag,
						onDragComplete: _this5.handleDragComplete
					}));
				}),
				currentRetracement,
				React.createElement(MouseLocationIndicator, {
					enabled: enabled,
					snap: false,
					r: currentPositionRadius,
					stroke: currentPositionStroke,
					opacity: currentPositionOpacity,
					strokeWidth: currentPositionStrokeWidth,
					onMouseDown: this.handleStart,
					onClick: this.handleEnd,
					onMouseMove: this.handleDrawRetracement
				})
			);
		}
	}]);

	return FibonacciRetracement;
}(Component);

// onClick={this.handleClick}

FibonacciRetracement.propTypes = {
	enabled: PropTypes.bool.isRequired,
	width: PropTypes.number,

	onStart: PropTypes.func,
	onComplete: PropTypes.func,
	onSelect: PropTypes.func,

	type: PropTypes.oneOf(["EXTEND", // extends from -Infinity to +Infinity
	"RAY", // extends to +/-Infinity in one direction
	"BOUND" // extends between the set bounds
	]).isRequired,
	hoverText: PropTypes.object.isRequired,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	retracements: PropTypes.array.isRequired,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		fontFill: PropTypes.string.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		nsEdgeFill: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired
	}).isRequired
};

FibonacciRetracement.defaultProps = {
	enabled: true,
	type: "RAY",
	retracements: [],

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	hoverText: _extends({}, HoverTextNearMouse.defaultProps, {
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object"
	}),
	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	appearance: {
		stroke: "#000000",
		strokeWidth: 1,
		strokeOpacity: 1,
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 11,
		fontFill: "#000000",
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		nsEdgeFill: "#000000",
		edgeStrokeWidth: 1,
		r: 5
	}
};

export default FibonacciRetracement;
//# sourceMappingURL=FibonacciRetracement.js.map
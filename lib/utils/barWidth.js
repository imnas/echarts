"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plotDataLengthBarWidth = plotDataLengthBarWidth;
exports.timeIntervalBarWidth = timeIntervalBarWidth;

var _utils = require("../utils");

/**
 * Bar width is based on the amount of items in the plot data and the distance between the first and last of those
 * items.
 * @param props the props passed to the series.
 * @param moreProps an object holding the xScale, xAccessor and plotData.
 * @return {number} the bar width.
 */
function plotDataLengthBarWidth(props, moreProps) {
  var _props$widthRatio = props.widthRatio,
      widthRatio = _props$widthRatio === undefined ? 0.8 : _props$widthRatio;
  var scale = moreProps.xScale,
      accessor = moreProps.xAccessor,
      plotData = moreProps.plotData;


  var width = Math.abs((scale(accessor((0, _utils.last)(plotData))) - scale(accessor((0, _utils.head)(plotData)))) / (plotData.length - 1));
  return width * widthRatio;
}

/**
 * Generates a width function that calculates the bar width based on the given time interval.
 * @param interval a d3-time time interval.
 * @return {Function} the width function.
 */
function timeIntervalBarWidth(interval) {
  return function (props, moreProps) {
    var _props$widthRatio2 = props.widthRatio,
        widthRatio = _props$widthRatio2 === undefined ? 0.8 : _props$widthRatio2;
    var scale = moreProps.xScale,
        accessor = moreProps.xAccessor,
        plotData = moreProps.plotData;


    var first = accessor((0, _utils.head)(plotData));
    return Math.abs(scale(interval.offset(first, 1)) - scale(first)) * widthRatio;
  };
}
//# sourceMappingURL=barWidth.js.map
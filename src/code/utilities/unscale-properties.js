import { forIn } from 'lodash';

export function unscaleXPos(value, scale) {
  // account for horizontal scroll position
  return (value + window.pageXOffset) / scale;
}

export function unscaleYPos(value, scale) {
  // account for vertical scroll position
  return (value + window.pageYOffset) / scale;
}

export function unscaleExtent(value, scale) {
  // extents aren't affected by scroll position
  return value / scale;
}

export default function unscaleProperties(obj, scale=1) {
  let scaledObj = {};
  const xPosProps = ['x', 'left', 'right'],
        yPosProps = ['y', 'top', 'bottom'];
  forIn(obj, function(value, key) {
    if (typeof value === 'number') {
      scaledObj[key] = xPosProps.indexOf(key) >= 0
                        ? unscaleXPos(value, scale)
                        : (yPosProps.indexOf(key) >= 0
                            ? unscaleYPos(value, scale)
                            : unscaleExtent(value, scale));
    }
  });
  return scaledObj;
}

import { forIn } from 'lodash';

export default function unscaleProperties(obj, scale=1) {
  let scaledObj = {};
  forIn(obj, function(value, key) {
    if (typeof value === 'number')
      scaledObj[key] = value / scale;
  });
  return scaledObj;
}


export default socket => store => next => action => {
  console.log('its middleware', action);
  return next(action);
};
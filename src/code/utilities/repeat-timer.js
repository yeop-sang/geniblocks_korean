/*
 * Utility class for a repeating timer (cf. Window.setInterval) with support for variable
 * intervals. Also keeps track of the number of times the timer has fired (iterations)
 * and the total duration of the intervals (totalInterval) for client use in deciding 
 * when to terminate the timer for good. Calls a client-provided completion function
 * when the iteration is completed. The timer can also be stopped and restarted.
 */
export default class RepeatTimer {

  /**
      @param  actionFn {function} - the function to call when the timer fires
                                    the function is called with the timer object as this,
                                    plus the current iteration index and the options object
      @param  options {object} - configuration options
      @param    interval {number|function} - numeric values are treated as a constant interval
                                    (cf. Window.setInterval). Functions are called on each
                                    iteration and should return the desired interval. The
                                    interval() function is called with the timer object as this,
                                    the current iteration index, and the options object.
      @param    onComplete {function} - optional callback to be called when the timer completes
   */
  constructor(actionFn, options) {
    this.actionFn = actionFn;
    this.options = options;
    this.iterations = 0;
    this.totalInterval = 0;
  }

  schedule(startInterval) {
    const interval = startInterval != null ? startInterval : this.nextInterval(this.iterations);
    if (interval >= 0) {
      this.prevInterval = interval;
      this.timerID = setTimeout(this.perform.bind(this), interval);
    }
  }

  perform() {
    this.totalInterval += this.prevInterval;
    const result = this.actionFn.call(this, this.iterations, this.options);
    ++this.iterations;
    // false return indicates that timer should be stopped
    if (result === false) {
      if (this.options.onComplete)
        this.options.onComplete.call(this, this.iterations, this.options);
    }
    else {
      this.schedule();
    }
  }

  start(startInterval) {
    // if it's already running, stop before restarting
    this.stop();

    this.schedule(startInterval);
  }

  stop() {
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  nextInterval(iterations) {
    var interval = this.options.interval;
    if (typeof interval === 'number')
      return interval;
    if (typeof interval === 'function')
      return interval.call(this, iterations, this.options);
    // default to constant one-second interval if no interval is provided
    return 1000;
  }
}

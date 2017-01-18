/**
    Utility class for managing/synchronizing multiple RepeatTimers.
    Supports starting/stopping multiple timers together, and only calls
    the TimerSet's onComplete callback after all timers have completed.
 */

import RepeatTimer from './repeat-timer';
import { assign } from 'lodash';

export default class TimerSet {

  constructor(options) {
    this.options = options || {};
    this.timers = [];
    this.completeCount = 0;
  }

  add(actionFn, options) {
    const timerSet = this,
          originalOnComplete = options.onComplete;

    // RepeatTimer completion callback
    function onComplete(iterations, options) {
      if (originalOnComplete)
        originalOnComplete.call(this, iterations, options);
      if (timerSet)
        timerSet.onTimerComplete();
    }

    const timer = new RepeatTimer(actionFn, assign({}, options, { onComplete }));
    this.timers.push(timer);

    // so calls can be chained
    return this;
  }

  start(startInterval) {
    this.timers.forEach(timer => timer.start(startInterval));
  }

  stop() {
    this.timers.forEach(timer => timer.stop());
  }

  reset() {
    this.stop();
    this.completeCount = 0;
  }

  onTimerComplete() {
    if (++this.completeCount >= this.timers.length) {
      if (this.options.onComplete)
        this.options.onComplete.call(this, this.options);
    }
  }
}
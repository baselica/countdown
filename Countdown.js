/**
 * Sets up the countdown
 *
 * @param {HTMLElement} el Reference to the object to connect to (#something)
 * @param {number} config.elements No of elements in object
 * @param {number} config.height Height of element in vh
 * @param {string} config.transFunction The transition function
 * @param {number} config.duration Time spent in animation - will be calc depending on delta
 * @param {number} config.blur The blur radius in pixels
 * @constructor
 */
var Countdown = function(el, config) {
    this._el = el;
    this._noOfElements = config.elements;
    this._height = config.height;
    this._transFunction = config.transFunction;
    this._duration = config.duration;
    this._blur = config.blur;
    this._elHeight = this._el.getBoundingClientRect().height;
    this._currentPos = 0;

    this._setupElements();
};

/**
 * Executes scroll to specified index
 *
 * @param {number} elIndex
 */
Countdown.prototype.trigger = function(elIndex) {
    elIndex = this._noOfElements - elIndex;
    var offset = -(elIndex);
    var delta = elIndex - Math.abs(this._currentPos / this._height);
    var duration = Math.abs((this._duration / this._noOfElements) * delta);
    var blurDuration = (duration / 10);

    this._scroll(offset, duration);
    this._blurEl(blurDuration);
};

/**
 * Setup the dom for the cool stuff
 *
 * @private
 */
Countdown.prototype._setupElements = function() {
    this._el.innerHTML = '';
    this._wrap = document.createElement('div')
    this._wrap.className = 'wrap';

    var elements = [];
    for (var i = 1; i <= this._noOfElements; i++) {
        elements.push('<span>' + i + '</span>');
    }
    elements.reverse();

    this._wrap.insertAdjacentHTML('afterbegin', elements.join(('')));
    this._wrap.style.webkitTransitionProperty = 'transform';
    this._wrap.style.webkitTransitionTimingFunction = this._transFunction;
    this._el.appendChild(this._wrap);
};

/**
 * Executes the scroll
 * @param {number} offset
 * @param {number} duration
 * @private
 */
Countdown.prototype._scroll = function(offset, duration) {
    var self = this;

    this._wrap.style.webkitTransitionDuration = duration + 'ms';
    window.setTimeout(function() {
        self._wrap.style.webkitTransform = 'translateY(' + (self._elHeight * offset) + 'px)';
        self._currentPos = offset;
    }, 0);
};

/**
 * Handles blurring
 *
 * @param duration
 * @private
 */
Countdown.prototype._blurEl = function(duration) {
    var self = this;

    this._el.style.webkitFilter = 'blur(' + this._blur + 'px)';

    this._el.style.webkitTransitionProperty = '-webkit-filter';
    this._el.style.webkitTransitionTimingFunction = 'linear';
    this._el.style.webkitTransitionDuration = duration + 'ms';
    window.setTimeout(function() {
        self._el.style.webkitFilter = 'blur(0)';
        window.addEventListener('transitionend', function() {
            self._el.style.webkitTransition = '';
        }, true);
    }, duration * 9);
};

(function($, window, document, undefined) {
    var pluginName = "ptrLight",
        defaults = {
            paused: false,
            pullThreshold: 200,
            maxPullThreshold: 500,
            spinnerTimeout: 10000,
            scrollingDom: null, // if null, specified element
            refresh: function() {}
        };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    /*https://remysharp.com/2010/07/21/throttling-function-calls*/
    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;
            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }
    Plugin.prototype = {
        init: function() {
            var self = this;
            var elem = $(self.element).children();
            self.elem = elem;
            elem.parent().find('#ptr-light-indicator').remove();
            elem.parent().prepend('<div id="ptr-light-indicator"><div id="ptr-light-spinner"></div></div>');
            self.indicator = elem.parent().find('#ptr-light-indicator');
            self.spinner = elem.parent().find('#ptr-light-spinner');
            self.doneTimeout = null;
            self.inProgress = false;
            self.inProgressTouchstart = false;
            self.indicatorHeight = self.indicator.outerHeight();
            $(elem).css({
                'transform': "translateY(-" + self.indicatorHeight + "px)"
            });
            elem.parent().css({
                '-webkit-overflow-scrolling': 'touch'
            });
            var offsetTop = elem.parent().offset().top;
            var fingerOffset = 0;
            var top = 0;
            self.isSpinning = false;
            self.elast = true;
            self.spinnerRotation = 0;
            self.windowDimension = $(window).height();
            self.getTopTranslation = function(top) {
                return (1.0 - (1.0 / ((top * 0.55 / self.windowDimension) + 1.0))) * self.windowDimension;
            }
            self.spinner.css('opacity', '0');
            elem.unbind('touchstart.' + pluginName);
            elem.on('touchstart.' + pluginName, function(ev) {
                self.inProgressTouchstart = self.inProgress;
                if (self.options.paused || self.inProgress)
                    return false;
                fingerOffset = ev.originalEvent.touches[0].pageY - offsetTop
            });
            elem.unbind('touchmove.' + pluginName);
            elem.on('touchmove.' + pluginName, throttle(function(ev) {
                if (self.inProgress || self.inProgressTouchstart || self.options.paused)
                    return false;

                if ((self.options.scrollingDom || elem.parent()).scrollTop() > 0 || elem.position().top < 0 || document.body.scrollTop > 0) { // trigger refresh only if pulled from the top of the list
                    self.spinner.css('opacity', '0');
                    return true;
                }

                top = (ev.originalEvent.touches[0].pageY - offsetTop - fingerOffset);
                if (top > 1) {
                    if (self.elast) {
                        $(document.body).on('touchmove.' + pluginName, function(e) {
                            e.preventDefault();
                        });
                        self.elast = false;
                    }

                    if (top <= self.options.maxPullThreshold) {
                        var topTranslation = self.getTopTranslation(top);
                        $(elem).css({
                            'transform': "translateY(" + (topTranslation - self.indicatorHeight) + "px)"
                        });

                        self.indicator.css({
                            'top': (topTranslation - self.indicatorHeight) + "px"
                        });

                        self.spinnerRotation = self.spinnerRotation > 359 ? 360 : 360 * (top / self.options.pullThreshold);

                        self.spinner.css({
                            'opacity': '1',
                            'transform': 'rotate(' + self.spinnerRotation + 'deg)'
                        });

                    }
                } else {
                    $(document.body).unbind('touchmove.' + pluginName);
                    self.elast = true;
                }
            }, 5));
            elem.unbind('touchend.' + pluginName);
            elem.on('touchend.' + pluginName, function(ev) {
                if (self.options.paused || self.inProgress)
                    return false;

                if (top > 0) {
                    if (top > self.options.pullThreshold) {
                        self.inProgress = true;
                        self.options.refresh.call(this, self);
                        self.spinner.addClass('rotateLoop');
                        self.isSpinning = true;
                        elem.css({
                            'transform': 'translateY(0)',
                            'transition': 'transform 300ms ease'
                        });
                        self.indicator.css({
                            'top': "0px",
                            'transition': 'top 300ms ease'
                        });
                        if (self.options.spinnerTimeout) {
                            if (self.doneTimeout) {
                                clearTimeout(self.doneTimeout);
                            }
                            self.doneTimeout = setTimeout(function() {
                                self.done();
                            }, self.options.spinnerTimeout);
                        }

                    } else {
                        self.indicator.css({
                            'top': "-" + self.indicatorHeight + "px",
                            'transition': 'top 300ms ease'
                        });
                        elem.css({
                            'transform': 'translateY(-' + self.indicatorHeight + 'px)',
                            'transition': 'transform 300ms ease'
                        });
                    }
                    top = 0;
                }
                setTimeout(function() {
                    elem.css({
                        'transition': ''
                    });
                    self.indicator.css({
                        'transition': ''
                    });
                    $(document.body).unbind('touchmove.' + pluginName);
                    self.elast = true;
                }, 300);
            });
        },
        done: function() {
            var self = this;
            var elem = self.elem;
            if (self.doneTimeout) {
                clearTimeout(self.doneTimeout);
                self.doneTimeout = null;
            }
            self.indicator.css({
                'top': "-" + self.indicatorHeight + "px",
                'transition': 'top 300ms ease'
            });
            elem.css({
                'transform': 'translateY(-' + self.indicatorHeight + 'px)',
                'transition': 'transform 300ms ease'
            });
            setTimeout(function() {
                self.spinner.removeClass('rotateLoop');
                self.isSpinning = false;
                self.spinnerRotation = 0;
                self.spinner.css('opacity', '0');
                elem.css({
                    'transition': ''
                });
                self.indicator.css({
                    'transition': ''
                });
                $(document.body).unbind('touchmove.' + pluginName);
                self.elast = true;
                self.inProgress = false;
            }, 300);
        }
    };
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

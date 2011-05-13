/* tooltipsy by Brian Cray
 * Lincensed under GPL2 - http://www.gnu.org/licenses/gpl-2.0.html
 * Option quick reference:
 *  - offset: Tooltipsy distance from element or mouse cursor, dependent on alignTo setting. Set as array [x, y] (Defaults to [0, -1])
 *  - alignTo: "element" or "cursor" (Defaults to "element")
 *  - className: DOM class for styling tooltips with CSS. Defaults to "tooltipsy"
 *  - content: HTML or text content of tooltip. Defaults to "" (empty string), which pulls content from target element's title attribute
 *  - show: function(event, tooltip) to show the tooltip. Defaults to a show(100) effect
 *  - hide: function(event, tooltip) to hide the tooltip. Defaults to a fadeOut(100) effect
 * More information visit http://tooltipsy.com/
 */
 
(function($){
    $.tooltipsy = function(el, options){
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.random = parseInt(Math.random()*10000);
        base.shown = false;
        base.width = 0;
        base.height = 0;

        base.$el.data("tooltipsy", base);

        base.init = function() {
            base.settings = $.extend({},$.tooltipsy.defaults, options);
            
            base.$el.bind('mouseenter', function (e) {
                if (base.shown == false) {
                    base.shown = true;
                    base.title = base.$el.attr('title') || '';
                    base.$el.attr('title', '');
                    base.$tipsy = $('<div id="tooltipsy' + base.random + '">').appendTo('body').css({position: 'fixed', zIndex: '999'}).hide();
                    base.$tip = $('<div class="' + base.settings.className + '">').appendTo(base.$tipsy).html(base.settings.content != '' ? base.settings.content : base.title);
                    base.width = base.$tipsy.outerWidth();
                    base.height = base.$tipsy.outerHeight();
                }

                if (base.settings.alignTo == 'cursor') {
                    var tip_position = [e.pageX - window.pageXOffset + base.settings.offset[0], e.pageY - window.pageYOffset + base.settings.offset[1]];
                    var tip_css = {top: tip_position[1] + 'px', right: $(window).width() - tip_position[0] + 'px', left: 'auto'};
                }
                else {
                    var tip_position = [
                        (function (pos) {
                            if (base.settings.offset[0] < 0) {
                                return (pos.left - window.pageXOffset) - Math.abs(base.settings.offset[0]) - base.width;
                            }
                            else if (base.settings.offset[0] == 0) {
                                return (pos.left - window.pageXOffset) - ((base.width - base.$el.outerWidth()) / 2);
                            }
                            else {
                                return (pos.left - window.pageXOffset) + base.$el.outerWidth() + base.settings.offset[0];
                            }
                        })(base.$el.offset()),
                        (function (pos) {
                            if (base.settings.offset[1] < 0) {
                                return (pos.top - window.pageYOffset) - Math.abs(base.settings.offset[1]) - base.height;
                            }
                            else if (base.settings.offset[1] == 0) {
                                return (pos.top - window.pageYOffset) - ((base.height - base.$el.outerHeight()) / 2);
                            }
                            else {
                                return (pos.top - window.pageYOffset) + base.$el.outerHeight() + base.settings.offset[1];
                            }
                        })(base.$el.offset())
                    ];
                }
                base.$tipsy.css({top: tip_position[1] + 'px', left: tip_position[0] + 'px'});
                base.settings.show(e, base.$tipsy.stop(true, true));
            }).bind('mouseleave', function (e) {
                if (e.relatedTarget == base.$tip[0]) {
                    base.$tip.bind('mouseleave', function (e) {
                        if (e.relatedTarget == base.$el[0]) {
                            return;
                        }
                        base.settings.hide(e, base.$tipsy.stop(true, true));
                    });
                    return;
                }
                base.settings.hide(e, base.$tipsy.stop(true, true));
            });
        };

        base.init();
    };

    $.tooltipsy.defaults = {
        offset: [0, -1],
        alignTo: 'element',
        className: 'tooltipsy',
        content: '',
        show: function (e, $el) {
            $el.css('opacity', '1').show(100);
        },
        hide: function (e, $el) {
            $el.fadeOut(100);
        }
    };

    $.fn.tooltipsy = function(options) {
        return this.each(function() {
            new $.tooltipsy(this, options);
        });
    };

})(jQuery);

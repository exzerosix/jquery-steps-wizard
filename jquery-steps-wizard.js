/*!
 * JQuery Steps Wizard - A wizard form plugin for jQuery
 * 
 * @version        1.0.0
 * @since          2026-02-05
 * @author         Joey Sauva
 * 
 * Copyright (c) 2026 Joey Sauva
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

!function (t) { 
    var e = { 
        init: function (a) { 
            return this.each((function () { 
                var i = t.extend({}, t.fn.jsteps.defaults, a), 
                    n = t(this).data("options", i), 
                    r = n.attr("id"); 
                r || (r = "jsteps-" + t("." + n.attr("class")).index(this), n.attr("id", r));
                // Initialize skipped steps array
                n.data("skippedSteps", i.skipSteps || []);
                e._build.call(n) 
            })) 
        },
        setSkipSteps: function(steps) {
            this.data("skippedSteps", steps);
            e._updateTabStates.call(this);
            return this;
        },
        skipStep: function(step) {
            var skippedSteps = this.data("skippedSteps") || [];
            if (skippedSteps.indexOf(step) === -1) {
                skippedSteps.push(step);
                this.data("skippedSteps", skippedSteps);
                e._updateTabStates.call(this);
            }
            return this;
        },
        unskipStep: function(step) {
            var skippedSteps = this.data("skippedSteps") || [];
            var index = skippedSteps.indexOf(step);
            if (index !== -1) {
                skippedSteps.splice(index, 1);
                this.data("skippedSteps", skippedSteps);
                e._updateTabStates.call(this);
            }
            return this;
        },
        clearSkipSteps: function() {
            this.data("skippedSteps", []);
            e._updateTabStates.call(this);
            return this;
        },
        getSkippedSteps: function() {
            return this.data("skippedSteps") || [];
        },
        _updateTabStates: function() {
            var a = this,
                n = a.attr("id"),
                skipped = a.data("skippedSteps") || [];
            
            t("#" + n + "-titles").children().each(function(index) {
                if (skipped.indexOf(index + 1) !== -1) {
                    t(this).addClass("disabled-step").css({
                        "opacity": "0.5",
                        "cursor": "not-allowed"
                    });
                } else {
                    t(this).removeClass("disabled-step").css({
                        "opacity": "1",
                        "cursor": "pointer"
                    });
                }
            });
        },
        _build: function () { 
            var a = this, 
                i = a.data("options"), 
                n = a.attr("id"), 
                r = t("<ul/>", { id: n + "-titles", class: "jsteps-titles" }); 
            i.titleTarget ? t(i.titleTarget).html(r) : r.insertBefore(a), 
            i.validate && (jQuery.validator.setDefaults({ ignore: i.ignore }), a.append('<div class="jsteps-error"/>')),
            // Hide the finish button initially
            a.find(".finish").hide(),
            e._renderSteps.call(a) 
        }, 
        _renderSteps: function () { 
            var a = this, 
                i = a.data("options"), 
                n = a.attr("id"), 
                r = a.children("fieldset"), 
                l = t("#" + n + "-titles").empty(); 
            r.each((function (s) { 
                var c = t(this).addClass("step").attr("id", n + "-step-" + s); 
                c.find("." + n + "-buttons").remove(), 
                c.append('<p id="' + n + "-buttons-" + s + '" class="' + n + '-buttons"/>'); 
                var d = c.children("legend"); 
                i.legend || d.hide(); 
                var o = ""; 
                i.description && d.length && (o = "<span>" + d.html() + "</span>"); 
                var p = c.attr("title"); 
                p = p ? "<div>" + p + "</div>" : "--";
                
                // Create clickable tab
                var tabItem = t("<li>" + p + o + "</li>")
                    .css("cursor", "pointer")
                    .click((function(index) {
                        return async function() {
                            var targetStep = index + 1;
                            var skippedSteps = a.data("skippedSteps") || [];
                            
                            // Check if this step is in the skipped list
                            if (skippedSteps.indexOf(targetStep) !== -1) {
                                return false;
                            }
                            
                            // Allow navigation if no validation or if current step is valid
                            if (i.validate) {
                                var currentStep = l.children(".current-step").index();
                                var currentFieldset = t("#" + n + "-step-" + currentStep);
                                if (currentFieldset.length && !currentFieldset.find(":input").valid()) {
                                    return false;
                                }
                            }
                            
                            // Call the step function to navigate
                            e.step.call(a, targetStep);
                        };
                    })(s));
                    
                l.append(tabItem);
                
                // Handle button creation based on step position
                if (0 === s) {
                    // First step
                    if (r.length > 1) {
                        e.createNextButton.call(a, s);
                    }
                } else if (s === r.length - 1) {
                    // Last step - show back button only, hide next button
                    e.createBackButton.call(a, s);
                    c.hide();
                } else {
                    // Middle steps - show back and next buttons
                    e.createBackButton.call(a, s);
                    e.createNextButton.call(a, s);
                    c.hide();
                }
            })), 
            l.children().first().addClass("current-step");
            
            // Update tab states after rendering
            e._updateTabStates.call(a);
        }, 
        createBackButton: function (a) { 
            var i = this, 
                n = i.attr("id"), 
                r = i.data("options"); 
            t("<a/>", { 
                href: "javascript:void(0);", 
                class: "button-back", 
                html: r.backLabel 
            }).click((async function () { 
                var result = await e._runCallback.call(i, r.back, a);
                
                if (false !== result) {
                    var targetStep = "number" == typeof result ? result : a;
                    var skippedSteps = i.data("skippedSteps") || [];
                    
                    // Skip over any skipped steps when going back
                    while (skippedSteps.indexOf(targetStep) !== -1 && targetStep > 1) {
                        targetStep--;
                    }
                    
                    e.step.call(i, targetStep);
                }
            })).appendTo(t("#" + n + "-buttons-" + a)) 
        }, 
        createNextButton: function (a) { 
            var i = this, 
                n = i.attr("id"), 
                r = i.data("options"); 
            t("<a/>", { 
                href: "javascript:void(0);", 
                class: "button-next", 
                html: r.nextLabel 
            }).click((async function () { 
                if (r.validate) { 
                    var l = t("#" + n + "-step-" + a); 
                    if (t(".jsteps-error").empty(), !l.find(":input").valid()) return !1 
                } 
                var s = await e._runCallback.call(i, r.next, a + 2); 
                !1 !== s && ("number" == typeof s ? e.step.call(i, s) : e.step.call(i, a + 2)) 
            })).appendTo(t("#" + n + "-buttons-" + a)) 
        },
        _runCallback: async function (t, e) { 
            if (!t) return !0; 
            var a = t.call(this, e); 
            return a instanceof Promise && (a = await a), a 
        }, 
        step: function (e) { 
            e--; 
            var a = this.children("fieldset"), 
                i = this.data("options"),
                n = this.attr("id"); 
            
            e > a.length - 1 && (e = a.length - 1);
            e < 0 && (e = 0);
            
            a.hide().eq(e).show();
            t("#" + n + "-titles").children().removeClass("current-step").eq(e).addClass("current-step");
            
            // Show/hide finish button based on current step
            if (e === a.length - 1) {
                // Last step - show finish button
                this.find(".finish").show();
            } else {
                // Not last step - hide finish button
                this.find(".finish").hide();
            }
            
            i.select && i.select.call(this, e + 1);
            
            return this;
        }, 
        addStep: function (t, a) { 
            var i = this; 
            return void 0 === a ? i.append(t) : i.children("fieldset").eq(a).before(t), 
            e._renderSteps.call(i), 
            i 
        }, 
        removeStep: function (t) { 
            var a = this; 
            return a.children("fieldset").eq(t - 1).remove(), 
            e._renderSteps.call(a), 
            a 
        } 
    }; 
    t.fn.jsteps = function (a) { 
        return e[a] ? e[a].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof a && a ? void t.error("Method " + a + " does not exist!") : e.init.apply(this, arguments) 
    }, 
    t.fn.jsteps.defaults = { 
        back: void 0, 
        backLabel: "&lt; Back", 
        next: void 0, 
        nextLabel: "Next &gt;", 
        finish: void 0, 
        validate: !1, 
        legend: !0, 
        description: !0, 
        titleTarget: void 0, 
        select: void 0, 
        ignore: "",
        skipSteps: []
    } 
}(jQuery);

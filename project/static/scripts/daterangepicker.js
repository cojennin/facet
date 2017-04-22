! function(a, b) {
    if ("function" == typeof define && define.amd) define(["moment", "jquery", "exports"], function(c, d, e) {
        a.daterangepicker = b(a, e, c, d)
    });
    else if ("undefined" != typeof exports) {
        var c = require("moment"),
            d = "undefined" != typeof window ? window.jQuery : void 0;
        if (!d) try {
            d = require("jquery"), d.fn || (d.fn = {})
        } catch (e) {
            if (!d) throw new Error("jQuery dependency not found")
        }
        b(a, exports, c, d)
    } else a.daterangepicker = b(a, {}, a.moment || moment, a.jQuery || a.Zepto || a.ender || a.$)
}(this || {}, function(a, b, c, d) {
    var e = function(a, b, e) {
        if (this.parentEl = "body", this.element = d(a), this.startDate = c().startOf("day"), this.endDate = c().endOf("day"), this.minDate = !1, this.maxDate = !1, this.dateLimit = !1, this.autoApply = !1, this.singleDatePicker = !1, this.showDropdowns = !1, this.showWeekNumbers = !1, this.timePicker = !1, this.timePicker24Hour = !1, this.timePickerIncrement = 1, this.timePickerSeconds = !1, this.linkedCalendars = !0, this.autoUpdateInput = !0, this.ranges = {}, this.opens = "right", this.element.hasClass("pull-right") && (this.opens = "left"), this.drops = "down", this.element.hasClass("dropup") && (this.drops = "up"), this.buttonClasses = "btn btn-sm", this.applyClass = "btn-success", this.cancelClass = "btn-default", this.locale = {
                format: "MM/DD/YYYY",
                separator: " - ",
                applyLabel: "Apply",
                cancelLabel: "Cancel",
                weekLabel: "W",
                customRangeLabel: "Custom Range",
                daysOfWeek: c.weekdaysMin(),
                monthNames: c.monthsShort(),
                firstDay: c.localeData().firstDayOfWeek()
            }, this.callback = function() {}, this.isShowing = !1, this.leftCalendar = {}, this.rightCalendar = {}, ("object" != typeof b || null === b) && (b = {}), b = d.extend(this.element.data(), b), "string" != typeof b.template && (b.template = '<div class="daterangepicker dropdown-menu"><div class="calendar left"><div class="daterangepicker_input"><input class="input-mini" type="text" name="daterangepicker_start" value="" /><i class="fa fa-calendar glyphicon glyphicon-calendar"></i><div class="calendar-time"><div></div><i class="fa fa-clock-o glyphicon glyphicon-time"></i></div></div><div class="calendar-table"></div></div><div class="calendar right"><div class="daterangepicker_input"><input class="input-mini" type="text" name="daterangepicker_end" value="" /><i class="fa fa-calendar glyphicon glyphicon-calendar"></i><div class="calendar-time"><div></div><i class="fa fa-clock-o glyphicon glyphicon-time"></i></div></div><div class="calendar-table"></div></div><div class="ranges"><div class="range_inputs"><button class="applyBtn" disabled="disabled" type="button"></button> <button class="cancelBtn" type="button"></button></div></div></div>'), this.parentEl = d(b.parentEl && d(b.parentEl).length ? b.parentEl : this.parentEl), this.container = d(b.template).appendTo(this.parentEl), "object" == typeof b.locale && ("string" == typeof b.locale.format && (this.locale.format = b.locale.format), "string" == typeof b.locale.separator && (this.locale.separator = b.locale.separator), "object" == typeof b.locale.daysOfWeek && (this.locale.daysOfWeek = b.locale.daysOfWeek.slice()), "object" == typeof b.locale.monthNames && (this.locale.monthNames = b.locale.monthNames.slice()), "number" == typeof b.locale.firstDay && (this.locale.firstDay = b.locale.firstDay), "string" == typeof b.locale.applyLabel && (this.locale.applyLabel = b.locale.applyLabel), "string" == typeof b.locale.cancelLabel && (this.locale.cancelLabel = b.locale.cancelLabel), "string" == typeof b.locale.weekLabel && (this.locale.weekLabel = b.locale.weekLabel), "string" == typeof b.locale.customRangeLabel && (this.locale.customRangeLabel = b.locale.customRangeLabel)), "string" == typeof b.startDate && (this.startDate = c(b.startDate, this.locale.format)), "string" == typeof b.endDate && (this.endDate = c(b.endDate, this.locale.format)), "string" == typeof b.minDate && (this.minDate = c(b.minDate, this.locale.format)), "string" == typeof b.maxDate && (this.maxDate = c(b.maxDate, this.locale.format)), "object" == typeof b.startDate && (this.startDate = c(b.startDate)), "object" == typeof b.endDate && (this.endDate = c(b.endDate)), "object" == typeof b.minDate && (this.minDate = c(b.minDate)), "object" == typeof b.maxDate && (this.maxDate = c(b.maxDate)), this.minDate && this.startDate.isBefore(this.minDate) && (this.startDate = this.minDate.clone()), this.maxDate && this.endDate.isAfter(this.maxDate) && (this.endDate = this.maxDate.clone()), "string" == typeof b.applyClass && (this.applyClass = b.applyClass), "string" == typeof b.cancelClass && (this.cancelClass = b.cancelClass), "object" == typeof b.dateLimit && (this.dateLimit = b.dateLimit), "string" == typeof b.opens && (this.opens = b.opens), "string" == typeof b.drops && (this.drops = b.drops), "boolean" == typeof b.showWeekNumbers && (this.showWeekNumbers = b.showWeekNumbers), "string" == typeof b.buttonClasses && (this.buttonClasses = b.buttonClasses), "object" == typeof b.buttonClasses && (this.buttonClasses = b.buttonClasses.join(" ")), "boolean" == typeof b.showDropdowns && (this.showDropdowns = b.showDropdowns), "boolean" == typeof b.singleDatePicker && (this.singleDatePicker = b.singleDatePicker, this.singleDatePicker && (this.endDate = this.startDate.clone())), "boolean" == typeof b.timePicker && (this.timePicker = b.timePicker), "boolean" == typeof b.timePickerSeconds && (this.timePickerSeconds = b.timePickerSeconds), "number" == typeof b.timePickerIncrement && (this.timePickerIncrement = b.timePickerIncrement), "boolean" == typeof b.timePicker24Hour && (this.timePicker24Hour = b.timePicker24Hour), "boolean" == typeof b.autoApply && (this.autoApply = b.autoApply), "boolean" == typeof b.autoUpdateInput && (this.autoUpdateInput = b.autoUpdateInput), "boolean" == typeof b.linkedCalendars && (this.linkedCalendars = b.linkedCalendars), "function" == typeof b.isInvalidDate && (this.isInvalidDate = b.isInvalidDate), 0 != this.locale.firstDay)
            for (var f = this.locale.firstDay; f > 0;) this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift()), f--;
        var g, h, i;
        if ("undefined" == typeof b.startDate && "undefined" == typeof b.endDate && d(this.element).is("input[type=text]")) {
            var j = d(this.element).val(),
                k = j.split(this.locale.separator);
            g = h = null, 2 == k.length ? (g = c(k[0], this.locale.format), h = c(k[1], this.locale.format)) : this.singleDatePicker && "" !== j && (g = c(j, this.locale.format), h = c(j, this.locale.format)), null !== g && null !== h && (this.setStartDate(g), this.setEndDate(h))
        }
        if ("object" == typeof b.ranges) {
            for (i in b.ranges) {
                g = "string" == typeof b.ranges[i][0] ? c(b.ranges[i][0], this.locale.format) : c(b.ranges[i][0]), h = "string" == typeof b.ranges[i][1] ? c(b.ranges[i][1], this.locale.format) : c(b.ranges[i][1]), this.minDate && g.isBefore(this.minDate) && (g = this.minDate.clone());
                var l = this.maxDate;
                if (this.dateLimit && g.clone().add(this.dateLimit).isAfter(l) && (l = g.clone().add(this.dateLimit)), l && h.isAfter(l) && (h = l.clone()), !(this.minDate && h.isBefore(this.minDate) || l && g.isAfter(l))) {
                    var m = document.createElement("textarea");
                    m.innerHTML = i, rangeHtml = m.value, this.ranges[rangeHtml] = [g, h]
                }
            }
            var n = "<ul>";
            for (i in this.ranges) n += "<li>" + i + "</li>";
            n += "<li>" + this.locale.customRangeLabel + "</li>", n += "</ul>", this.container.find(".ranges").prepend(n)
        }
        if ("function" == typeof e && (this.callback = e), this.timePicker || (this.startDate = this.startDate.startOf("day"), this.endDate = this.endDate.endOf("day"), this.container.find(".calendar-time").hide()), this.timePicker && this.autoApply && (this.autoApply = !1), this.autoApply && "object" != typeof b.ranges ? this.container.find(".ranges").hide() : this.autoApply && this.container.find(".applyBtn, .cancelBtn").addClass("hide"), this.singleDatePicker && (this.container.addClass("single"), this.container.find(".calendar.left").addClass("single"), this.container.find(".calendar.left").show(), this.container.find(".calendar.right").hide(), this.container.find(".daterangepicker_input input, .daterangepicker_input i").hide(), this.timePicker || this.container.find(".ranges").hide()), "undefined" != typeof b.ranges || this.singleDatePicker || this.container.addClass("show-calendar"), this.container.addClass("opens" + this.opens), "undefined" != typeof b.ranges && "right" == this.opens) {
            var o = this.container.find(".ranges"),
                p = o.clone();
            o.remove(), this.container.find(".calendar.left").parent().prepend(p)
        }
        this.container.find(".applyBtn, .cancelBtn").addClass(this.buttonClasses), this.applyClass.length && this.container.find(".applyBtn").addClass(this.applyClass), this.cancelClass.length && this.container.find(".cancelBtn").addClass(this.cancelClass), this.container.find(".applyBtn").html(this.locale.applyLabel), this.container.find(".cancelBtn").html(this.locale.cancelLabel), this.container.find(".calendar").on("click.daterangepicker", ".prev", d.proxy(this.clickPrev, this)).on("click.daterangepicker", ".next", d.proxy(this.clickNext, this)).on("click.daterangepicker", "td.available", d.proxy(this.clickDate, this)).on("mouseenter.daterangepicker", "td.available", d.proxy(this.hoverDate, this)).on("mouseleave.daterangepicker", "td.available", d.proxy(this.updateFormInputs, this)).on("change.daterangepicker", "select.yearselect", d.proxy(this.monthOrYearChanged, this)).on("change.daterangepicker", "select.monthselect", d.proxy(this.monthOrYearChanged, this)).on("change.daterangepicker", "select.hourselect,select.minuteselect,select.secondselect,select.ampmselect", d.proxy(this.timeChanged, this)).on("click.daterangepicker", ".daterangepicker_input input", d.proxy(this.showCalendars, this)).on("change.daterangepicker", ".daterangepicker_input input", d.proxy(this.formInputsChanged, this)), this.container.find(".ranges").on("click.daterangepicker", "button.applyBtn", d.proxy(this.clickApply, this)).on("click.daterangepicker", "button.cancelBtn", d.proxy(this.clickCancel, this)).on("click.daterangepicker", "li", d.proxy(this.clickRange, this)).on("mouseenter.daterangepicker", "li", d.proxy(this.hoverRange, this)).on("mouseleave.daterangepicker", "li", d.proxy(this.updateFormInputs, this)), this.element.is("input") ? this.element.on({
            "click.daterangepicker": d.proxy(this.show, this),
            "focus.daterangepicker": d.proxy(this.show, this),
            "keyup.daterangepicker": d.proxy(this.elementChanged, this),
            "keydown.daterangepicker": d.proxy(this.keydown, this)
        }) : this.element.on("click.daterangepicker", d.proxy(this.toggle, this)), this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput ? (this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format)), this.element.trigger("change")) : this.element.is("input") && this.autoUpdateInput && (this.element.val(this.startDate.format(this.locale.format)), this.element.trigger("change"))
    };
    e.prototype = {
        constructor: e,
        setStartDate: function(a) {
            "string" == typeof a && (this.startDate = c(a, this.locale.format)), "object" == typeof a && (this.startDate = c(a)), this.timePicker || (this.startDate = this.startDate.startOf("day")), this.timePicker && this.timePickerIncrement && this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement), this.minDate && this.startDate.isBefore(this.minDate) && (this.startDate = this.minDate), this.maxDate && this.startDate.isAfter(this.maxDate) && (this.startDate = this.maxDate), this.isShowing || this.updateElement(), this.updateMonthsInView()
        },
        setEndDate: function(a) {
            "string" == typeof a && (this.endDate = c(a, this.locale.format)), "object" == typeof a && (this.endDate = c(a)), this.timePicker || (this.endDate = this.endDate.endOf("day")), this.timePicker && this.timePickerIncrement && this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement), this.endDate.isBefore(this.startDate) && (this.endDate = this.startDate.clone()), this.maxDate && this.endDate.isAfter(this.maxDate) && (this.endDate = this.maxDate), this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate) && (this.endDate = this.startDate.clone().add(this.dateLimit)), this.isShowing || this.updateElement(), this.updateMonthsInView()
        },
        isInvalidDate: function() {
            return !1
        },
        updateView: function() {
            this.timePicker && (this.renderTimePicker("left"), this.renderTimePicker("right"), this.endDate ? this.container.find(".right .calendar-time select").removeAttr("disabled").removeClass("disabled") : this.container.find(".right .calendar-time select").attr("disabled", "disabled").addClass("disabled")), this.endDate ? (this.container.find('input[name="daterangepicker_end"]').removeClass("active"), this.container.find('input[name="daterangepicker_start"]').addClass("active")) : (this.container.find('input[name="daterangepicker_end"]').addClass("active"), this.container.find('input[name="daterangepicker_start"]').removeClass("active")), this.updateMonthsInView(), this.updateCalendars(), this.updateFormInputs()
        },
        updateMonthsInView: function() {
            if (this.endDate) {
                if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format("YYYY-MM") == this.leftCalendar.month.format("YYYY-MM") || this.startDate.format("YYYY-MM") == this.rightCalendar.month.format("YYYY-MM")) && (this.endDate.format("YYYY-MM") == this.leftCalendar.month.format("YYYY-MM") || this.endDate.format("YYYY-MM") == this.rightCalendar.month.format("YYYY-MM"))) return;
                this.leftCalendar.month = this.startDate.clone().date(2), this.linkedCalendars || this.endDate.month() == this.startDate.month() && this.endDate.year() == this.startDate.year() ? this.rightCalendar.month = this.startDate.clone().date(2).add(1, "month") : this.rightCalendar.month = this.endDate.clone().date(2)
            } else this.leftCalendar.month.format("YYYY-MM") != this.startDate.format("YYYY-MM") && this.rightCalendar.month.format("YYYY-MM") != this.startDate.format("YYYY-MM") && (this.leftCalendar.month = this.startDate.clone().date(2), this.rightCalendar.month = this.startDate.clone().date(2).add(1, "month"))
        },
        updateCalendars: function() {
            if (this.timePicker) {
                var a, b, c;
                if (this.endDate) {
                    if (a = parseInt(this.container.find(".left .hourselect").val(), 10), b = parseInt(this.container.find(".left .minuteselect").val(), 10), c = this.timePickerSeconds ? parseInt(this.container.find(".left .secondselect").val(), 10) : 0, !this.timePicker24Hour) {
                        var d = this.container.find(".left .ampmselect").val();
                        "PM" === d && 12 > a && (a += 12), "AM" === d && 12 === a && (a = 0)
                    }
                } else if (a = parseInt(this.container.find(".right .hourselect").val(), 10), b = parseInt(this.container.find(".right .minuteselect").val(), 10), c = this.timePickerSeconds ? parseInt(this.container.find(".right .secondselect").val(), 10) : 0, !this.timePicker24Hour) {
                    var d = this.container.find(".left .ampmselect").val();
                    "PM" === d && 12 > a && (a += 12), "AM" === d && 12 === a && (a = 0)
                }
                this.leftCalendar.month.hour(a).minute(b).second(c), this.rightCalendar.month.hour(a).minute(b).second(c)
            }
            if (this.renderCalendar("left"), this.renderCalendar("right"), this.container.find(".ranges li").removeClass("active"), null != this.endDate) {
                var e = !0,
                    f = 0;
                for (var g in this.ranges) {
                    if (this.timePicker) {
                        if (this.startDate.isSame(this.ranges[g][0]) && this.endDate.isSame(this.ranges[g][1])) {
                            e = !1, this.chosenLabel = this.container.find(".ranges li:eq(" + f + ")").addClass("active").html();
                            break
                        }
                    } else if (this.startDate.format("YYYY-MM-DD") == this.ranges[g][0].format("YYYY-MM-DD") && this.endDate.format("YYYY-MM-DD") == this.ranges[g][1].format("YYYY-MM-DD")) {
                        e = !1, this.chosenLabel = this.container.find(".ranges li:eq(" + f + ")").addClass("active").html();
                        break
                    }
                    f++
                }
                e && (this.chosenLabel = this.container.find(".ranges li:last").addClass("active").html(), this.showCalendars())
            }
        },
        renderCalendar: function(a) {
            var b = "left" == a ? this.leftCalendar : this.rightCalendar,
                e = b.month.month(),
                f = b.month.year(),
                g = b.month.hour(),
                h = b.month.minute(),
                i = b.month.second(),
                j = c([f, e]).daysInMonth(),
                k = c([f, e, 1]),
                l = c([f, e, j]),
                m = c(k).subtract(1, "month").month(),
                n = c(k).subtract(1, "month").year(),
                o = c([n, m]).daysInMonth(),
                p = k.day(),
                b = [];
            b.firstDay = k, b.lastDay = l;
            for (var q = 0; 6 > q; q++) b[q] = [];
            var r = o - p + this.locale.firstDay + 1;
            r > o && (r -= 7), p == this.locale.firstDay && (r = o - 6);
            for (var s, t, u = c([n, m, r, 12, h, i]), q = 0, s = 0, t = 0; 42 > q; q++, s++, u = c(u).add(24, "hour")) q > 0 && s % 7 === 0 && (s = 0, t++), b[t][s] = u.clone().hour(g).minute(h).second(i), u.hour(12), this.minDate && b[t][s].format("YYYY-MM-DD") == this.minDate.format("YYYY-MM-DD") && b[t][s].isBefore(this.minDate) && "left" == a && (b[t][s] = this.minDate.clone()), this.maxDate && b[t][s].format("YYYY-MM-DD") == this.maxDate.format("YYYY-MM-DD") && b[t][s].isAfter(this.maxDate) && "right" == a && (b[t][s] = this.maxDate.clone());
            "left" == a ? this.leftCalendar.calendar = b : this.rightCalendar.calendar = b;
            var v = "left" == a ? this.minDate : this.startDate,
                w = this.maxDate,
                x = ("left" == a ? this.startDate : this.endDate, '<table class="table-condensed">');
            x += "<thead>", x += "<tr>", this.showWeekNumbers && (x += "<th></th>"), x += v && !v.isBefore(b.firstDay) || this.linkedCalendars && "left" != a ? "<th></th>" : '<th class="prev available"><i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i></th>';
            var y = this.locale.monthNames[b[1][1].month()] + b[1][1].format(" YYYY");
            if (this.showDropdowns) {
                for (var z = b[1][1].month(), A = b[1][1].year(), B = w && w.year() || A + 5, C = v && v.year() || A - 50, D = A == C, E = A == B, F = '<select class="monthselect">', G = 0; 12 > G; G++) F += (!D || G >= v.month()) && (!E || G <= w.month()) ? "<option value='" + G + "'" + (G === z ? " selected='selected'" : "") + ">" + this.locale.monthNames[G] + "</option>" : "<option value='" + G + "'" + (G === z ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[G] + "</option>";
                F += "</select>";
                for (var H = '<select class="yearselect">', I = C; B >= I; I++) H += '<option value="' + I + '"' + (I === A ? ' selected="selected"' : "") + ">" + I + "</option>";
                H += "</select>", y = F + H
            }
            if (x += '<th colspan="5" class="month">' + y + "</th>", x += w && !w.isAfter(b.lastDay) || this.linkedCalendars && "right" != a && !this.singleDatePicker ? "<th></th>" : '<th class="next available"><i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i></th>', x += "</tr>", x += "<tr>", this.showWeekNumbers && (x += '<th class="week">' + this.locale.weekLabel + "</th>"), d.each(this.locale.daysOfWeek, function(a, b) {
                    x += "<th>" + b + "</th>"
                }), x += "</tr>", x += "</thead>", x += "<tbody>", null == this.endDate && this.dateLimit) {
                var J = this.startDate.clone().add(this.dateLimit).endOf("day");
                (!w || J.isBefore(w)) && (w = J)
            }
            for (var t = 0; 6 > t; t++) {
                x += "<tr>", this.showWeekNumbers && (x += '<td class="week">' + b[t][0].week() + "</td>");
                for (var s = 0; 7 > s; s++) {
                    var K = [];
                    b[t][s].isSame(new Date, "day") && K.push("today"), b[t][s].isoWeekday() > 5 && K.push("weekend"), b[t][s].month() != b[1][1].month() && K.push("off"), this.minDate && b[t][s].isBefore(this.minDate, "day") && K.push("off", "disabled"), w && b[t][s].isAfter(w, "day") && K.push("off", "disabled"), this.isInvalidDate(b[t][s]) && K.push("off", "disabled"), b[t][s].format("YYYY-MM-DD") == this.startDate.format("YYYY-MM-DD") && K.push("active", "start-date"), null != this.endDate && b[t][s].format("YYYY-MM-DD") == this.endDate.format("YYYY-MM-DD") && K.push("active", "end-date"), null != this.endDate && b[t][s] > this.startDate && b[t][s] < this.endDate && K.push("in-range");
                    for (var L = "", M = !1, q = 0; q < K.length; q++) L += K[q] + " ", "disabled" == K[q] && (M = !0);
                    M || (L += "available"), x += '<td class="' + L.replace(/^\s+|\s+$/g, "") + '" data-title="r' + t + "c" + s + '">' + b[t][s].date() + "</td>"
                }
                x += "</tr>"
            }
            x += "</tbody>", x += "</table>", this.container.find(".calendar." + a + " .calendar-table").html(x)
        },
        renderTimePicker: function(a) {
            var b, c, d, e = this.maxDate;
            !this.dateLimit || this.maxDate && !this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate) || (e = this.startDate.clone().add(this.dateLimit)), "left" == a ? (c = this.startDate.clone(), d = this.minDate) : "right" == a && (c = this.endDate ? this.endDate.clone() : this.startDate.clone(), d = this.startDate), b = '<select class="hourselect">';
            for (var f = this.timePicker24Hour ? 0 : 1, g = this.timePicker24Hour ? 23 : 12, h = f; g >= h; h++) {
                var i = h;
                this.timePicker24Hour || (i = c.hour() >= 12 ? 12 == h ? 12 : h + 12 : 12 == h ? 0 : h);
                var j = c.clone().hour(i),
                    k = !1;
                d && j.minute(59).isBefore(d) && (k = !0), e && j.minute(0).isAfter(e) && (k = !0), b += i != c.hour() || k ? k ? '<option value="' + h + '" disabled="disabled" class="disabled">' + h + "</option>" : '<option value="' + h + '">' + h + "</option>" : '<option value="' + h + '" selected="selected">' + h + "</option>"
            }
            b += "</select> ", b += ': <select class="minuteselect">';
            for (var h = 0; 60 > h; h += this.timePickerIncrement) {
                var l = 10 > h ? "0" + h : h,
                    j = c.clone().minute(h),
                    k = !1;
                d && j.second(59).isBefore(d) && (k = !0), e && j.second(0).isAfter(e) && (k = !0), b += c.minute() != h || k ? k ? '<option value="' + h + '" disabled="disabled" class="disabled">' + l + "</option>" : '<option value="' + h + '">' + l + "</option>" : '<option value="' + h + '" selected="selected">' + l + "</option>"
            }
            if (b += "</select> ", this.timePickerSeconds) {
                b += ': <select class="secondselect">';
                for (var h = 0; 60 > h; h++) {
                    var l = 10 > h ? "0" + h : h,
                        j = c.clone().second(h),
                        k = !1;
                    d && j.isBefore(d) && (k = !0), e && j.isAfter(e) && (k = !0), b += c.second() != h || k ? k ? '<option value="' + h + '" disabled="disabled" class="disabled">' + l + "</option>" : '<option value="' + h + '">' + l + "</option>" : '<option value="' + h + '" selected="selected">' + l + "</option>"
                }
                b += "</select> "
            }
            if (!this.timePicker24Hour) {
                b += '<select class="ampmselect">';
                var m = "",
                    n = "";
                d && c.clone().hour(12).minute(0).second(0).isBefore(d) && (m = ' disabled="disabled" class="disabled"'), e && c.clone().hour(0).minute(0).second(0).isAfter(e) && (n = ' disabled="disabled" class="disabled"'), b += c.hour() >= 12 ? '<option value="AM"' + m + '>AM</option><option value="PM" selected="selected"' + n + ">PM</option>" : '<option value="AM" selected="selected"' + m + '>AM</option><option value="PM"' + n + ">PM</option>", b += "</select>"
            }
            this.container.find(".calendar." + a + " .calendar-time div").html(b)
        },
        updateFormInputs: function() {
            this.container.find("input[name=daterangepicker_start]").is(":focus") || this.container.find("input[name=daterangepicker_end]").is(":focus") || (this.container.find("input[name=daterangepicker_start]").val(this.startDate.format(this.locale.format)), this.endDate && this.container.find("input[name=daterangepicker_end]").val(this.endDate.format(this.locale.format)), this.singleDatePicker || this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)) ? this.container.find("button.applyBtn").removeAttr("disabled") : this.container.find("button.applyBtn").attr("disabled", "disabled"))
        },
        move: function() {
            var a, b = {
                    top: 0,
                    left: 0
                },
                c = d(window).width();
            this.parentEl.is("body") || (b = {
                top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                left: this.parentEl.offset().left - this.parentEl.scrollLeft()
            }, c = this.parentEl[0].clientWidth + this.parentEl.offset().left), a = "up" == this.drops ? this.element.offset().top - this.container.outerHeight() - b.top : this.element.offset().top + this.element.outerHeight() - b.top, this.container["up" == this.drops ? "addClass" : "removeClass"]("dropup"), "left" == this.opens ? (this.container.css({
                top: a,
                right: c - this.element.offset().left - this.element.outerWidth(),
                left: "auto"
            }), this.container.offset().left < 0 && this.container.css({
                right: "auto",
                left: 9
            })) : "center" == this.opens ? (this.container.css({
                top: a,
                left: this.element.offset().left - b.left + this.element.outerWidth() / 2 - this.container.outerWidth() / 2,
                right: "auto"
            }), this.container.offset().left < 0 && this.container.css({
                right: "auto",
                left: 9
            })) : (this.container.css({
                top: a,
                left: this.element.offset().left - b.left,
                right: "auto"
            }), this.container.offset().left + this.container.outerWidth() > d(window).width() && this.container.css({
                left: "auto",
                right: 0
            }))
        },
        show: function(a) {
            this.isShowing || (this._outsideClickProxy = d.proxy(function(a) {
                this.outsideClick(a)
            }, this), d(document).on("mousedown.daterangepicker", this._outsideClickProxy).on("touchend.daterangepicker", this._outsideClickProxy).on("click.daterangepicker", "[data-toggle=dropdown]", this._outsideClickProxy).on("focusin.daterangepicker", this._outsideClickProxy), d(window).on("resize.daterangepicker", d.proxy(function(a) {
                this.move(a)
            }, this)), this.oldStartDate = this.startDate.clone(), this.oldEndDate = this.endDate.clone(), this.updateView(), this.container.show(), this.move(), this.element.trigger("show.daterangepicker", this), this.isShowing = !0)
        },
        hide: function(a) {
            this.isShowing && (this.endDate || (this.startDate = this.oldStartDate.clone(), this.endDate = this.oldEndDate.clone()), this.startDate.isSame(this.oldStartDate) && this.endDate.isSame(this.oldEndDate) || this.callback(this.startDate, this.endDate, this.chosenLabel), this.updateElement(), d(document).off(".daterangepicker"), d(window).off(".daterangepicker"), this.container.hide(), this.element.trigger("hide.daterangepicker", this), this.isShowing = !1)
        },
        toggle: function(a) {
            this.isShowing ? this.hide() : this.show()
        },
        outsideClick: function(a) {
            var b = d(a.target);
            "focusin" == a.type || b.closest(this.element).length || b.closest(this.container).length || b.closest(".calendar-table").length || this.hide()
        },
        showCalendars: function() {
            this.container.addClass("show-calendar"), this.move(), this.element.trigger("showCalendar.daterangepicker", this)
        },
        hideCalendars: function() {
            this.container.removeClass("show-calendar"), this.element.trigger("hideCalendar.daterangepicker", this)
        },
        hoverRange: function(a) {
            if (!this.container.find("input[name=daterangepicker_start]").is(":focus") && !this.container.find("input[name=daterangepicker_end]").is(":focus")) {
                var b = a.target.innerHTML;
                if (b == this.locale.customRangeLabel) this.updateView();
                else {
                    var c = this.ranges[b];
                    this.container.find("input[name=daterangepicker_start]").val(c[0].format(this.locale.format)), this.container.find("input[name=daterangepicker_end]").val(c[1].format(this.locale.format))
                }
            }
        },
        clickRange: function(a) {
            var b = a.target.innerHTML;
            if (this.chosenLabel = b, b == this.locale.customRangeLabel) this.showCalendars();
            else {
                var c = this.ranges[b];
                this.startDate = c[0], this.endDate = c[1], this.timePicker || (this.startDate.startOf("day"), this.endDate.endOf("day")), this.hideCalendars(), this.clickApply()
            }
        },
        clickPrev: function(a) {
            var b = d(a.target).parents(".calendar");
            b.hasClass("left") ? (this.leftCalendar.month.subtract(1, "month"), this.linkedCalendars && this.rightCalendar.month.subtract(1, "month")) : this.rightCalendar.month.subtract(1, "month"), this.updateCalendars()
        },
        clickNext: function(a) {
            var b = d(a.target).parents(".calendar");
            b.hasClass("left") ? this.leftCalendar.month.add(1, "month") : (this.rightCalendar.month.add(1, "month"), this.linkedCalendars && this.leftCalendar.month.add(1, "month")), this.updateCalendars()
        },
        hoverDate: function(a) {
            if (!this.container.find("input[name=daterangepicker_start]").is(":focus") && !this.container.find("input[name=daterangepicker_end]").is(":focus") && d(a.target).hasClass("available")) {
                var b = d(a.target).attr("data-title"),
                    c = b.substr(1, 1),
                    e = b.substr(3, 1),
                    f = d(a.target).parents(".calendar"),
                    g = f.hasClass("left") ? this.leftCalendar.calendar[c][e] : this.rightCalendar.calendar[c][e];
                this.endDate ? this.container.find("input[name=daterangepicker_start]").val(g.format(this.locale.format)) : this.container.find("input[name=daterangepicker_end]").val(g.format(this.locale.format));
                var h = this.leftCalendar,
                    i = this.rightCalendar,
                    j = this.startDate;
                this.endDate || this.container.find(".calendar td").each(function(a, b) {
                    if (!d(b).hasClass("week")) {
                        var c = d(b).attr("data-title"),
                            e = c.substr(1, 1),
                            f = c.substr(3, 1),
                            k = d(b).parents(".calendar"),
                            l = k.hasClass("left") ? h.calendar[e][f] : i.calendar[e][f];
                        l.isAfter(j) && l.isBefore(g) ? d(b).addClass("in-range") : d(b).removeClass("in-range")
                    }
                })
            }
        },
        clickDate: function(a) {
            if (d(a.target).hasClass("available")) {
                var b = d(a.target).attr("data-title"),
                    c = b.substr(1, 1),
                    e = b.substr(3, 1),
                    f = d(a.target).parents(".calendar"),
                    g = f.hasClass("left") ? this.leftCalendar.calendar[c][e] : this.rightCalendar.calendar[c][e];
                if (this.endDate || g.isBefore(this.startDate)) {
                    if (this.timePicker) {
                        var h = parseInt(this.container.find(".left .hourselect").val(), 10);
                        if (!this.timePicker24Hour) {
                            var i = f.find(".ampmselect").val();
                            "PM" === i && 12 > h && (h += 12), "AM" === i && 12 === h && (h = 0)
                        }
                        var j = parseInt(this.container.find(".left .minuteselect").val(), 10),
                            k = this.timePickerSeconds ? parseInt(this.container.find(".left .secondselect").val(), 10) : 0;
                        g = g.clone().hour(h).minute(j).second(k)
                    }
                    this.endDate = null, this.setStartDate(g.clone())
                } else {
                    if (this.timePicker) {
                        var h = parseInt(this.container.find(".right .hourselect").val(), 10);
                        if (!this.timePicker24Hour) {
                            var i = this.container.find(".right .ampmselect").val();
                            "PM" === i && 12 > h && (h += 12), "AM" === i && 12 === h && (h = 0)
                        }
                        var j = parseInt(this.container.find(".right .minuteselect").val(), 10),
                            k = this.timePickerSeconds ? parseInt(this.container.find(".right .secondselect").val(), 10) : 0;
                        g = g.clone().hour(h).minute(j).second(k)
                    }
                    this.setEndDate(g.clone()), this.autoApply && this.clickApply()
                }
                this.singleDatePicker && (this.setEndDate(this.startDate), this.timePicker || this.clickApply()), this.updateView()
            }
        },
        clickApply: function(a) {
            this.hide(), this.element.trigger("apply.daterangepicker", this)
        },
        clickCancel: function(a) {
            this.startDate = this.oldStartDate, this.endDate = this.oldEndDate, this.hide(), this.element.trigger("cancel.daterangepicker", this)
        },
        monthOrYearChanged: function(a) {
            var b = d(a.target).closest(".calendar").hasClass("left"),
                c = b ? "left" : "right",
                e = this.container.find(".calendar." + c),
                f = parseInt(e.find(".monthselect").val(), 10),
                g = e.find(".yearselect").val();
            b || (g < this.startDate.year() || g == this.startDate.year() && f < this.startDate.month()) && (f = this.startDate.month(), g = this.startDate.year()), this.minDate && (g < this.minDate.year() || g == this.minDate.year() && f < this.minDate.month()) && (f = this.minDate.month(), g = this.minDate.year()), this.maxDate && (g > this.maxDate.year() || g == this.maxDate.year() && f > this.maxDate.month()) && (f = this.maxDate.month(), g = this.maxDate.year()), b ? (this.leftCalendar.month.month(f).year(g), this.linkedCalendars && (this.rightCalendar.month = this.leftCalendar.month.clone().add(1, "month"))) : (this.rightCalendar.month.month(f).year(g), this.linkedCalendars && (this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, "month"))), this.updateCalendars()
        },
        timeChanged: function(a) {
            var b = d(a.target).closest(".calendar"),
                c = b.hasClass("left"),
                e = parseInt(b.find(".hourselect").val(), 10),
                f = parseInt(b.find(".minuteselect").val(), 10),
                g = this.timePickerSeconds ? parseInt(b.find(".secondselect").val(), 10) : 0;
            if (!this.timePicker24Hour) {
                var h = b.find(".ampmselect").val();
                "PM" === h && 12 > e && (e += 12), "AM" === h && 12 === e && (e = 0)
            }
            if (c) {
                var i = this.startDate.clone();
                i.hour(e), i.minute(f), i.second(g), this.setStartDate(i), this.singleDatePicker ? this.endDate = this.startDate.clone() : this.endDate && this.endDate.format("YYYY-MM-DD") == i.format("YYYY-MM-DD") && this.endDate.isBefore(i) && this.setEndDate(i.clone())
            } else if (this.endDate) {
                var j = this.endDate.clone();
                j.hour(e), j.minute(f), j.second(g), this.setEndDate(j)
            }
            this.updateCalendars(), this.updateFormInputs(), this.renderTimePicker("left"), this.renderTimePicker("right")
        },
        formInputsChanged: function(a) {
            var b = d(a.target).closest(".calendar").hasClass("right"),
                e = c(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format),
                f = c(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);
            e.isValid() && f.isValid() && (b && f.isBefore(e) && (e = f.clone()), this.setStartDate(e), this.setEndDate(f), b ? this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format)) : this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format))), this.updateCalendars(), this.timePicker && (this.renderTimePicker("left"), this.renderTimePicker("right"))
        },
        elementChanged: function() {
            if (this.element.is("input") && this.element.val().length && !(this.element.val().length < this.locale.format.length)) {
                var a = this.element.val().split(this.locale.separator),
                    b = null,
                    d = null;
                2 === a.length && (b = c(a[0], this.locale.format), d = c(a[1], this.locale.format)), (this.singleDatePicker || null === b || null === d) && (b = c(this.element.val(), this.locale.format), d = b), b.isValid() && d.isValid() && (this.setStartDate(b), this.setEndDate(d), this.updateView())
            }
        },
        keydown: function(a) {
            (9 === a.keyCode || 13 === a.keyCode) && this.hide()
        },
        updateElement: function() {
            this.element.is("input") && !this.singleDatePicker && this.autoUpdateInput ? (this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format)), this.element.trigger("change")) : this.element.is("input") && this.autoUpdateInput && (this.element.val(this.startDate.format(this.locale.format)), this.element.trigger("change"))
        },
        remove: function() {
            this.container.remove(), this.element.off(".daterangepicker"), this.element.removeData()
        }
    }, d.fn.daterangepicker = function(a, b) {
        return this.each(function() {
            var c = d(this);
            c.data("daterangepicker") && c.data("daterangepicker").remove(), c.data("daterangepicker", new e(c, a, b))
        }), this
    }
});

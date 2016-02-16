// Copyright (c) 2015 Lucas Beyer
// Licensed under the MIT License (MIT)
// Version 1.0
// https://github.com/lucasb-eyer/d3-boundingbox

// ES6 "translation" by (c) 2015 Nick Bollweg
/* eslint-disable */

import {d3} from "nbpresent-deps";

export function bbox() {
    // All those are initialized to default further down using the setters.
    var xextent = null
    var yextent = null
    var handlesize = null
    var dirs = null
    var curs = null
    var cbs = {
        dragstart: null,
        dragmove: null,
        dragend: null,
        resizestart: null,
        resizemove: null,
        resizeend: null
    }

    function my(selection) {
        var drag = d3.behavior.drag()
            .origin(function(d, i) { return {x: this.getAttribute("x"), y: this.getAttribute("y")}; })
            .on("drag.lbbbox", dragmove)
            .on("dragstart.lbbbox", dragstart)
            .on("dragend.lbbbox", dragend)
        selection.call(drag)
        selection.on("mousemove.lbbbox", move)
        selection.on("mouseleave.lbbbox", leave)

        return selection
    }

    function clamp(x, extent) { return Math.max(extent[0], Math.min(x, extent[1])); }
    function inside(x, extent) { return extent[0] < x && x < extent[1]; }

    // Will return w, nw, n, ne, e, se, s, sw for the eight borders,
    // M for inside, or "" when current location not in `dirs`.
    function whichborder(xy, elem) {
        var border = ""
        var x = +elem.getAttribute("x")
        var y = +elem.getAttribute("y")
        var w = +elem.getAttribute("width")
        var h = +elem.getAttribute("height")

             if(xy[1] < y + handlesize.n) border += 'n'
        else if(xy[1] > y + h - handlesize.s) border += 's'

             if(xy[0] < x + handlesize.w) border += 'w'
        else if(xy[0] > x + w - handlesize.e) border += 'e'


        if(border == "" && (dirs.indexOf("x") > -1 || dirs.indexOf("y") > -1))
            border = "M"
        else if(dirs.indexOf(border) == -1)
            border = ""

        return border
    }

    function move(d, i) {
        // Don't do anything if we're currently dragging.
        // Otherwise, the cursor might jump horribly!
        // Also don't do anything if no cursors.
        if(this.__resize_action__ !== undefined || !curs)
            return

        var b = whichborder(d3.mouse(this), this)

        var x = dirs.indexOf("x")
        var y = dirs.indexOf("y")
        // Bwahahahaha this works even when one is at index 0.
        if(b == "M" && 1/(x*y) < 0)
            document.body.style.cursor = x >= 0 ? curs.x : curs.y
        else
            document.body.style.cursor = curs[b] || null
    }

    function leave(d, i) {
        // Only unset cursor if we're not dragging,
        // otherwise we get horrible cursor-flipping action.
        // Also only unset it if we actually did set it!
        if(this.__resize_action__ === undefined && curs)
            document.body.style.cursor = null
    }

    function dragstart(d, i) {
        this.__resize_action__ = whichborder(d3.mouse(this), this)
        this.__ow__ = +this.getAttribute("width")
        this.__oh__ = +this.getAttribute("height")

        if(this.__resize_action__ == "M") {
            if(cbs.dragstart) cbs.dragstart.call(this, d, i)
        } else if(this.__resize_action__.length) {
            if(cbs.resizestart) cbs.resizestart.call(this, d, i)
        }
    }

    function dragend(d, i) {
        if(this.__resize_action__ == "M") {
            if(cbs.dragend) cbs.dragend.call(this, d, i)
        } else if(this.__resize_action__.length) {
            if(cbs.resizeend) cbs.resizeend.call(this, d, i)
        }

        delete this.__resize_action__
        delete this.__ow__
        delete this.__oh__

        // Still need to unset here, in case the user stop dragging
        // while the mouse isn't on the element anymore (e.g. off-limits).
        if(curs)
            document.body.style.cursor = null
    }

    function dragmove(d, i) {
        if(this.__resize_action__ == "M") {
            if(cbs.dragmove)
                if(false === cbs.dragmove.call(this, d, i))
                    return
        } else if(this.__resize_action__.length) {
            if(cbs.resizemove)
                if(false === cbs.resizemove.call(this, d, i))
                    return
        }

        // Potentially dynamically determine the allowed space.
        var xext = typeof xextent === "function" ? xextent.call(this, d, i) : xextent
        var yext = typeof yextent === "function" ? yextent.call(this, d, i) : yextent

        // Handle moving around first, more easily.
        if(this.__resize_action__ == "M") {
            if(dirs.indexOf("x") > -1 && d3.event.dx != 0)
                // This is so that even moving the mouse super-fast, this still "sticks" to the extent.
                this.setAttribute("x", clamp(clamp(d3.event.x, xext) + this.__ow__, xext) - this.__ow__)
            if(dirs.indexOf("y") > -1 && d3.event.dy != 0)
                this.setAttribute("y", clamp(clamp(d3.event.y, yext) + this.__oh__, yext) - this.__oh__)
        // Now check for all possible resizes.
        } else {
            var x = +this.getAttribute("x")
            var y = +this.getAttribute("y")

            // First, check for vertical resizes,
            if(/^n/.test(this.__resize_action__)) {
                var b = y + +this.getAttribute("height")
                var newy = clamp(clamp(d3.event.y, yext), [-Infinity, b-1])
                this.setAttribute("y", newy)
                this.setAttribute("height", b - newy)
            } else if(/^s/.test(this.__resize_action__)) {
                var b = clamp(d3.event.y + this.__oh__, yext)
                this.setAttribute("height", clamp(b - y, [1, Infinity]))
            }

            // and then for horizontal ones. Note both may happen.
            if(/w$/.test(this.__resize_action__)) {
                var r = x + +this.getAttribute("width")
                var newx = clamp(clamp(d3.event.x, xext), [-Infinity, r-1])
                this.setAttribute("x", newx)
                this.setAttribute("width", r - newx)
            } else if(/e$/.test(this.__resize_action__)) {
                var r = clamp(d3.event.x + this.__ow__, xext)
                this.setAttribute("width", clamp(r - x, [1, Infinity]))
            }
        }
    }

    my.xextent = function(_) {
        if(!arguments.length) return xextent
        xextent = _ !== false ? _ : [-Infinity, +Infinity]
        return my
    }
    my.xextent(false)

    my.yextent = function(_) {
        if(!arguments.length) return yextent
        yextent = _ !== false ? _ : [-Infinity, +Infinity]
        return my
    }
    my.yextent(false)

    my.handlesize = function(_) {
        if(!arguments.length) return handlesize
        handlesize = !+_ ? _ : {'w': _,'n': _,'e': _,'s': _}  // coolface
        return my
    }
    my.handlesize(3)

    my.cursors = function(_) {
        if(!arguments.length) return curs
        curs = _ !== true ? _ : {
            M: "move",
            x: "col-resize",
            y: "row-resize",
            n: "n-resize",
            e: "e-resize",
            s: "s-resize",
            w: "w-resize",
            nw: "nw-resize",
            ne: "ne-resize",
            se: "se-resize",
            sw: "sw-resize"
        }
        return my
    }
    my.cursors(true)

    my.directions = function(_) {
        if(!arguments.length) return dirs
        dirs = _ !== true ? _ : ["n", "e", "s", "w", "nw", "ne", "se", "sw", "x", "y"]
        return my
    }
    my.directions(true)

    my.on = function(name, cb) {
        if(cb === undefined) return cbs[name]
        cbs[name] = cb
        return my
    }

    my.infect = function(selection) {
        selection.call(my)
        return my
    }

    my.disinfect = function(selection) {
        selection.on(".drag", null)
        selection.on(".lbbbox", null)
        return my
    }

    return my
}

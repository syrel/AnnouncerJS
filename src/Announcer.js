/**
 * The MIT License (MIT)

 Copyright (c) 2015 Aliaksei Syrel

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

"use strict";
define(['dictionary'], function(Dictionary){

    function Notification(on, send, to) {
        this._on = on;
        this._send = send;
        this._to = to;
    }

    Notification.prototype = (function(){
        return {
            notify : function(ann) {
                return this._send.call(this._to, ann);
            },

            trigger : function () {
                return this._on;
            },

            receiver : function () {
                return this._to;
            },

            destroy : function () {
                this._on = null;
                this._send = null;
                this._to = null;
            },

            toString : function () {
                return 'on: '+this._on.name + ' to: '+this._to.constructor.name;
            }
        }
    })();

    function Announcer() {
        this._triggers = new Dictionary();
        this._receivers = new Dictionary();
    }

    Announcer.prototype = (function(){

        function isTriggerExists(trigger) {
            return this._triggers.isKeyExists(trigger);
        }

        function isReceiverExists(receiver) {
            return this._receivers.isKeyExists(receiver);
        }

        function notificationsOf(receiver) {
            return this._receivers.get(receiver);
        }

        return {
            /**
             * Announces an announcement to all subscribers for that type
             * of notifications
             * @param ann - an object will be used for announcement
             */
            announce : function(ann){
                if (!this._(isTriggerExists)(ann.constructor)) {
                    return;
                }

                this._triggers.get(ann.constructor).forEach(function(entry) {
                    entry.notify(ann);
                });
            },

            /**
             * I'm used to subscribe for an announcements
             * @param on - a constructor of an announcement
             * @param send - a method that should be called
             *              when announcement happens
             * @param to - a context of a receiver
             */
            onSendTo : function(on, send, to){
                if (!this._(isTriggerExists)(on)) {
                    this._triggers.put(on, []);
                }

                if (!this._(isReceiverExists)(to)){
                    this._receivers.put(to, []);
                }

                var notification = new Notification(on, send, to);
                this._triggers.get(on).push(notification);
                this._receivers.get(to).push(notification);
            },

            /**
             *
             * @param to
             */
            unsubscribe : function (to) {
                var me = this;
                this._(notificationsOf)(to).forEach(function(notification){
                    var array = me._triggers.get(notification.trigger());
                    var index = Dictionary.indexInArray(array, notification);
                    Dictionary.removeFromArrayAt(array, index);
                    notification.destroy();
                });

                this._receivers.remove(to);
            },

            _:function(callback){
                var self = this;
                return function(){
                    return callback.apply(self, arguments);
                };
            }
        };
    })();

    return Announcer;
});
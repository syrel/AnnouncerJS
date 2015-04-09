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
define([], function() {
    /**
     * Dictionary like data structure
     *
     * @module Dictionary
     * @exports Dictionary
     * @class Dictionary
     */
    function Dictionary() {
        this._keyObjects = [];
        this._valueObjects = [];
        this._count = 0;
    }

    Dictionary.prototype = (function() {
        /**
         * Returns first occurrence index of an element. Returns
         * -1 if element is not found
         * @param array - to find index in
         * @param element - to be find
         * @returns {number} - an index of an element in array
         * @private
         */

        function indexInArray(array, element) {
            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === element) return i;
            } return -1;
        }

        /**
         * Checks if an element exists in array
         * @param array - to check element in
         * @param element - to be checked
         * @return {boolean} - true if element exists in array,
         *                   - false otherwise
         * @private
         */
        function isExistsInArray(array, element) {
            return indexInArray(array, element) >= 0;
        }

        /**
         * Puts an element in the end of an array and returns
         * its index
         * @param array - to put in
         * @param element - to be put
         * @return {number} - an index where element was placed
         * @private
         */
        function putInArray(array, element) {
            array[array.length] = element;
            return array.length - 1;
        }

        /**
         * Puts an element in array at specified index
         * @param array - to put in
         * @param element - to be put
         * @param index - index where to put
         * @private
         */
        function putInArrayAt(array, element, index) {
            array[index] = element;
        }

        function removeFromArrayAt(array, index) {
            array.splice(index, 1);
        }

        function getFromArrayAt(array, index) {
            return array[index];
        }

        /**
         * Static API
         */
        Dictionary.removeFromArrayAt = removeFromArrayAt;
        Dictionary.indexInArray = indexInArray;

        /**
         * Public API
         */
        return {
            constructor: Dictionary,

            /**
             * Returns amount of key-value pairs in dictionary
             * @return {number}
             */
            size : function() {
                return this._count;
            },

            /**
             * Checks if dictionary is empty
             * @return {boolean} - true if there is no
             *      key-value pairs in it,
             *                   - false otherwise
             */
            isEmpty : function() {
                return this.size() === 0;
            },

            /**
             * @returns {Array.<T>}
             */
            keys : function() {
                return this._keyObjects.slice(0);
            },

            elements : function(){
                return this._valueObjects.slice(0);
            },

            get : function(key){
                var value;
                var index = indexInArray(this._keyObjects, key);
                if (index >= 0) value = this._valueObjects[index];
                return value;
            },

            put : function(key, value){
                var keyIndex = this._(indexInArray)(this._keyObjects, key);
                var oldValue;
                if (keyIndex >= 0) {
                    oldValue = this._(getFromArrayAt)(this._valueObjects, keyIndex);
                    this._(putInArrayAt)(this._valueObjects, value, keyIndex);
                    return oldValue;
                }

                keyIndex = this._(putInArray)(this._keyObjects, key);
                putInArrayAt(this._valueObjects, value, keyIndex);
                this._count++;
                return value;
            },

            /**
             * Removes a key-value pair by specified key
             * @param key - key of a pair to be removed
             * @return {boolean} - true if removed successfully,
             *                   - false otherwise
             */
            remove : function (key) {
                var keyIndex = this._(indexInArray)(this._keyObjects, key);
                if (keyIndex < 0) return false;
                this._(removeFromArrayAt)(this._keyObjects, keyIndex);
                this._(removeFromArrayAt)(this._valueObjects, keyIndex);
                this._count--;
                return true;
            },

            /**
             * Used to iterate over all kay-value pairs. A function
             * of two parameters should be passed where first parameter
             * is a key and second is a value
             * @param _callback - iteration function
             */
            each : function(_callback) {
                for (var i = 0; i < this.size(); i++) {
                    _callback(
                        this._(getFromArrayAt)(this._keyObjects, i),
                        this._(getFromArrayAt)(this._valueObjects, i));
                }
            },

            asObject : function () {
                var obj = { };
                this.each(function(key, value) {
                    obj[key] = value;
                });
                return obj;
            },

            /**
             * Checks if specified key exists and returns true
             * if there is such key in the dictionary, false
             * otherwise
             * @param key - key to check
             * @return {boolean} - true if key exists,
             *                   - false otherwise
             */
            isKeyExists : function (key) {
                return this._(isExistsInArray)(this._keyObjects, key);
            },

            _:function(callback){
                var self = this;
                return function(){
                    return callback.apply(self, arguments);
                };
            }
        };
    })();

    return Dictionary;
});
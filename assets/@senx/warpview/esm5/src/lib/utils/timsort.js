/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* tslint:disable:no-bitwise */
/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
var Timsort = /** @class */ (function () {
    function Timsort(array, compare) {
        this.array = null;
        this.compare = null;
        this.minGallop = Timsort.DEFAULT_MIN_GALLOPING;
        this.length = 0;
        this.tmpStorageLength = Timsort.DEFAULT_TMP_STORAGE_LENGTH;
        this.stackLength = 0;
        this.runStart = null;
        this.runLength = null;
        this.stackSize = 0;
        this.array = array;
        this.compare = compare;
        this.length = array.length;
        if (this.length < 2 * Timsort.DEFAULT_TMP_STORAGE_LENGTH) {
            this.tmpStorageLength = this.length >>> 1;
        }
        this.tmp = new Array(this.tmpStorageLength);
        this.stackLength = (this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40);
        this.runStart = new Array(this.stackLength);
        this.runLength = new Array(this.stackLength);
    }
    /**
     * @private
     * @param {?} x
     * @return {?}
     */
    Timsort.log10 = /**
     * @private
     * @param {?} x
     * @return {?}
     */
    function (x) {
        if (x < 1e5) {
            if (x < 1e2) {
                return x < 1e1 ? 0 : 1;
            }
            if (x < 1e4) {
                return x < 1e3 ? 2 : 3;
            }
            return 4;
        }
        if (x < 1e7) {
            return x < 1e6 ? 5 : 6;
        }
        if (x < 1e9) {
            return x < 1e8 ? 7 : 8;
        }
        return 9;
    };
    /**
     * @private
     * @param {?} n
     * @return {?}
     */
    Timsort.minRunLength = /**
     * @private
     * @param {?} n
     * @return {?}
     */
    function (n) {
        /** @type {?} */
        var r = 0;
        while (n >= Timsort.DEFAULT_MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} compare
     * @return {?}
     */
    Timsort.makeAscendingRun = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} compare
     * @return {?}
     */
    function (array, lo, hi, compare) {
        /** @type {?} */
        var runHi = lo + 1;
        if (runHi === hi) {
            return 1;
        }
        // Descending
        if (compare(array[runHi++], array[lo]) < 0) {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
                runHi++;
            }
            Timsort.reverseRun(array, lo, runHi);
            // Ascending
        }
        else {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
                runHi++;
            }
        }
        return runHi - lo;
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @return {?}
     */
    Timsort.reverseRun = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @return {?}
     */
    function (array, lo, hi) {
        hi--;
        while (lo < hi) {
            /** @type {?} */
            var t = array[lo];
            array[lo++] = array[hi];
            array[hi--] = t;
        }
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} start
     * @param {?} compare
     * @return {?}
     */
    Timsort.binaryInsertionSort = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} start
     * @param {?} compare
     * @return {?}
     */
    function (array, lo, hi, start, compare) {
        if (start === lo) {
            start++;
        }
        for (; start < hi; start++) {
            /** @type {?} */
            var pivot = array[start];
            // Ranges of the array where pivot belongs
            /** @type {?} */
            var left = lo;
            /** @type {?} */
            var right = start;
            while (left < right) {
                /** @type {?} */
                var mid = (left + right) >>> 1;
                if (compare(pivot, array[mid]) < 0) {
                    right = mid;
                }
                else {
                    left = mid + 1;
                }
            }
            /** @type {?} */
            var n = start - left;
            // Switch is just an optimization for small arrays
            switch (n) {
                case 3:
                    array[left + 3] = array[left + 2];
                /* falls through */
                case 2:
                    array[left + 2] = array[left + 1];
                /* falls through */
                case 1:
                    array[left + 1] = array[left];
                    break;
                default:
                    while (n > 0) {
                        array[left + n] = array[left + n - 1];
                        n--;
                    }
            }
            array[left] = pivot;
        }
    };
    /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    Timsort.gallopLeft = /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    function (value, array, start, length, hint, compare) {
        /** @type {?} */
        var lastOffset = 0;
        /** @type {?} */
        var maxOffset;
        /** @type {?} */
        var offset = 1;
        if (compare(value, array[start + hint]) > 0) {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            lastOffset += hint;
            offset += hint;
            // value <= array[start + hint]
        }
        else {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            /** @type {?} */
            var tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
        }
        lastOffset++;
        while (lastOffset < offset) {
            /** @type {?} */
            var m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) > 0) {
                lastOffset = m + 1;
            }
            else {
                offset = m;
            }
        }
        return offset;
    };
    /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    Timsort.gallopRight = /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    function (value, array, start, length, hint, compare) {
        /** @type {?} */
        var lastOffset = 0;
        /** @type {?} */
        var maxOffset;
        /** @type {?} */
        var offset = 1;
        if (compare(value, array[start + hint]) < 0) {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            /** @type {?} */
            var tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
            // value >= array[start + hint]
        }
        else {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            lastOffset += hint;
            offset += hint;
        }
        lastOffset++;
        while (lastOffset < offset) {
            /** @type {?} */
            var m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) < 0) {
                offset = m;
            }
            else {
                lastOffset = m + 1;
            }
        }
        return offset;
    };
    /**
     * @private
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    Timsort.alphabeticalCompare = /**
     * @private
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        if (a === b) {
            return 0;
        }
        if (~~a === a && ~~b === b) {
            if (a === 0 || b === 0) {
                return a < b ? -1 : 1;
            }
            if (a < 0 || b < 0) {
                if (b >= 0) {
                    return -1;
                }
                if (a >= 0) {
                    return 1;
                }
                a = -a;
                b = -b;
            }
            /** @type {?} */
            var al = Timsort.log10(a);
            /** @type {?} */
            var bl = Timsort.log10(b);
            /** @type {?} */
            var t = 0;
            if (al < bl) {
                a *= Timsort.POWERS_OF_TEN[bl - al - 1];
                b /= 10;
                t = -1;
            }
            else if (al > bl) {
                b *= Timsort.POWERS_OF_TEN[al - bl - 1];
                a /= 10;
                t = 1;
            }
            if (a === b) {
                return t;
            }
            return a < b ? -1 : 1;
        }
        /** @type {?} */
        var aStr = String(a);
        /** @type {?} */
        var bStr = String(b);
        if (aStr === bStr) {
            return 0;
        }
        return aStr < bStr ? -1 : 1;
    };
    /**
     * @param {?} array
     * @param {?=} compare
     * @param {?=} lo
     * @param {?=} hi
     * @return {?}
     */
    Timsort.sort = /**
     * @param {?} array
     * @param {?=} compare
     * @param {?=} lo
     * @param {?=} hi
     * @return {?}
     */
    function (array, compare, lo, hi) {
        if (!Array.isArray(array)) {
            throw new TypeError('Can only sort arrays');
        }
        if (!compare) {
            compare = Timsort.alphabeticalCompare;
        }
        else if (typeof compare !== 'function') {
            hi = lo;
            lo = compare;
            compare = Timsort.alphabeticalCompare;
        }
        if (!lo) {
            lo = 0;
        }
        if (!hi) {
            hi = array.length;
        }
        /** @type {?} */
        var remaining = hi - lo;
        // The array is already sorted
        if (remaining < 2) {
            return;
        }
        /** @type {?} */
        var runLength = 0;
        // On small arrays binary sort can be used directly
        if (remaining < Timsort.DEFAULT_MIN_MERGE) {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            Timsort.binaryInsertionSort(array, lo, hi, lo + runLength, compare);
            return;
        }
        /** @type {?} */
        var ts = new Timsort(array, compare);
        /** @type {?} */
        var minRun = Timsort.minRunLength(remaining);
        do {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            if (runLength < minRun) {
                /** @type {?} */
                var force = remaining;
                if (force > minRun) {
                    force = minRun;
                }
                Timsort.binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
                runLength = force;
            }
            // Push new run and merge if necessary
            ts.pushRun(lo, runLength);
            ts.mergeRuns();
            // Go find next run
            remaining -= runLength;
            lo += runLength;
        } while (remaining !== 0);
        // Force merging of remaining runs
        ts.forceMergeRuns();
    };
    /**
     * @param {?} runStart
     * @param {?} runLength
     * @return {?}
     */
    Timsort.prototype.pushRun = /**
     * @param {?} runStart
     * @param {?} runLength
     * @return {?}
     */
    function (runStart, runLength) {
        this.runStart[this.stackSize] = runStart;
        this.runLength[this.stackSize] = runLength;
        this.stackSize += 1;
    };
    /**
     * @return {?}
     */
    Timsort.prototype.mergeRuns = /**
     * @return {?}
     */
    function () {
        while (this.stackSize > 1) {
            /** @type {?} */
            var n = this.stackSize - 2;
            if ((n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1])
                || (n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
                if (this.runLength[n - 1] < this.runLength[n + 1]) {
                    n--;
                }
            }
            else if (this.runLength[n] > this.runLength[n + 1]) {
                break;
            }
            this.mergeAt(n);
        }
    };
    /**
     * @return {?}
     */
    Timsort.prototype.forceMergeRuns = /**
     * @return {?}
     */
    function () {
        while (this.stackSize > 1) {
            /** @type {?} */
            var n = this.stackSize - 2;
            if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
                n--;
            }
            this.mergeAt(n);
        }
    };
    /**
     * @param {?} i
     * @return {?}
     */
    Timsort.prototype.mergeAt = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var start1 = this.runStart[i];
        /** @type {?} */
        var length1 = this.runLength[i];
        /** @type {?} */
        var start2 = this.runStart[i + 1];
        /** @type {?} */
        var length2 = this.runLength[i + 1];
        this.runLength[i] = length1 + length2;
        if (i === this.stackSize - 3) {
            this.runStart[i + 1] = this.runStart[i + 2];
            this.runLength[i + 1] = this.runLength[i + 2];
        }
        this.stackSize--;
        /** @type {?} */
        var k = Timsort.gallopRight(array[start2], array, start1, length1, 0, compare);
        start1 += k;
        length1 -= k;
        if (length1 === 0) {
            return;
        }
        length2 = Timsort.gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
        if (length2 === 0) {
            return;
        }
        if (length1 <= length2) {
            this.mergeLow(start1, length1, start2, length2);
        }
        else {
            this.mergeHigh(start1, length1, start2, length2);
        }
    };
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    Timsort.prototype.mergeLow = /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    function (start1, length1, start2, length2) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var tmp = this.tmp;
        /** @type {?} */
        var i;
        for (i = 0; i < length1; i++) {
            tmp[i] = array[start1 + i];
        }
        /** @type {?} */
        var cursor1 = 0;
        /** @type {?} */
        var cursor2 = start2;
        /** @type {?} */
        var dest = start1;
        array[dest++] = array[cursor2++];
        if (--length2 === 0) {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
            return;
        }
        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
            return;
        }
        /** @type {?} */
        var minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            var count1 = 0;
            /** @type {?} */
            var count2 = 0;
            /** @type {?} */
            var exit = false;
            do {
                if (compare(array[cursor2], tmp[cursor1]) < 0) {
                    array[dest++] = array[cursor2++];
                    count2++;
                    count1 = 0;
                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < minGallop);
            if (exit) {
                break;
            }
            do {
                count1 = Timsort.gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
                if (count1 !== 0) {
                    for (i = 0; i < count1; i++) {
                        array[dest + i] = tmp[cursor1 + i];
                    }
                    dest += count1;
                    cursor1 += count1;
                    length1 -= count1;
                    if (length1 <= 1) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = array[cursor2++];
                if (--length2 === 0) {
                    exit = true;
                    break;
                }
                count2 = Timsort.gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
                if (count2 !== 0) {
                    for (i = 0; i < count2; i++) {
                        array[dest + i] = array[cursor2 + i];
                    }
                    dest += count2;
                    cursor2 += count2;
                    length2 -= count2;
                    if (length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = tmp[cursor1++];
                if (--length1 === 1) {
                    exit = true;
                    break;
                }
                minGallop--;
            } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
            if (exit) {
                break;
            }
            if (minGallop < 0) {
                minGallop = 0;
            }
            minGallop += 2;
        }
        this.minGallop = minGallop;
        if (minGallop < 1) {
            this.minGallop = 1;
        }
        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
        }
        else if (length1 === 0) {
            throw new Error('mergeLow preconditions were not respected');
        }
        else {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
        }
    };
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    Timsort.prototype.mergeHigh = /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    function (start1, length1, start2, length2) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var tmp = this.tmp;
        /** @type {?} */
        var i;
        for (i = 0; i < length2; i++) {
            tmp[i] = array[start2 + i];
        }
        /** @type {?} */
        var cursor1 = start1 + length1 - 1;
        /** @type {?} */
        var cursor2 = length2 - 1;
        /** @type {?} */
        var dest = start2 + length2 - 1;
        /** @type {?} */
        var customCursor = 0;
        /** @type {?} */
        var customDest = 0;
        array[dest--] = array[cursor1--];
        if (--length1 === 0) {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
            return;
        }
        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;
            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }
            array[dest] = tmp[cursor2];
            return;
        }
        /** @type {?} */
        var minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            var count1 = 0;
            /** @type {?} */
            var count2 = 0;
            /** @type {?} */
            var exit = false;
            do {
                if (compare(tmp[cursor2], array[cursor1]) < 0) {
                    array[dest--] = array[cursor1--];
                    count1++;
                    count2 = 0;
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest--] = tmp[cursor2--];
                    count2++;
                    count1 = 0;
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < minGallop);
            if (exit) {
                break;
            }
            do {
                count1 = length1 - Timsort.gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
                if (count1 !== 0) {
                    dest -= count1;
                    cursor1 -= count1;
                    length1 -= count1;
                    customDest = dest + 1;
                    customCursor = cursor1 + 1;
                    for (i = count1 - 1; i >= 0; i--) {
                        array[customDest + i] = array[customCursor + i];
                    }
                    if (length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest--] = tmp[cursor2--];
                if (--length2 === 1) {
                    exit = true;
                    break;
                }
                count2 = length2 - Timsort.gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
                if (count2 !== 0) {
                    dest -= count2;
                    cursor2 -= count2;
                    length2 -= count2;
                    customDest = dest + 1;
                    customCursor = cursor2 + 1;
                    for (i = 0; i < count2; i++) {
                        array[customDest + i] = tmp[customCursor + i];
                    }
                    if (length2 <= 1) {
                        exit = true;
                        break;
                    }
                }
                array[dest--] = array[cursor1--];
                if (--length1 === 0) {
                    exit = true;
                    break;
                }
                minGallop--;
            } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
            if (exit) {
                break;
            }
            if (minGallop < 0) {
                minGallop = 0;
            }
            minGallop += 2;
        }
        this.minGallop = minGallop;
        if (minGallop < 1) {
            this.minGallop = 1;
        }
        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;
            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }
            array[dest] = tmp[cursor2];
        }
        else if (length2 === 0) {
            throw new Error('mergeHigh preconditions were not respected');
        }
        else {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
        }
    };
    /**
     * Default minimum size of a run.
     */
    Timsort.DEFAULT_MIN_MERGE = 32;
    /**
     * Minimum ordered subsequece required to do galloping.
     */
    Timsort.DEFAULT_MIN_GALLOPING = 7;
    /**
     * Default tmp storage length. Can increase depending on the size of the
     * smallest run to merge.
     */
    Timsort.DEFAULT_TMP_STORAGE_LENGTH = 256;
    /**
     * Pre-computed powers of 10 for efficient lexicographic comparison of
     * small integers.
     */
    Timsort.POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
    return Timsort;
}());
export { Timsort };
if (false) {
    /**
     * Default minimum size of a run.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_MIN_MERGE;
    /**
     * Minimum ordered subsequece required to do galloping.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_MIN_GALLOPING;
    /**
     * Default tmp storage length. Can increase depending on the size of the
     * smallest run to merge.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_TMP_STORAGE_LENGTH;
    /**
     * Pre-computed powers of 10 for efficient lexicographic comparison of
     * small integers.
     * @type {?}
     * @private
     */
    Timsort.POWERS_OF_TEN;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.array;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.compare;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.minGallop;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.length;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.tmpStorageLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.stackLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.runStart;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.runLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.stackSize;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.tmp;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltc29ydC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy90aW1zb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTtJQW1DRSxpQkFBWSxLQUFLLEVBQUUsT0FBTztRQVhULFVBQUssR0FBRyxJQUFJLENBQUM7UUFDYixZQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLGNBQVMsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7UUFDakMsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLHFCQUFnQixHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQztRQUN0RCxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDMUIsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUlwQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsMEJBQTBCLEVBQUU7WUFDeEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFD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Qyw0QkFBc0I7Ozs7O0lBQ3RCLHNCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cblxuLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5leHBvcnQgY2xhc3MgVGltc29ydCB7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgbWluaW11bSBzaXplIG9mIGEgcnVuLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9NSU5fTUVSR0UgPSAzMjtcblxuICAvKipcbiAgICogTWluaW11bSBvcmRlcmVkIHN1YnNlcXVlY2UgcmVxdWlyZWQgdG8gZG8gZ2FsbG9waW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9NSU5fR0FMTE9QSU5HID0gNztcblxuICAvKipcbiAgICogRGVmYXVsdCB0bXAgc3RvcmFnZSBsZW5ndGguIENhbiBpbmNyZWFzZSBkZXBlbmRpbmcgb24gdGhlIHNpemUgb2YgdGhlXG4gICAqIHNtYWxsZXN0IHJ1biB0byBtZXJnZS5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIERFRkFVTFRfVE1QX1NUT1JBR0VfTEVOR1RIID0gMjU2O1xuXG4gIC8qKlxuICAgKiBQcmUtY29tcHV0ZWQgcG93ZXJzIG9mIDEwIGZvciBlZmZpY2llbnQgbGV4aWNvZ3JhcGhpYyBjb21wYXJpc29uIG9mXG4gICAqIHNtYWxsIGludGVnZXJzLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgUE9XRVJTX09GX1RFTiA9IFsxZTAsIDFlMSwgMWUyLCAxZTMsIDFlNCwgMWU1LCAxZTYsIDFlNywgMWU4LCAxZTldO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXJyYXkgPSBudWxsO1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbXBhcmUgPSBudWxsO1xuICBwcml2YXRlIG1pbkdhbGxvcCA9IFRpbXNvcnQuREVGQVVMVF9NSU5fR0FMTE9QSU5HO1xuICBwcml2YXRlIHJlYWRvbmx5IGxlbmd0aCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG1wU3RvcmFnZUxlbmd0aCA9IFRpbXNvcnQuREVGQVVMVF9UTVBfU1RPUkFHRV9MRU5HVEg7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhY2tMZW5ndGg6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgcnVuU3RhcnQgPSBudWxsO1xuICBwcml2YXRlIHJlYWRvbmx5IHJ1bkxlbmd0aCA9IG51bGw7XG4gIHByaXZhdGUgc3RhY2tTaXplID0gMDtcbiAgcHJpdmF0ZSByZWFkb25seSB0bXA6IGFueTtcblxuICBjb25zdHJ1Y3RvcihhcnJheSwgY29tcGFyZSkge1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbiAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlO1xuICAgIHRoaXMubGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmICh0aGlzLmxlbmd0aCA8IDIgKiBUaW1zb3J0LkRFRkFVTFRfVE1QX1NUT1JBR0VfTEVOR1RIKSB7XG4gICAgICB0aGlzLnRtcFN0b3JhZ2VMZW5ndGggPSB0aGlzLmxlbmd0aCA+Pj4gMTtcbiAgICB9XG4gICAgdGhpcy50bXAgPSBuZXcgQXJyYXkodGhpcy50bXBTdG9yYWdlTGVuZ3RoKTtcbiAgICB0aGlzLnN0YWNrTGVuZ3RoID0gKHRoaXMubGVuZ3RoIDwgMTIwID8gNSA6IHRoaXMubGVuZ3RoIDwgMTU0MiA/IDEwIDogdGhpcy5sZW5ndGggPCAxMTkxNTEgPyAxOSA6IDQwKTtcbiAgICB0aGlzLnJ1blN0YXJ0ID0gbmV3IEFycmF5KHRoaXMuc3RhY2tMZW5ndGgpO1xuICAgIHRoaXMucnVuTGVuZ3RoID0gbmV3IEFycmF5KHRoaXMuc3RhY2tMZW5ndGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbG9nMTAoeCkge1xuICAgIGlmICh4IDwgMWU1KSB7XG4gICAgICBpZiAoeCA8IDFlMikge1xuICAgICAgICByZXR1cm4geCA8IDFlMSA/IDAgOiAxO1xuICAgICAgfVxuICAgICAgaWYgKHggPCAxZTQpIHtcbiAgICAgICAgcmV0dXJuIHggPCAxZTMgPyAyIDogMztcbiAgICAgIH1cbiAgICAgIHJldHVybiA0O1xuICAgIH1cbiAgICBpZiAoeCA8IDFlNykge1xuICAgICAgcmV0dXJuIHggPCAxZTYgPyA1IDogNjtcbiAgICB9XG4gICAgaWYgKHggPCAxZTkpIHtcbiAgICAgIHJldHVybiB4IDwgMWU4ID8gNyA6IDg7XG4gICAgfVxuICAgIHJldHVybiA5O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbWluUnVuTGVuZ3RoKG4pIHtcbiAgICBsZXQgciA9IDA7XG4gICAgd2hpbGUgKG4gPj0gVGltc29ydC5ERUZBVUxUX01JTl9NRVJHRSkge1xuICAgICAgciB8PSAobiAmIDEpO1xuICAgICAgbiA+Pj0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG4gKyByO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbWFrZUFzY2VuZGluZ1J1bihhcnJheSwgbG8sIGhpLCBjb21wYXJlKSB7XG4gICAgbGV0IHJ1bkhpID0gbG8gKyAxO1xuICAgIGlmIChydW5IaSA9PT0gaGkpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICAvLyBEZXNjZW5kaW5nXG4gICAgaWYgKGNvbXBhcmUoYXJyYXlbcnVuSGkrK10sIGFycmF5W2xvXSkgPCAwKSB7XG4gICAgICB3aGlsZSAocnVuSGkgPCBoaSAmJiBjb21wYXJlKGFycmF5W3J1bkhpXSwgYXJyYXlbcnVuSGkgLSAxXSkgPCAwKSB7XG4gICAgICAgIHJ1bkhpKys7XG4gICAgICB9XG4gICAgICBUaW1zb3J0LnJldmVyc2VSdW4oYXJyYXksIGxvLCBydW5IaSk7XG4gICAgICAvLyBBc2NlbmRpbmdcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKHJ1bkhpIDwgaGkgJiYgY29tcGFyZShhcnJheVtydW5IaV0sIGFycmF5W3J1bkhpIC0gMV0pID49IDApIHtcbiAgICAgICAgcnVuSGkrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ1bkhpIC0gbG87XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZXZlcnNlUnVuKGFycmF5LCBsbywgaGkpIHtcbiAgICBoaS0tO1xuICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICBjb25zdCB0ID0gYXJyYXlbbG9dO1xuICAgICAgYXJyYXlbbG8rK10gPSBhcnJheVtoaV07XG4gICAgICBhcnJheVtoaS0tXSA9IHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgYmluYXJ5SW5zZXJ0aW9uU29ydChhcnJheSwgbG8sIGhpLCBzdGFydCwgY29tcGFyZSkge1xuICAgIGlmIChzdGFydCA9PT0gbG8pIHtcbiAgICAgIHN0YXJ0Kys7XG4gICAgfVxuICAgIGZvciAoOyBzdGFydCA8IGhpOyBzdGFydCsrKSB7XG4gICAgICBjb25zdCBwaXZvdCA9IGFycmF5W3N0YXJ0XTtcbiAgICAgIC8vIFJhbmdlcyBvZiB0aGUgYXJyYXkgd2hlcmUgcGl2b3QgYmVsb25nc1xuICAgICAgbGV0IGxlZnQgPSBsbztcbiAgICAgIGxldCByaWdodCA9IHN0YXJ0O1xuICAgICAgd2hpbGUgKGxlZnQgPCByaWdodCkge1xuICAgICAgICBjb25zdCBtaWQgPSAobGVmdCArIHJpZ2h0KSA+Pj4gMTtcbiAgICAgICAgaWYgKGNvbXBhcmUocGl2b3QsIGFycmF5W21pZF0pIDwgMCkge1xuICAgICAgICAgIHJpZ2h0ID0gbWlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxlZnQgPSBtaWQgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgbiA9IHN0YXJ0IC0gbGVmdDtcbiAgICAgIC8vIFN3aXRjaCBpcyBqdXN0IGFuIG9wdGltaXphdGlvbiBmb3Igc21hbGwgYXJyYXlzXG4gICAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIGFycmF5W2xlZnQgKyAzXSA9IGFycmF5W2xlZnQgKyAyXTtcbiAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgYXJyYXlbbGVmdCArIDJdID0gYXJyYXlbbGVmdCArIDFdO1xuICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBhcnJheVtsZWZ0ICsgMV0gPSBhcnJheVtsZWZ0XTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB3aGlsZSAobiA+IDApIHtcbiAgICAgICAgICAgIGFycmF5W2xlZnQgKyBuXSA9IGFycmF5W2xlZnQgKyBuIC0gMV07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXJyYXlbbGVmdF0gPSBwaXZvdDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnYWxsb3BMZWZ0KHZhbHVlLCBhcnJheSwgc3RhcnQsIGxlbmd0aCwgaGludCwgY29tcGFyZSkge1xuICAgIGxldCBsYXN0T2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0O1xuICAgIGxldCBvZmZzZXQgPSAxO1xuICAgIGlmIChjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnRdKSA+IDApIHtcbiAgICAgIG1heE9mZnNldCA9IGxlbmd0aCAtIGhpbnQ7XG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbWF4T2Zmc2V0ICYmIGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgaGludCArIG9mZnNldF0pID4gMCkge1xuICAgICAgICBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICBvZmZzZXQgPSAob2Zmc2V0IDw8IDEpICsgMTtcbiAgICAgICAgaWYgKG9mZnNldCA8PSAwKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob2Zmc2V0ID4gbWF4T2Zmc2V0KSB7XG4gICAgICAgIG9mZnNldCA9IG1heE9mZnNldDtcbiAgICAgIH1cbiAgICAgIC8vIE1ha2Ugb2Zmc2V0cyByZWxhdGl2ZSB0byBzdGFydFxuICAgICAgbGFzdE9mZnNldCArPSBoaW50O1xuICAgICAgb2Zmc2V0ICs9IGhpbnQ7XG4gICAgICAvLyB2YWx1ZSA8PSBhcnJheVtzdGFydCArIGhpbnRdXG4gICAgfSBlbHNlIHtcbiAgICAgIG1heE9mZnNldCA9IGhpbnQgKyAxO1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG1heE9mZnNldCAmJiBjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnQgLSBvZmZzZXRdKSA8PSAwKSB7XG4gICAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuICAgICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXQgPiBtYXhPZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgICBjb25zdCB0bXAgPSBsYXN0T2Zmc2V0O1xuICAgICAgbGFzdE9mZnNldCA9IGhpbnQgLSBvZmZzZXQ7XG4gICAgICBvZmZzZXQgPSBoaW50IC0gdG1wO1xuICAgIH1cbiAgICBsYXN0T2Zmc2V0Kys7XG4gICAgd2hpbGUgKGxhc3RPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICAgIGNvbnN0IG0gPSBsYXN0T2Zmc2V0ICsgKChvZmZzZXQgLSBsYXN0T2Zmc2V0KSA+Pj4gMSk7XG4gICAgICBpZiAoY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBtXSkgPiAwKSB7XG4gICAgICAgIGxhc3RPZmZzZXQgPSBtICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldCA9IG07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnYWxsb3BSaWdodCh2YWx1ZSwgYXJyYXksIHN0YXJ0LCBsZW5ndGgsIGhpbnQsIGNvbXBhcmUpIHtcbiAgICBsZXQgbGFzdE9mZnNldCA9IDA7XG4gICAgbGV0IG1heE9mZnNldDtcbiAgICBsZXQgb2Zmc2V0ID0gMTtcbiAgICBpZiAoY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBoaW50XSkgPCAwKSB7XG4gICAgICBtYXhPZmZzZXQgPSBoaW50ICsgMTtcbiAgICAgIHdoaWxlIChvZmZzZXQgPCBtYXhPZmZzZXQgJiYgY29tcGFyZSh2YWx1ZSwgYXJyYXlbc3RhcnQgKyBoaW50IC0gb2Zmc2V0XSkgPCAwKSB7XG4gICAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuICAgICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXQgPiBtYXhPZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgICBjb25zdCB0bXAgPSBsYXN0T2Zmc2V0O1xuICAgICAgbGFzdE9mZnNldCA9IGhpbnQgLSBvZmZzZXQ7XG4gICAgICBvZmZzZXQgPSBoaW50IC0gdG1wO1xuICAgICAgLy8gdmFsdWUgPj0gYXJyYXlbc3RhcnQgKyBoaW50XVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXhPZmZzZXQgPSBsZW5ndGggLSBoaW50O1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG1heE9mZnNldCAmJiBjb21wYXJlKHZhbHVlLCBhcnJheVtzdGFydCArIGhpbnQgKyBvZmZzZXRdKSA+PSAwKSB7XG4gICAgICAgIGxhc3RPZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIG9mZnNldCA9IChvZmZzZXQgPDwgMSkgKyAxO1xuICAgICAgICBpZiAob2Zmc2V0IDw9IDApIHtcbiAgICAgICAgICBvZmZzZXQgPSBtYXhPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvZmZzZXQgPiBtYXhPZmZzZXQpIHtcbiAgICAgICAgb2Zmc2V0ID0gbWF4T2Zmc2V0O1xuICAgICAgfVxuICAgICAgLy8gTWFrZSBvZmZzZXRzIHJlbGF0aXZlIHRvIHN0YXJ0XG4gICAgICBsYXN0T2Zmc2V0ICs9IGhpbnQ7XG4gICAgICBvZmZzZXQgKz0gaGludDtcbiAgICB9XG4gICAgbGFzdE9mZnNldCsrO1xuICAgIHdoaWxlIChsYXN0T2Zmc2V0IDwgb2Zmc2V0KSB7XG4gICAgICBjb25zdCBtID0gbGFzdE9mZnNldCArICgob2Zmc2V0IC0gbGFzdE9mZnNldCkgPj4+IDEpO1xuICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIGFycmF5W3N0YXJ0ICsgbV0pIDwgMCkge1xuICAgICAgICBvZmZzZXQgPSBtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFzdE9mZnNldCA9IG0gKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2Zmc2V0O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgYWxwaGFiZXRpY2FsQ29tcGFyZShhLCBiKSB7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAofn5hID09PSBhICYmIH5+YiA9PT0gYikge1xuICAgICAgaWYgKGEgPT09IDAgfHwgYiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IDE7XG4gICAgICB9XG4gICAgICBpZiAoYSA8IDAgfHwgYiA8IDApIHtcbiAgICAgICAgaWYgKGIgPj0gMCkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYSA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgYSA9IC1hO1xuICAgICAgICBiID0gLWI7XG4gICAgICB9XG4gICAgICBjb25zdCBhbCA9IFRpbXNvcnQubG9nMTAoYSk7XG4gICAgICBjb25zdCBibCA9IFRpbXNvcnQubG9nMTAoYik7XG4gICAgICBsZXQgdCA9IDA7XG4gICAgICBpZiAoYWwgPCBibCkge1xuICAgICAgICBhICo9IFRpbXNvcnQuUE9XRVJTX09GX1RFTltibCAtIGFsIC0gMV07XG4gICAgICAgIGIgLz0gMTA7XG4gICAgICAgIHQgPSAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYWwgPiBibCkge1xuICAgICAgICBiICo9IFRpbXNvcnQuUE9XRVJTX09GX1RFTlthbCAtIGJsIC0gMV07XG4gICAgICAgIGEgLz0gMTA7XG4gICAgICAgIHQgPSAxO1xuICAgICAgfVxuICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IDE7XG4gICAgfVxuICAgIGNvbnN0IGFTdHIgPSBTdHJpbmcoYSk7XG4gICAgY29uc3QgYlN0ciA9IFN0cmluZyhiKTtcbiAgICBpZiAoYVN0ciA9PT0gYlN0cikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBhU3RyIDwgYlN0ciA/IC0xIDogMTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc29ydChhcnJheTogYW55W10sIGNvbXBhcmU/OiAoYTogYW55LCBiOiBhbnkpID0+IG51bWJlciwgbG8/OiBudW1iZXIsIGhpPzogbnVtYmVyKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2FuIG9ubHkgc29ydCBhcnJheXMnKTtcbiAgICB9XG4gICAgaWYgKCFjb21wYXJlKSB7XG4gICAgICBjb21wYXJlID0gVGltc29ydC5hbHBoYWJldGljYWxDb21wYXJlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbXBhcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGhpID0gbG87XG4gICAgICBsbyA9IGNvbXBhcmU7XG4gICAgICBjb21wYXJlID0gVGltc29ydC5hbHBoYWJldGljYWxDb21wYXJlO1xuICAgIH1cbiAgICBpZiAoIWxvKSB7XG4gICAgICBsbyA9IDA7XG4gICAgfVxuICAgIGlmICghaGkpIHtcbiAgICAgIGhpID0gYXJyYXkubGVuZ3RoO1xuICAgIH1cbiAgICBsZXQgcmVtYWluaW5nID0gaGkgLSBsbztcbiAgICAvLyBUaGUgYXJyYXkgaXMgYWxyZWFkeSBzb3J0ZWRcbiAgICBpZiAocmVtYWluaW5nIDwgMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgcnVuTGVuZ3RoID0gMDtcbiAgICAvLyBPbiBzbWFsbCBhcnJheXMgYmluYXJ5IHNvcnQgY2FuIGJlIHVzZWQgZGlyZWN0bHlcbiAgICBpZiAocmVtYWluaW5nIDwgVGltc29ydC5ERUZBVUxUX01JTl9NRVJHRSkge1xuICAgICAgcnVuTGVuZ3RoID0gVGltc29ydC5tYWtlQXNjZW5kaW5nUnVuKGFycmF5LCBsbywgaGksIGNvbXBhcmUpO1xuICAgICAgVGltc29ydC5iaW5hcnlJbnNlcnRpb25Tb3J0KGFycmF5LCBsbywgaGksIGxvICsgcnVuTGVuZ3RoLCBjb21wYXJlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdHMgPSBuZXcgVGltc29ydChhcnJheSwgY29tcGFyZSk7XG4gICAgY29uc3QgbWluUnVuID0gVGltc29ydC5taW5SdW5MZW5ndGgocmVtYWluaW5nKTtcbiAgICBkbyB7XG4gICAgICBydW5MZW5ndGggPSBUaW1zb3J0Lm1ha2VBc2NlbmRpbmdSdW4oYXJyYXksIGxvLCBoaSwgY29tcGFyZSk7XG4gICAgICBpZiAocnVuTGVuZ3RoIDwgbWluUnVuKSB7XG4gICAgICAgIGxldCBmb3JjZSA9IHJlbWFpbmluZztcbiAgICAgICAgaWYgKGZvcmNlID4gbWluUnVuKSB7XG4gICAgICAgICAgZm9yY2UgPSBtaW5SdW47XG4gICAgICAgIH1cbiAgICAgICAgVGltc29ydC5iaW5hcnlJbnNlcnRpb25Tb3J0KGFycmF5LCBsbywgbG8gKyBmb3JjZSwgbG8gKyBydW5MZW5ndGgsIGNvbXBhcmUpO1xuICAgICAgICBydW5MZW5ndGggPSBmb3JjZTtcbiAgICAgIH1cbiAgICAgIC8vIFB1c2ggbmV3IHJ1biBhbmQgbWVyZ2UgaWYgbmVjZXNzYXJ5XG4gICAgICB0cy5wdXNoUnVuKGxvLCBydW5MZW5ndGgpO1xuICAgICAgdHMubWVyZ2VSdW5zKCk7XG4gICAgICAvLyBHbyBmaW5kIG5leHQgcnVuXG4gICAgICByZW1haW5pbmcgLT0gcnVuTGVuZ3RoO1xuICAgICAgbG8gKz0gcnVuTGVuZ3RoO1xuICAgIH0gd2hpbGUgKHJlbWFpbmluZyAhPT0gMCk7XG4gICAgLy8gRm9yY2UgbWVyZ2luZyBvZiByZW1haW5pbmcgcnVuc1xuICAgIHRzLmZvcmNlTWVyZ2VSdW5zKCk7XG4gIH1cblxuICBwdXNoUnVuKHJ1blN0YXJ0LCBydW5MZW5ndGgpIHtcbiAgICB0aGlzLnJ1blN0YXJ0W3RoaXMuc3RhY2tTaXplXSA9IHJ1blN0YXJ0O1xuICAgIHRoaXMucnVuTGVuZ3RoW3RoaXMuc3RhY2tTaXplXSA9IHJ1bkxlbmd0aDtcbiAgICB0aGlzLnN0YWNrU2l6ZSArPSAxO1xuICB9XG5cbiAgbWVyZ2VSdW5zKCkge1xuICAgIHdoaWxlICh0aGlzLnN0YWNrU2l6ZSA+IDEpIHtcbiAgICAgIGxldCBuID0gdGhpcy5zdGFja1NpemUgLSAyO1xuICAgICAgaWYgKChuID49IDEgJiYgdGhpcy5ydW5MZW5ndGhbbiAtIDFdIDw9IHRoaXMucnVuTGVuZ3RoW25dICsgdGhpcy5ydW5MZW5ndGhbbiArIDFdKVxuICAgICAgICB8fCAobiA+PSAyICYmIHRoaXMucnVuTGVuZ3RoW24gLSAyXSA8PSB0aGlzLnJ1bkxlbmd0aFtuXSArIHRoaXMucnVuTGVuZ3RoW24gLSAxXSkpIHtcbiAgICAgICAgaWYgKHRoaXMucnVuTGVuZ3RoW24gLSAxXSA8IHRoaXMucnVuTGVuZ3RoW24gKyAxXSkge1xuICAgICAgICAgIG4tLTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnJ1bkxlbmd0aFtuXSA+IHRoaXMucnVuTGVuZ3RoW24gKyAxXSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMubWVyZ2VBdChuKTtcbiAgICB9XG4gIH1cblxuICBmb3JjZU1lcmdlUnVucygpIHtcbiAgICB3aGlsZSAodGhpcy5zdGFja1NpemUgPiAxKSB7XG4gICAgICBsZXQgbiA9IHRoaXMuc3RhY2tTaXplIC0gMjtcbiAgICAgIGlmIChuID4gMCAmJiB0aGlzLnJ1bkxlbmd0aFtuIC0gMV0gPCB0aGlzLnJ1bkxlbmd0aFtuICsgMV0pIHtcbiAgICAgICAgbi0tO1xuICAgICAgfVxuICAgICAgdGhpcy5tZXJnZUF0KG4pO1xuICAgIH1cbiAgfVxuXG4gIG1lcmdlQXQoaSkge1xuICAgIGNvbnN0IGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIGxldCBzdGFydDEgPSB0aGlzLnJ1blN0YXJ0W2ldO1xuICAgIGxldCBsZW5ndGgxID0gdGhpcy5ydW5MZW5ndGhbaV07XG4gICAgY29uc3Qgc3RhcnQyID0gdGhpcy5ydW5TdGFydFtpICsgMV07XG4gICAgbGV0IGxlbmd0aDIgPSB0aGlzLnJ1bkxlbmd0aFtpICsgMV07XG4gICAgdGhpcy5ydW5MZW5ndGhbaV0gPSBsZW5ndGgxICsgbGVuZ3RoMjtcbiAgICBpZiAoaSA9PT0gdGhpcy5zdGFja1NpemUgLSAzKSB7XG4gICAgICB0aGlzLnJ1blN0YXJ0W2kgKyAxXSA9IHRoaXMucnVuU3RhcnRbaSArIDJdO1xuICAgICAgdGhpcy5ydW5MZW5ndGhbaSArIDFdID0gdGhpcy5ydW5MZW5ndGhbaSArIDJdO1xuICAgIH1cbiAgICB0aGlzLnN0YWNrU2l6ZS0tO1xuICAgIGNvbnN0IGsgPSBUaW1zb3J0LmdhbGxvcFJpZ2h0KGFycmF5W3N0YXJ0Ml0sIGFycmF5LCBzdGFydDEsIGxlbmd0aDEsIDAsIGNvbXBhcmUpO1xuICAgIHN0YXJ0MSArPSBrO1xuICAgIGxlbmd0aDEgLT0gaztcbiAgICBpZiAobGVuZ3RoMSA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZW5ndGgyID0gVGltc29ydC5nYWxsb3BMZWZ0KGFycmF5W3N0YXJ0MSArIGxlbmd0aDEgLSAxXSwgYXJyYXksIHN0YXJ0MiwgbGVuZ3RoMiwgbGVuZ3RoMiAtIDEsIGNvbXBhcmUpO1xuICAgIGlmIChsZW5ndGgyID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsZW5ndGgxIDw9IGxlbmd0aDIpIHtcbiAgICAgIHRoaXMubWVyZ2VMb3coc3RhcnQxLCBsZW5ndGgxLCBzdGFydDIsIGxlbmd0aDIpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWVyZ2VIaWdoKHN0YXJ0MSwgbGVuZ3RoMSwgc3RhcnQyLCBsZW5ndGgyKTtcbiAgICB9XG4gIH1cblxuICBtZXJnZUxvdyhzdGFydDEsIGxlbmd0aDEsIHN0YXJ0MiwgbGVuZ3RoMikge1xuICAgIGNvbnN0IGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIGNvbnN0IHRtcCA9IHRoaXMudG1wO1xuICAgIGxldCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgxOyBpKyspIHtcbiAgICAgIHRtcFtpXSA9IGFycmF5W3N0YXJ0MSArIGldO1xuICAgIH1cbiAgICBsZXQgY3Vyc29yMSA9IDA7XG4gICAgbGV0IGN1cnNvcjIgPSBzdGFydDI7XG4gICAgbGV0IGRlc3QgPSBzdGFydDE7XG4gICAgYXJyYXlbZGVzdCsrXSA9IGFycmF5W2N1cnNvcjIrK107XG4gICAgaWYgKC0tbGVuZ3RoMiA9PT0gMCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDE7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSB0bXBbY3Vyc29yMSArIGldO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoMSA9PT0gMSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDI7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSBhcnJheVtjdXJzb3IyICsgaV07XG4gICAgICB9XG4gICAgICBhcnJheVtkZXN0ICsgbGVuZ3RoMl0gPSB0bXBbY3Vyc29yMV07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBtaW5HYWxsb3AgPSB0aGlzLm1pbkdhbGxvcDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGNvdW50MSA9IDA7XG4gICAgICBsZXQgY291bnQyID0gMDtcbiAgICAgIGxldCBleGl0ID0gZmFsc2U7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChjb21wYXJlKGFycmF5W2N1cnNvcjJdLCB0bXBbY3Vyc29yMV0pIDwgMCkge1xuICAgICAgICAgIGFycmF5W2Rlc3QrK10gPSBhcnJheVtjdXJzb3IyKytdO1xuICAgICAgICAgIGNvdW50MisrO1xuICAgICAgICAgIGNvdW50MSA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMiA9PT0gMCkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyYXlbZGVzdCsrXSA9IHRtcFtjdXJzb3IxKytdO1xuICAgICAgICAgIGNvdW50MSsrO1xuICAgICAgICAgIGNvdW50MiA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMSkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKChjb3VudDEgfCBjb3VudDIpIDwgbWluR2FsbG9wKTtcbiAgICAgIGlmIChleGl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZG8ge1xuICAgICAgICBjb3VudDEgPSBUaW1zb3J0LmdhbGxvcFJpZ2h0KGFycmF5W2N1cnNvcjJdLCB0bXAsIGN1cnNvcjEsIGxlbmd0aDEsIDAsIGNvbXBhcmUpO1xuICAgICAgICBpZiAoY291bnQxICE9PSAwKSB7XG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50MTsgaSsrKSB7XG4gICAgICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSB0bXBbY3Vyc29yMSArIGldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0ICs9IGNvdW50MTtcbiAgICAgICAgICBjdXJzb3IxICs9IGNvdW50MTtcbiAgICAgICAgICBsZW5ndGgxIC09IGNvdW50MTtcbiAgICAgICAgICBpZiAobGVuZ3RoMSA8PSAxKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcnJheVtkZXN0KytdID0gYXJyYXlbY3Vyc29yMisrXTtcbiAgICAgICAgaWYgKC0tbGVuZ3RoMiA9PT0gMCkge1xuICAgICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50MiA9IFRpbXNvcnQuZ2FsbG9wTGVmdCh0bXBbY3Vyc29yMV0sIGFycmF5LCBjdXJzb3IyLCBsZW5ndGgyLCAwLCBjb21wYXJlKTtcbiAgICAgICAgaWYgKGNvdW50MiAhPT0gMCkge1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDI7IGkrKykge1xuICAgICAgICAgICAgYXJyYXlbZGVzdCArIGldID0gYXJyYXlbY3Vyc29yMiArIGldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0ICs9IGNvdW50MjtcbiAgICAgICAgICBjdXJzb3IyICs9IGNvdW50MjtcbiAgICAgICAgICBsZW5ndGgyIC09IGNvdW50MjtcbiAgICAgICAgICBpZiAobGVuZ3RoMiA9PT0gMCkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJyYXlbZGVzdCsrXSA9IHRtcFtjdXJzb3IxKytdO1xuICAgICAgICBpZiAoLS1sZW5ndGgxID09PSAxKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbWluR2FsbG9wLS07XG4gICAgICB9IHdoaWxlIChjb3VudDEgPj0gVGltc29ydC5ERUZBVUxUX01JTl9HQUxMT1BJTkcgfHwgY291bnQyID49IFRpbXNvcnQuREVGQVVMVF9NSU5fR0FMTE9QSU5HKTtcbiAgICAgIGlmIChleGl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKG1pbkdhbGxvcCA8IDApIHtcbiAgICAgICAgbWluR2FsbG9wID0gMDtcbiAgICAgIH1cbiAgICAgIG1pbkdhbGxvcCArPSAyO1xuICAgIH1cbiAgICB0aGlzLm1pbkdhbGxvcCA9IG1pbkdhbGxvcDtcbiAgICBpZiAobWluR2FsbG9wIDwgMSkge1xuICAgICAgdGhpcy5taW5HYWxsb3AgPSAxO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoMSA9PT0gMSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDI7IGkrKykge1xuICAgICAgICBhcnJheVtkZXN0ICsgaV0gPSBhcnJheVtjdXJzb3IyICsgaV07XG4gICAgICB9XG4gICAgICBhcnJheVtkZXN0ICsgbGVuZ3RoMl0gPSB0bXBbY3Vyc29yMV07XG4gICAgfSBlbHNlIGlmIChsZW5ndGgxID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lcmdlTG93IHByZWNvbmRpdGlvbnMgd2VyZSBub3QgcmVzcGVjdGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGgxOyBpKyspIHtcbiAgICAgICAgYXJyYXlbZGVzdCArIGldID0gdG1wW2N1cnNvcjEgKyBpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtZXJnZUhpZ2goc3RhcnQxLCBsZW5ndGgxLCBzdGFydDIsIGxlbmd0aDIpIHtcbiAgICBjb25zdCBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5hcnJheTtcbiAgICBjb25zdCB0bXAgPSB0aGlzLnRtcDtcbiAgICBsZXQgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICB0bXBbaV0gPSBhcnJheVtzdGFydDIgKyBpXTtcbiAgICB9XG4gICAgbGV0IGN1cnNvcjEgPSBzdGFydDEgKyBsZW5ndGgxIC0gMTtcbiAgICBsZXQgY3Vyc29yMiA9IGxlbmd0aDIgLSAxO1xuICAgIGxldCBkZXN0ID0gc3RhcnQyICsgbGVuZ3RoMiAtIDE7XG4gICAgbGV0IGN1c3RvbUN1cnNvciA9IDA7XG4gICAgbGV0IGN1c3RvbURlc3QgPSAwO1xuICAgIGFycmF5W2Rlc3QtLV0gPSBhcnJheVtjdXJzb3IxLS1dO1xuICAgIGlmICgtLWxlbmd0aDEgPT09IDApIHtcbiAgICAgIGN1c3RvbUN1cnNvciA9IGRlc3QgLSAobGVuZ3RoMiAtIDEpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDI7IGkrKykge1xuICAgICAgICBhcnJheVtjdXN0b21DdXJzb3IgKyBpXSA9IHRtcFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxlbmd0aDIgPT09IDEpIHtcbiAgICAgIGRlc3QgLT0gbGVuZ3RoMTtcbiAgICAgIGN1cnNvcjEgLT0gbGVuZ3RoMTtcbiAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgIGN1c3RvbUN1cnNvciA9IGN1cnNvcjEgKyAxO1xuICAgICAgZm9yIChpID0gbGVuZ3RoMSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFycmF5W2N1c3RvbURlc3QgKyBpXSA9IGFycmF5W2N1c3RvbUN1cnNvciArIGldO1xuICAgICAgfVxuICAgICAgYXJyYXlbZGVzdF0gPSB0bXBbY3Vyc29yMl07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBtaW5HYWxsb3AgPSB0aGlzLm1pbkdhbGxvcDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGNvdW50MSA9IDA7XG4gICAgICBsZXQgY291bnQyID0gMDtcbiAgICAgIGxldCBleGl0ID0gZmFsc2U7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChjb21wYXJlKHRtcFtjdXJzb3IyXSwgYXJyYXlbY3Vyc29yMV0pIDwgMCkge1xuICAgICAgICAgIGFycmF5W2Rlc3QtLV0gPSBhcnJheVtjdXJzb3IxLS1dO1xuICAgICAgICAgIGNvdW50MSsrO1xuICAgICAgICAgIGNvdW50MiA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMSA9PT0gMCkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJyYXlbZGVzdC0tXSA9IHRtcFtjdXJzb3IyLS1dO1xuICAgICAgICAgIGNvdW50MisrO1xuICAgICAgICAgIGNvdW50MSA9IDA7XG4gICAgICAgICAgaWYgKC0tbGVuZ3RoMiA9PT0gMSkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKChjb3VudDEgfCBjb3VudDIpIDwgbWluR2FsbG9wKTtcbiAgICAgIGlmIChleGl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZG8ge1xuICAgICAgICBjb3VudDEgPSBsZW5ndGgxIC0gVGltc29ydC5nYWxsb3BSaWdodCh0bXBbY3Vyc29yMl0sIGFycmF5LCBzdGFydDEsIGxlbmd0aDEsIGxlbmd0aDEgLSAxLCBjb21wYXJlKTtcbiAgICAgICAgaWYgKGNvdW50MSAhPT0gMCkge1xuICAgICAgICAgIGRlc3QgLT0gY291bnQxO1xuICAgICAgICAgIGN1cnNvcjEgLT0gY291bnQxO1xuICAgICAgICAgIGxlbmd0aDEgLT0gY291bnQxO1xuICAgICAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgICAgICBjdXN0b21DdXJzb3IgPSBjdXJzb3IxICsgMTtcbiAgICAgICAgICBmb3IgKGkgPSBjb3VudDEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgYXJyYXlbY3VzdG9tRGVzdCArIGldID0gYXJyYXlbY3VzdG9tQ3Vyc29yICsgaV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChsZW5ndGgxID09PSAwKSB7XG4gICAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcnJheVtkZXN0LS1dID0gdG1wW2N1cnNvcjItLV07XG4gICAgICAgIGlmICgtLWxlbmd0aDIgPT09IDEpIHtcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb3VudDIgPSBsZW5ndGgyIC0gVGltc29ydC5nYWxsb3BMZWZ0KGFycmF5W2N1cnNvcjFdLCB0bXAsIDAsIGxlbmd0aDIsIGxlbmd0aDIgLSAxLCBjb21wYXJlKTtcbiAgICAgICAgaWYgKGNvdW50MiAhPT0gMCkge1xuICAgICAgICAgIGRlc3QgLT0gY291bnQyO1xuICAgICAgICAgIGN1cnNvcjIgLT0gY291bnQyO1xuICAgICAgICAgIGxlbmd0aDIgLT0gY291bnQyO1xuICAgICAgICAgIGN1c3RvbURlc3QgPSBkZXN0ICsgMTtcbiAgICAgICAgICBjdXN0b21DdXJzb3IgPSBjdXJzb3IyICsgMTtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQyOyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5W2N1c3RvbURlc3QgKyBpXSA9IHRtcFtjdXN0b21DdXJzb3IgKyBpXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxlbmd0aDIgPD0gMSkge1xuICAgICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJyYXlbZGVzdC0tXSA9IGFycmF5W2N1cnNvcjEtLV07XG4gICAgICAgIGlmICgtLWxlbmd0aDEgPT09IDApIHtcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtaW5HYWxsb3AtLTtcbiAgICAgIH0gd2hpbGUgKGNvdW50MSA+PSBUaW1zb3J0LkRFRkFVTFRfTUlOX0dBTExPUElORyB8fCBjb3VudDIgPj0gVGltc29ydC5ERUZBVUxUX01JTl9HQUxMT1BJTkcpO1xuICAgICAgaWYgKGV4aXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAobWluR2FsbG9wIDwgMCkge1xuICAgICAgICBtaW5HYWxsb3AgPSAwO1xuICAgICAgfVxuICAgICAgbWluR2FsbG9wICs9IDI7XG4gICAgfVxuICAgIHRoaXMubWluR2FsbG9wID0gbWluR2FsbG9wO1xuICAgIGlmIChtaW5HYWxsb3AgPCAxKSB7XG4gICAgICB0aGlzLm1pbkdhbGxvcCA9IDE7XG4gICAgfVxuICAgIGlmIChsZW5ndGgyID09PSAxKSB7XG4gICAgICBkZXN0IC09IGxlbmd0aDE7XG4gICAgICBjdXJzb3IxIC09IGxlbmd0aDE7XG4gICAgICBjdXN0b21EZXN0ID0gZGVzdCArIDE7XG4gICAgICBjdXN0b21DdXJzb3IgPSBjdXJzb3IxICsgMTtcbiAgICAgIGZvciAoaSA9IGxlbmd0aDEgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcnJheVtjdXN0b21EZXN0ICsgaV0gPSBhcnJheVtjdXN0b21DdXJzb3IgKyBpXTtcbiAgICAgIH1cbiAgICAgIGFycmF5W2Rlc3RdID0gdG1wW2N1cnNvcjJdO1xuICAgIH0gZWxzZSBpZiAobGVuZ3RoMiA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXJnZUhpZ2ggcHJlY29uZGl0aW9ucyB3ZXJlIG5vdCByZXNwZWN0ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VzdG9tQ3Vyc29yID0gZGVzdCAtIChsZW5ndGgyIC0gMSk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoMjsgaSsrKSB7XG4gICAgICAgIGFycmF5W2N1c3RvbUN1cnNvciArIGldID0gdG1wW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
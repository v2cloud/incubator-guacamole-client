/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * A directive which allows elements to be manually scrolled, and for their
 * scroll state to be observed.
 */
angular.module('element').directive('v2cClickOutside', ['$document', '$parse', '$timeout',
    function v2cClickOutside($document, $parse, $timeout) {

    return {
        restrict: 'A',
        link: function v2cClickOutside($scope, elem, attr) {
            // postpone linking to next digest to allow for unique id generation
            $timeout(function () {
                var classList = (attr.v2cClickOutsideIgnore !== undefined) ? 
                    attr.v2cClickOutsideIgnore.split(/[ ,]+/) : [], fn;

                function eventHandler(e) {

                    var i,
                        element,
                        r,
                        id,
                        classNames,
                        l;

                    // check if our element already hidden and abort if so
                    if (angular.element(elem).hasClass("ng-hide")) {
                        return;
                    }

                    // if there is no click target, no point going on
                    if (!e || !e.target) {
                        return;
                    }

                    // loop through the available elements, looking for classes in the class list that might match and so will eat
                    for (element = e.target; element; element = element.parentNode) {
                        // check if the element is the same element the directive is attached to and exit if so
                        if (element === elem[0]) {
                            return;
                        }

                        // now we have done the initial checks, start gathering id's and classes
                        id = element.id,
                            classNames = element.className,
                            l = classList.length;

                        // Unwrap SVGAnimatedString classes
                        if (classNames && classNames.baseVal !== undefined) {
                            classNames = classNames.baseVal;
                        }

                        // if there are no class names on the element clicked, skip the check
                        if (classNames || id) {

                            // loop through the elements id's and classnames looking for exceptions
                            for (i = 0; i < l; i++) {
                                //prepare regex for class word matching
                                r = new RegExp('\\b' + classList[i] + '\\b');

                                // check for exact matches on id's or classes, but only if they exist in the first place
                                if ((id !== undefined && id === classList[i]) || (classNames && r.test(classNames))) {
                                    // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                                    return;
                                }
                            }
                        }
                    }
                    // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
                    $timeout(function () {
                        fn = $parse(attr['v2cClickOutside']);
                        fn($scope);
                    });
                }

                // if the devices has a touchscreen, listen for this event
                if (_hasTouch()) {
                    $document.on('touchstart', eventHandler);
                }

                // still listen for the click event even if there is touch to cater for touchscreen laptops
                $document.on('click', eventHandler);

                // when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
                $scope.$on('$destroy', function () {
                    if (_hasTouch()) {
                        $document.off('touchstart', eventHandler);
                    }

                    $document.off('click', eventHandler);
                });

                /**
                 * @description Private function to attempt to figure out if we are on a touch device
                 * @private
                 **/
                function _hasTouch() {
                    // works on most browsers, IE10/11 and Surface
                    return 'ontouchstart' in window || navigator.maxTouchPoints;
                }
            });
        }
    };

}]);
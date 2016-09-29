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
 * A directive to quickly use the HTML5 fullscreen API
 */
angular.module('dialog').directive('fullscreen', ['fullscreenService', function fullscreen(fullscreenService) {
    return {
        link: function ($scope, $element, $attrs) {
            // Watch for changes on scope if model is provided
            if ($attrs.fullscreen) {
                $scope.$watch($attrs.fullscreen, function (value) {
                    var isEnabled = fullscreenService.isEnabled();
                    if (value && !isEnabled) {
                        fullscreenService.enable($element[0]);
                        $element.addClass('isInFullScreen');
                    } else if (!value && isEnabled) {
                        fullscreenService.cancel();
                        $element.removeClass('isInFullScreen');
                    }
                });

                // Listen on the `FBFullscreen.change`
                // the event will fire when anything changes the fullscreen mode
                var removeFullscreenHandler = fullscreenService.$on('Fullscreen.change',
                    function (evt, isFullscreenEnabled) {
                        if (!isFullscreenEnabled) {
                            $scope.$evalAsync(function () {
                                $scope.$eval($attrs.fullscreen + '= false');
                                $element.removeClass('isInFullScreen');
                            });
                        }
                    });

                $scope.$on('$destroy', function () {
                    removeFullscreenHandler();
                });

            } else {
                if ($attrs.onlyWatchedProperty !== undefined) {
                    return;
                }

                $element.on('click', function (ev) {
                    Fullscreen.enable($element[0]);
                });
            }
        }
    };
}]);
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
 * Service to quickly use the HTML5 fullscreen API
 */
angular.module('fullscreen').factory('fullscreenService',
    ['$document', '$rootScope',
        function ($document, $rootScope) {

            var document = $document[0];

            // ensure ALLOW_KEYBOARD_INPUT is available and enabled
            var isKeyboardAvailbleOnFullScreen = 
                (typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element) && Element.ALLOW_KEYBOARD_INPUT;

            var emitter = $rootScope.$new();

            // listen event on document instead of element to avoid firefox limitation
            // see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
            $document.on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
                emitter.$emit('Fullscreen.change', serviceInstance.isEnabled());
            });

            var serviceInstance = {
                $on: angular.bind(emitter, emitter.$on),
                all: function () {
                    serviceInstance.enable(document.documentElement);
                },
                enable: function (element) {
                    if (element.requestFullScreen) {
                        element.requestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        // Safari temporary fix
                        if (/Version\/[\d]{1,2}(\.[\d]{1,2}){1}(\.(\d){1,2}){0,1} Safari/.test(navigator.userAgent)) {
                            element.webkitRequestFullscreen();
                        } else {
                            element.webkitRequestFullscreen(isKeyboardAvailbleOnFullScreen);
                        }
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                },
                cancel: function () {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                },
                isEnabled: function () {
                    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
                        document.webkitFullscreenElement || document.msFullscreenElement;
                    return fullscreenElement ? true : false;
                },
                toggleAll: function () {
                    serviceInstance.isEnabled() ? serviceInstance.cancel() : serviceInstance.all();
                },
                isSupported: function () {
                    var docElm = document.documentElement;
                    var requestFullscreen = docElm.requestFullScreen || docElm.mozRequestFullScreen || 
                        docElm.webkitRequestFullscreen || docElm.msRequestFullscreen;
                    return requestFullscreen ? true : false;
                }
            };

            return serviceInstance;


        }]);

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
 * A directive for the guacamole client.
 */
angular.module('client').directive('guacClient', [function guacClient() {

    return {
        // Element only
        restrict: 'E',
        replace: true,
        scope: {

            /**
             * The client to display within this guacClient directive.
             * 
             * @type ManagedClient
             */
            client : '='
            
        },
        templateUrl: 'app/client/templates/guacClient.html',
        controller: ['$scope', '$injector', '$element', function guacClientController($scope, $injector, $element) {
   
            // Required types
            var ManagedClient = $injector.get('ManagedClient');
                
            // Required services
            var $window = $injector.get('$window');
                
            /**
             * Whether the local, hardware mouse cursor is in use.
             * 
             * @type Boolean
             */
            var localCursor = false;

            /**
             * The current Guacamole client instance.
             * 
             * @type Guacamole.Client 
             */
            var client = null;

            /**
             * The display of the current Guacamole client instance.
             * 
             * @type Guacamole.Display
             */
            var display = null;

            /**
             * The element associated with the display of the current
             * Guacamole client instance.
             *
             * @type Element
             */
            var displayElement = null;

            /**
             * The element which must contain the Guacamole display element.
             *
             * @type Element
             */
            var displayContainer = $element.find('.display')[0];

            /**
             * The main containing element for the entire directive.
             * 
             * @type Element
             */
            var main = $element[0];

            /**
             * The element which functions as a detector for size changes.
             * 
             * @type Element
             */
            var resizeSensor = $element.find('.resize-sensor')[0];

            /**
             * Guacamole mouse event object, wrapped around the main client
             * display.
             *
             * @type Guacamole.Mouse
             */
            var mouse = new Guacamole.Mouse(displayContainer);

            /**
             * Guacamole absolute mouse emulation object, wrapped around the
             * main client display.
             *
             * @type Guacamole.Mouse.Touchscreen
             */
            var touchScreen = new Guacamole.Mouse.Touchscreen(displayContainer);

            /**
             * Guacamole relative mouse emulation object, wrapped around the
             * main client display.
             *
             * @type Guacamole.Mouse.Touchpad
             */
            var touchPad = new Guacamole.Mouse.Touchpad(displayContainer);

            /**
             * Updates the scale of the attached Guacamole.Client based on current window
             * size and "auto-fit" setting.
             */
            var updateDisplayScale = function updateDisplayScale() {

                if (!display) return;

                // Calculate scale to fit screen
                $scope.client.clientProperties.minScale = Math.min(
                    main.offsetWidth  / Math.max(display.getWidth(),  1),
                    main.offsetHeight / Math.max(display.getHeight(), 1)
                );

                // Calculate appropriate maximum zoom level
                $scope.client.clientProperties.maxScale = Math.max($scope.client.clientProperties.minScale, 3);

                // Clamp zoom level, maintain auto-fit
                if (display.getScale() < $scope.client.clientProperties.minScale || $scope.client.clientProperties.autoFit)
                    $scope.client.clientProperties.scale = $scope.client.clientProperties.minScale;

                else if (display.getScale() > $scope.client.clientProperties.maxScale)
                    $scope.client.clientProperties.scale = $scope.client.clientProperties.maxScale;

            };

            /**
             * Scrolls the client view such that the mouse cursor is visible.
             *
             * @param {Guacamole.Mouse.State} mouseState The current mouse
             *                                           state.
             */
            var scrollToMouse = function scrollToMouse(mouseState) {

                // Determine mouse position within view
                var mouse_view_x = mouseState.x + displayContainer.offsetLeft - main.scrollLeft;
                var mouse_view_y = mouseState.y + displayContainer.offsetTop  - main.scrollTop;

                // Determine viewport dimensions
                var view_width  = main.offsetWidth;
                var view_height = main.offsetHeight;

                // Determine scroll amounts based on mouse position relative to document

                var scroll_amount_x;
                if (mouse_view_x > view_width)
                    scroll_amount_x = mouse_view_x - view_width;
                else if (mouse_view_x < 0)
                    scroll_amount_x = mouse_view_x;
                else
                    scroll_amount_x = 0;

                var scroll_amount_y;
                if (mouse_view_y > view_height)
                    scroll_amount_y = mouse_view_y - view_height;
                else if (mouse_view_y < 0)
                    scroll_amount_y = mouse_view_y;
                else
                    scroll_amount_y = 0;

                // Scroll (if necessary) to keep mouse on screen.
                main.scrollLeft += scroll_amount_x;
                main.scrollTop  += scroll_amount_y;

            };

            /**
             * Sends the given mouse state to the current client.
             *
             * @param {Guacamole.Mouse.State} mouseState The mouse state to
             *                                           send.
             */
            var sendScaledMouseState = function sendScaledMouseState(mouseState) {

                // Scale event by current scale
                var scaledState = new Guacamole.Mouse.State(
                        mouseState.x / display.getScale(),
                        mouseState.y / display.getScale(),
                        mouseState.left,
                        mouseState.middle,
                        mouseState.right,
                        mouseState.up,
                        mouseState.down);

                // Send mouse event
                client.sendMouseState(scaledState);

            };

            /**
             * Handles a mouse event originating from the user's actual mouse.
             * This differs from handleEmulatedMouseState() in that the
             * software mouse cursor must be shown only if the user's browser
             * does not support explicitly setting the hardware mouse cursor.
             *
             * @param {Guacamole.Mouse.State} mouseState
             *     The current state of the user's hardware mouse.
             */
            var handleMouseState = function handleMouseState(mouseState) {

                // Do not attempt to handle mouse state changes if the client
                // or display are not yet available
                if (!client || !display)
                    return;

                // Send mouse state, show cursor if necessary
                display.showCursor(!localCursor);
                sendScaledMouseState(mouseState);

            };

            /**
             * Handles a mouse event originating from one of Guacamole's mouse
             * emulation objects. This differs from handleMouseState() in that
             * the software mouse cursor must always be shown (as the emulated
             * mouse device will not have its own cursor).
             *
             * @param {Guacamole.Mouse.State} mouseState
             *     The current state of the user's emulated (touch) mouse.
             */
            var handleEmulatedMouseState = function handleEmulatedMouseState(mouseState) {

                // Do not attempt to handle mouse state changes if the client
                // or display are not yet available
                if (!client || !display)
                    return;

                // Ensure software cursor is shown
                display.showCursor(true);

                // Send mouse state, ensure cursor is visible
                scrollToMouse(mouseState);
                sendScaledMouseState(mouseState);

            };

            // Attach any given managed client
            $scope.$watch('client', function attachManagedClient(managedClient) {

                // Remove any existing display
                displayContainer.innerHTML = "";

                // Only proceed if a client is given 
                if (!managedClient)
                    return;

                // Get Guacamole client instance
                client = managedClient.client;

                // Attach possibly new display
                display = client.getDisplay();
                display.scale($scope.client.clientProperties.scale);

                // Add display element
                displayElement = display.getElement();
                displayContainer.appendChild(displayElement);

                // Do nothing when the display element is clicked on
                display.getElement().onclick = function(e) {
                    e.preventDefault();
                    return false;
                };

            });

            // Update actual view scrollLeft when scroll properties change
            $scope.$watch('client.clientProperties.scrollLeft', function scrollLeftChanged(scrollLeft) {
                main.scrollLeft = scrollLeft;
                $scope.client.clientProperties.scrollLeft = main.scrollLeft;
            });

            // Update actual view scrollTop when scroll properties change
            $scope.$watch('client.clientProperties.scrollTop', function scrollTopChanged(scrollTop) {
                main.scrollTop = scrollTop;
                $scope.client.clientProperties.scrollTop = main.scrollTop;
            });

            // Update scale when display is resized
            $scope.$watch('client.managedDisplay.size', function setDisplaySize() {
                $scope.$evalAsync(updateDisplayScale);
            });

            // Keep local cursor up-to-date
            $scope.$watch('client.managedDisplay.cursor', function setCursor(cursor) {
                if (cursor)
                    localCursor = mouse.setCursor(cursor.canvas, cursor.x, cursor.y);
            });

            // Swap mouse emulation modes depending on absolute mode flag
            $scope.$watch('client.clientProperties.emulateAbsoluteMouse',
                function mouseEmulationModeChanged(emulateAbsoluteMouse) {

                var newMode, oldMode;

                // Switch to touchscreen if absolute
                if (emulateAbsoluteMouse) {
                    newMode = touchScreen;
                    oldMode = touchPad;
                }

                // Switch to touchpad if not absolute (relative)
                else {
                    newMode = touchPad;
                    oldMode = touchScreen;
                }

                // Set applicable mouse emulation object, unset the old one
                if (newMode) {

                    // Clear old handlers and copy state to new emulation mode
                    if (oldMode) {
                        oldMode.onmousedown = oldMode.onmouseup = oldMode.onmousemove = null;
                        newMode.currentState.x = oldMode.currentState.x;
                        newMode.currentState.y = oldMode.currentState.y;
                    }

                    // Handle emulated events only from the new emulation mode
                    newMode.onmousedown =
                    newMode.onmouseup   =
                    newMode.onmousemove = handleEmulatedMouseState;

                }

            });

            // Adjust scale if modified externally
            $scope.$watch('client.clientProperties.scale', function changeScale(scale) {

                // Fix scale within limits
                scale = Math.max(scale, $scope.client.clientProperties.minScale);
                scale = Math.min(scale, $scope.client.clientProperties.maxScale);

                // If at minimum zoom level, hide scroll bars
                if (scale === $scope.client.clientProperties.minScale)
                    main.style.overflow = "hidden";

                // If not at minimum zoom level, show scroll bars
                else
                    main.style.overflow = "auto";

                // Apply scale if client attached
                if (display)
                    display.scale(scale);
                
                if (scale !== $scope.client.clientProperties.scale)
                    $scope.client.clientProperties.scale = scale;

            });
            
            // If autofit is set, the scale should be set to the minimum scale, filling the screen
            $scope.$watch('client.clientProperties.autoFit', function changeAutoFit(autoFit) {
                if(autoFit)
                    $scope.client.clientProperties.scale = $scope.client.clientProperties.minScale;
            });

            var isMobile = function isMobile() {
                var isMobile = false;
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
                    isMobile = true;
                return isMobile;
            };
            
            // If the element is resized, attempt to resize client
            $scope.mainElementResized = function mainElementResized() {
                // Send new display size, if changed
                if (client && display && !isMobile() ) {

                    var pixelDensity = $window.devicePixelRatio || 1;
                    var width  = main.offsetWidth  * pixelDensity;
                    var height = main.offsetHeight * pixelDensity;
                    if (display.getWidth() !== width || display.getHeight() !== height)
                        client.sendSize(width, height);

                }

                $scope.$evalAsync(updateDisplayScale);

            };

            // Ensure focus is regained via mousedown before forwarding event
            mouse.onmousedown = function(mouseState) {
                document.body.focus();
                handleMouseState(mouseState);
            };

            // Forward mouseup / mousemove events untouched
            mouse.onmouseup   =
            mouse.onmousemove = handleMouseState;

            // Hide software cursor when mouse leaves display
            mouse.onmouseout = function() {
                if (!display) return;
                display.showCursor(false);
            };

            // Update remote clipboard if local clipboard changes
            $scope.$on('guacClipboard', function onClipboard(event, data) {
                if (client) {
                    ManagedClient.setClipboard($scope.client, data);
                    $scope.client.clipboardData = data;
                }
            });

            // Translate local keydown events to remote keydown events if keyboard is enabled
            $scope.$on('guacKeydown', function keydownListener(event, keysym, keyboard) {
                if ($scope.client.clientProperties.keyboardEnabled && !event.defaultPrevented) {
                    client.sendKeyEvent(1, keysym);
                    event.preventDefault();
                }
            });
            
            // Translate local keyup events to remote keyup events if keyboard is enabled
            $scope.$on('guacKeyup', function keyupListener(event, keysym, keyboard) {
                if ($scope.client.clientProperties.keyboardEnabled && !event.defaultPrevented) {
                    client.sendKeyEvent(0, keysym);
                    event.preventDefault();
                }   
            });

            // Universally handle all synthetic keydown events
            $scope.$on('guacSyntheticKeydown', function syntheticKeydownListener(event, keysym) {
                client.sendKeyEvent(1, keysym);
            });
            
            // Universally handle all synthetic keyup events
            $scope.$on('guacSyntheticKeyup', function syntheticKeyupListener(event, keysym) {
                client.sendKeyEvent(0, keysym);
            });
            
            /**
             * Ignores the given event.
             * 
             * @param {Event} e The event to ignore.
             */
            function ignoreEvent(e) {
               e.preventDefault();
               e.stopPropagation();
            }

            // Handle and ignore dragenter/dragover
            displayContainer.addEventListener("dragenter", ignoreEvent, false);
            displayContainer.addEventListener("dragover",  ignoreEvent, false);

            // File drop event handler
            displayContainer.addEventListener("drop", function(e) {

                e.preventDefault();
                e.stopPropagation();

                // Ignore file drops if no attached client
                if (!$scope.client)
                    return;

                // Upload each file 
                var files = e.dataTransfer.files;
                for (var i=0; i<files.length; i++)
                    ManagedClient.uploadFile($scope.client, files[i]);

            }, false);

            /*
             * END CLIENT DIRECTIVE                                           
             */
                
        }]
    };
}]);
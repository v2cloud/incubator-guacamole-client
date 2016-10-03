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
 * A directive which displays a task bar.
 */
angular.module('taskBar').directive('v2cTaskBar', [function v2cTaskBar($document) {
    return {
        restrict: 'E',
        replace: true,
        scope: {

            /**
             * Optional array of buttons which are specific to this particular
             * location, as these buttons may not be appropriate for other
             * locations which contain the user menu.
             *
             * @type V2cTaskBarButton[]
             */
            localButtons: '=',

            /**
             * Whether the taskBar is shown or not.
             *
             * @type Boolean
             */
            taskBarShown: '='
        },
        templateUrl: 'app/taskBar/templates/v2cTaskBar.html',
        controller: ['$scope', '$route', '$location', '$document', '$window', '$timeout',
            'v2cDialogService', 'authenticationService', 'fullscreenService',
            function v2cTaskBarController($scope,
                                          $route,
                                          $location,
                                          $document,
                                          $window,
                                          $timeout,
                                          v2cDialogService,
                                          authenticationService,
                                          fullscreenService) {

                $scope.shown = $scope.taskBarShown;
                
                var document = $document[0];

                /**
                 * Logs out the current user, redirecting them to back to the root
                 * after logout completes.
                 */
                $scope.logout = function logout() {
                    authenticationService.logout()['finally'](
                        function logoutComplete() {
                            if ($location.path() !== '/')
                                $location.url('/');
                            else
                                $route.reload();
                        });
                };


                /**
                 * Action which toggle the fullscreen mode.
                 */
                var FULL_SCREEN_ACTION = {
                    name: 'V2CLOUD_TASK_BAR.ACTION_V2C_FULL_SCREEN',
                    className: 'task-bar-button-action full-screen-action',
                    callback: function () {
                        if (fullscreenService.isEnabled())
                            fullscreenService.cancel();
                        else {
                            var element = document.getElementsByTagName("body")[0];
                            fullscreenService.enable(element);
                        }
                        $timeout(function(){
                            $scope.$emit('v2cReconnectClient')
                        }, 300);
                    }
                };

                /**
                 * Action which fit the viewport to screen.
                 */
                var FIT_SCREEN_ACTION = {
                    name: 'V2CLOUD_TASK_BAR.ACTION_V2C_FIT_SCREEN',
                    className: 'task-bar-button-action fit-screen-action',
                    callback: function () {
                        $scope.$emit('v2cReconnectClient');
                    }
                };

                /**
                 * Action which displays the file transfer window.
                 */
                var FILE_TRANSFER_ACTION = {
                    name: 'V2CLOUD_TASK_BAR.ACTION_V2C_FILE_TRANSFER',
                    className: 'task-bar-button-action file-transfer-action',
                    callback: v2cDialogService.showFileTransferDialog(function () {})
                };

                /**
                 * Action which displays the help window.
                 */
                var HELP_ACTION = {
                    name: 'V2CLOUD_TASK_BAR.ACTION_V2C_HELP',
                    className: 'task-bar-button-action help-action',
                    callback: v2cDialogService.showHelpDialog(function () {})
                };

                /**
                 * Action which logs out the current user, redirecting them to back
                 * to the login screen after logout completes.
                 */
                var LOGOUT_ACTION = {
                        name: 'V2CLOUD_TASK_BAR.ACTION_V2C_LOGOUT',
                        className: 'task-bar-button-action logout-action',
                        callback: $scope.logout
                    };

                /**
                 * V2Cloud Button which always appear in the task bar.
                 */
                var V2_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.V2_BUTTON',
                    className: 'task-bar-button',
                    actions: [
                        FULL_SCREEN_ACTION,
                        FIT_SCREEN_ACTION,
                        FILE_TRANSFER_ACTION,
                        HELP_ACTION,
                        LOGOUT_ACTION
                    ]
                };

                $scope.buttons = [V2_BUTTON];

                $scope.$watch('taskBarShown', function taskBarVisibilityChanged(isTaskBarShown) {
                    $scope.shown = isTaskBarShown;
                });


                var TASK_BAR_DRAG_DELTA = 100;
                var TASK_BAR_DRAG_VERTICAL_TOLERANCE = 10;

                // Update menu or client based on dragging gestures
                $scope.taskBarDrag = function clientDrag(inProgress, startX, startY, currentX, currentY, deltaX, deltaY) {
                    if (Math.abs(currentY - startY) < TASK_BAR_DRAG_VERTICAL_TOLERANCE
                        && currentX - startX >= TASK_BAR_DRAG_DELTA)
                        $scope.$emit('v2cToggleTextInput');
                    return false;
                };
            }]
    }
}]);
    
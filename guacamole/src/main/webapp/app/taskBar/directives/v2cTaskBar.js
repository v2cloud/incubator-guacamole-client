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
            'v2cDialogService', 'authenticationService', 'fullscreenService', '$cookieStore',
            function v2cTaskBarController($scope,
                                          $route,
                                          $location,
                                          $document,
                                          $window,
                                          $timeout,
                                          v2cDialogService,
                                          authenticationService,
                                          fullscreenService, 
                                          $cookieStore) {

                $scope.shown = $scope.taskBarShown;

                var document = $document[0];
                
                var FIRST_VISIT_COOKIE_ID = 'V2C_FIRST_VISIT';

                /**
                 * Logs out the current user, redirecting them to back to the root
                 * after logout completes.
                 */
                $scope.logout = function logout() {
                    authenticationService.logout()['finally'](function logoutComplete() {
                        var parameter = $location.search();
                        if (parameter.hasOwnProperty('logoutPage')) {
                            parameter['logoutPage'] += '/logout/';
                        }
                        $location.url('/?' + jQuery.param(parameter));
                    });
                };


                /**
                 * Action which toggle the fullscreen mode.
                 */
                var FULL_SCREEN_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_FULL_SCREEN',
                    className: 'task-bar-button-full-screen',
                    iconClassName: 'fa fa-arrows-alt',
                    callback: function () {
                        if (fullscreenService.isEnabled())
                            fullscreenService.cancel();
                        else {
                            var element = document.getElementsByTagName("body")[0];
                            fullscreenService.enable(element);
                        }
                        $timeout(function () {
                            $scope.$emit('v2cReconnectClient')
                        }, 300);
                    }
                };

                /**
                 * Action which fit the viewport to screen.
                 */
                var FIT_SCREEN_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_FIT_SCREEN',
                    className: 'task-bar-button-fit-screen',
                    callback: function () {
                        $scope.$emit('v2cReconnectClient');
                    }
                };

                /**
                 * Action which displays the file transfer window.
                 */
                var FILE_TRANSFER_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_FILE_TRANSFER',
                    className: 'task-bar-button-file-transfer',
                    iconClassName: 'fa fa-cloud-upload',
                    callback: v2cDialogService.showFileTransferDialog(function () {
                    })
                };


                var openHelpDialogIfFirstVisit = function () {
                    var data = $cookieStore.get(FIRST_VISIT_COOKIE_ID);
                    if (!data) {
                        document.cookie = FIRST_VISIT_COOKIE_ID + "=visited;expires=Thu, 31 Dec 2037 23:59:59 GMT;path=/";
                        v2cDialogService.showHelpDialog(null)();
                    }
                };
                
                /**
                 * Action which displays the help window.
                 */
                var HELP_BUTTON= {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_HELP',
                    className: 'task-bar-button-help',
                    iconClassName: 'fa fa-question',
                    callback: v2cDialogService.showHelpDialog(null)
                };

                

                /**
                 * Action which logs out the current user, redirecting them to back
                 * to the login screen after logout completes.
                 */
                var LOGOUT_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_LOGOUT',
                    className: 'task-bar-button-logout',
                    iconClassName: 'fa fa-sign-out',
                    callback: $scope.logout
                };

                /**
                 * Button Which toggle the text input bar.
                 */
                var TOGGLE_TEXT_INPUT_BUTTON = {
                    name: 'V2CLOUD_TASK_BAR.BUTTON_V2C_INPUT',
                    className: 'task-bar-button-keyboard',
                    iconClassName: 'fa fa-keyboard-o',
                    mobileOnly: true,
                    callback: function () {
                        $scope.$emit('v2cToggleTextInput');
                    }
                };

                $scope.buttons = [
                    TOGGLE_TEXT_INPUT_BUTTON,
                    FULL_SCREEN_BUTTON,
                    FILE_TRANSFER_BUTTON,
                    LOGOUT_BUTTON,
                    HELP_BUTTON
                    ];

                $scope.$watch('taskBarShown', function taskBarVisibilityChanged(isTaskBarShown) {
                    $scope.shown = isTaskBarShown;
                });

                $timeout(function () { openHelpDialogIfFirstVisit(); }, 5000);

            }]
    }
}]);
    
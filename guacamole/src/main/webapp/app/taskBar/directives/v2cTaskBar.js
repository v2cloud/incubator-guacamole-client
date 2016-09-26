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
angular.module('taskBar').directive('v2cTaskBar', [function v2cTaskBar() {
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
            localButtons : '=',
            
            /**
             * Whether the taskBar is shown or not.
             *
             * @type Boolean
             */
            taskBarShown : '='
        },
        templateUrl: 'app/taskBar/templates/v2cTaskBar.html',
        controller: ['$scope', function v2cTaskBarController($scope) {

            $scope.shown = $scope.taskBarShown;
            
            $scope.emptyFunc = function(){ return undefined;};
            
            /**
             * Action which toggle the fullscreen mode.
             */
            var FULL_SCREEN_ACTION = {
                name      : 'V2CLOUD_TASK_BAR.ACTION_V2C_FULL_SCREEN',
                className : 'task-bar-button-action full-screen-action',
                callback  : $scope.emptyFunc
            };
            
            /**
             * Action which reloads the page.
             */
            var RELOAD_PAGE_ACTION = {
                name      : 'V2CLOUD_TASK_BAR.ACTION_V2C_RELOAD_PAGE',
                className : 'task-bar-button-action reload-page-action',
                callback  : $scope.emptyFunc
            };
            
            /**
             * Action which displays the file transfer window.
             */
            var FILE_TRANSFER_ACTION = {
                name      : 'V2CLOUD_TASK_BAR.ACTION_V2C_FILE_TRANSFER',
                className : 'task-bar-button-action file-transfer-action',
                callback  : $scope.emptyFunc
            };
            
            /**
             * Action which displays the help window.
             */
            var HELP_ACTION = {
                name      : 'V2CLOUD_TASK_BAR.ACTION_V2C_HELP',
                className : 'task-bar-button-action help-action',
                callback  : $scope.emptyFunc
            };
            
            /**
             * Action which logs out the current user, redirecting them to back
             * to the login screen after logout completes.
             */
            var LOGOUT_ACTION = {
                name      : 'V2CLOUD_TASK_BAR.ACTION_V2C_LOGOUT',
                className : 'task-bar-button-action logout-action',
                callback  : $scope.emptyFunc
            };
            
            /**
             * V2Cloud Button which always appear in the task bar.
             */
            var V2_BUTTON = {
                name      : 'V2CLOUD_TASK_BAR.V2_BUTTON',
                className : 'task-bar-button',
                actions   : [ 
                    FULL_SCREEN_ACTION,
                    RELOAD_PAGE_ACTION,
                    FILE_TRANSFER_ACTION,
                    HELP_ACTION,
                    LOGOUT_ACTION
                ]
            };
            
            $scope.buttons = [ V2_BUTTON ];
            
            $scope.$watch('taskBarShown', function taskBarVisibilityChanged(isTaskBarShown) {
                $scope.shown = isTaskBarShown;
            });
            
        }]
    }
}]);
    
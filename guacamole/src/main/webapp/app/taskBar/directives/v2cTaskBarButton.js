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
 * A directive which displays a task bar button.
 */
angular.module('taskBar').directive('v2cTaskBarButton', [function v2cTaskBarButton() {
    
    return {
        restrict: 'E',
        replace: true,
        scope: {
            /**
             * Reference to the button.
             * 
             * @type V2cTaskBarButton
             */
            button : '='
        },
    
        templateUrl: 'app/taskBar/templates/v2cTaskBarButton.html',
        controller: ['$scope', function v2cTaskBarController($scope) {
            /**
             * Whether the contents of the menu are currently shown.
             *
             * @type Boolean
             */
            $scope.menuShown = false;

            $scope.toggleButtonMenu = function toggleButtonMenu() {
                $scope.menuShown = !$scope.menuShown;
            };
        }]
    }
}]);

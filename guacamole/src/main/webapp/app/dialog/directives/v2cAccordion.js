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
 * A directive which displays a v2 cloud Accordion
 */
angular.module('dialog').directive('v2cAccordion', [function v2cAccordion() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            /**
             * List of items object to display in this accordion
             */
            localItems: '='
        },
        templateUrl: 'app/dialog/templates/v2cAccordion.html',
        controller: ['$scope', function v2cAccordionController($scope) {
            // We can use this controller to add logic to the accordion
            
            $scope.CAROUSSEL_TYPE = 'CAROUSEL';
            $scope.TEXT_TYPE = 'TEXT';
            $scope.FILE_SYSTEM_TYPE ='FILE_SYSTEM';
            
            $scope.oneAtATime = true;

            $scope.open = {};
            for (var i = 0; i < $scope.localItems.length; i++) {
                $scope.open[i] = i == 0;
            }
        }]
    }
}]);
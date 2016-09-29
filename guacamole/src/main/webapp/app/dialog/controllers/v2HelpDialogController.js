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
 * The controller for the help dialog.
 */
angular.module('dialog').controller('v2cHelpDialogController',
    ['$scope', '$uibModalInstance', function v2cHelpDialogController($scope, $uibModalInstance) {
        
               
        var PANEL_1 = {
            title: "1. How to open menu",
            type: 'CAROUSEL',
            pages:[
                {image: 'images/help-dialog-images/click-on-v2-menu.jpg'},
                {image: 'images/help-dialog-images/v2-menu-opened.jpg'}
            ]
        };

        var PANEL_2 = {
            title: "2. How to download files",
            type: 'CAROUSEL',
            pages:[
                {image: 'images/help-dialog-images/click-on-v2-menu.jpg'},
                {image: 'images/help-dialog-images/click-on-file-transfer.jpg'},
                {image: 'images/help-dialog-images/click-on-the-file-to-download.jpg'}
            ]
        };

        var PANEL_3 = {
            title: "3. How to upload files",
            type: 'CAROUSEL',
            pages:[
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'}
            ]
        };

        var PANEL_4 = {
            title: "4. How to copy/paste",
            type: 'TEXT',
            // The content can be html
            content: "You can copy/paste text between V2 Cloud and your local PC normally."
        };
        
        var PANEL_5 = {
            title: "5. How to print",
            type: 'CAROUSEL',
            pages: [
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'}
            ]
        };


        $scope.helpPanels = [PANEL_1, PANEL_2, PANEL_3, PANEL_4 , PANEL_5];
                
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }]);
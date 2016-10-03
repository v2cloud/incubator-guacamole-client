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

        var PANEL_HOW_TO_DOWNLOAD_FILES = {
            title: "V2CLOUD_HELP_PANEL.TITLE_PANEL_HOW_TO_DOWNLOAD_FILES",
            type: 'CAROUSEL',
            pages:[
                {image: 'images/help-dialog-images/click-on-v2-menu.jpg'},
                {image: 'images/help-dialog-images/click-on-file-transfer.jpg'},
                {image: 'images/help-dialog-images/click-on-the-file-to-download.jpg'}
            ]
        };

        var PANEL_HOW_TO_UPLOAD_FILES = {
            title: "V2CLOUD_HELP_PANEL.TITLE_PANEL_HOW_TO_UPLOAD_FILES",
            type: 'CAROUSEL',
            pages:[
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'}
            ]
        };

        var PANEL_HOW_TO_COPY_PASTE = {
            title: "V2CLOUD_HELP_PANEL.TITLE_PANEL_HOW_TO_COPY_PASTE",
            type: 'TEXT',
            // The content can be html
            content: "V2CLOUD_HELP_PANEL.TEXT_HOW_TO_COPY_PASTE"
        };
        
        var PANEL_HOW_TO_PRINT = {
            title: "V2CLOUD_HELP_PANEL.TITLE_PANEL_HOW_TO_PRINT",
            type: 'CAROUSEL',
            pages: [
                {image: 'images/help-dialog-images/blank.jpg'},
                {image: 'images/help-dialog-images/blank.jpg'}
            ]
        };


        $scope.helpPanels = [
            PANEL_HOW_TO_DOWNLOAD_FILES,
            PANEL_HOW_TO_UPLOAD_FILES,
            PANEL_HOW_TO_COPY_PASTE,
            PANEL_HOW_TO_PRINT
        ];
                
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }]);
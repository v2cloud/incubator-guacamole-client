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
 * A service for checking browser image support.
 */
angular.module('dialog').factory('v2cDialogService', ['$uibModal', function v2cDialogService($uibModal) {
    
    var service = {};
    
    /**
     * Show the help dialog.
     * @param {Function} closeCallback
     *     The callback to call when the user close the dialog.
     */
    service.showHelpDialog = function showHelpDialog(closeCallback) {
        return function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/dialog/templates/v2cHelpDialog.html',
                size: 'lg',
                controller: 'v2cHelpDialogController',
                windowClass: 'center-modal'
            });
            if (closeCallback) {
                modalInstance.result.then(closeCallback());
            }
        }
    };
    
    /**
     * Show the file transfer dialog.
     * @param {Function} closeCallback
     *     The callback to call when the user close the dialog.
     */
    service.showFileTransferDialog = function showFileTransferDialog(closeCallback) {
        return function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/dialog/templates/v2cFileTransferDialog.html',
                size: 'lg',
                controller: 'v2cFileTransferController',
                windowClass: 'center-modal'
            });
            if (closeCallback) {
                modalInstance.result.then(closeCallback());
            }
        }
    };
    
    return service;
}]);

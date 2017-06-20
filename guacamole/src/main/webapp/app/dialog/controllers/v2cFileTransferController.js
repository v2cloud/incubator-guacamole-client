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
 * The controller for the file transfer dialog.
 */
angular.module('dialog').controller('v2cFileTransferController',
    ['$scope', '$uibModalInstance', '$injector', '$routeParams',
        function v2cFileTransferController($scope, $uibModalInstance, $injector, $routeParams) {

            // Required types
            var ManagedFilesystem  = $injector.get('ManagedFilesystem');
            var ManagedClient      = $injector.get('ManagedClient');
            
            // Required services
            var guacClientManager = $injector.get('guacClientManager');

            /**
             * The client which should be attached to the client UI.
             *
             * @type ManagedClient
             */
            $scope.client = guacClientManager.getManagedClient($routeParams.id, $routeParams.params);


            /**
             * Changes the current directory of the given filesystem to the given
             * directory.
             *
             * @param {ManagedFilesystem} filesystem
             *     The filesystem whose current directory should be changed.
             *
             * @param {ManagedFilesystem.File} file
             *     The directory to change to.
             */
            var changeDirectory = function changeDirectory(filesystem, file) {
                ManagedFilesystem.changeDirectory(filesystem, file);
            };


            /**
             * Returns the full path to the given file as an ordered array of parent
             * directories.
             *
             * @param {ManagedFilesystem.File} file
             *     The file whose full path should be retrieved.
             *
             * @returns {ManagedFilesystem.File[]}
             *     An array of directories which make up the hierarchy containing the
             *     given file, in order of increasing depth.
             */
            var getPath = function getPath(file) {
                var path = [];
                // Add all files to path in ascending order of depth
                while (file && file.parent) {
                    path.unshift(file);
                    file = file.parent;
                }
                return path;
            };
            
            $scope.drives = [];
            for (var i = 0; i < $scope.client.filesystems.length; i++) {
                var fs = $scope.client.filesystems[i];
                var drive = {
                    title: fs.name,
                    type: 'FILE_SYSTEM',
                    client: $scope.client,
                    fs: fs,
                    callbacks: {
                        changeDirectory: function (file) {
                            changeDirectory(fs, file || fs.root)
                        },
                        getPath: function () {
                            return getPath(fs.currentDirectory)
                        }

                    }
                };
                $scope.drives.push(drive);
            }
    

            var PANEL_HOW_TO_DOWNLOAD_FILES = {
                title: "V2CLOUD_FILE_TRANSFER_PANEL.TITLE_PANEL_HOW_TO_DOWNLOAD_FILES",
                type: 'CAROUSEL',
                pages: [
                    {image: 'images/help-dialog-images/download_by_draganddropping.gif'},
                    {image: 'images/help-dialog-images/download_by_saving.gif'}
                ]
            };

            var PANEL_HOW_TO_UPLOAD_FILES = {
                title: "V2CLOUD_FILE_TRANSFER_PANEL.TITLE_PANEL_HOW_TO_UPLOAD_FILES",
                type: 'CAROUSEL',
                pages: [
                    {image: 'images/help-dialog-images/upload.gif'}
                ]
            };

            $scope.helpPanels = [
                PANEL_HOW_TO_DOWNLOAD_FILES,
                PANEL_HOW_TO_UPLOAD_FILES
            ];
            
            $scope.show_legacy_file_transfer = false;
            
            /**
             * Begins a file upload through the attached Guacamole client for
             * each file in the given FileList.
             *
             * @param {FileList} files
             *     The files to upload.
             */
            $scope.uploadFiles = function uploadFiles(files) {

                // Ignore file uploads if no attached client
                if (!$scope.client)
                    return;

                // Upload each file
                for (var i = 0; i < files.length; i++)
                    ManagedClient.uploadFile($scope.client, files[i], $scope.filesystemMenuContents);

            };

            /**
             * Function to close the dialog
             */
            $scope.close = function () {
                $uibModalInstance.close();
            };
            
            $scope.toggle_file_transfer = function () {
                $scope.show_legacy_file_transfer = !$scope.show_legacy_file_transfer;
            };
            

        }]);
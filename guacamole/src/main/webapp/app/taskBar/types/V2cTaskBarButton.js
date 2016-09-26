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
 * Provides the V2cTaskBarButton class definition.
 */
angular.module('taskBar').factory('V2cTaskBarButton', [function defineV2cTaskBarButton() {

    /**
     * Creates a new MenuAction, which pairs an arbitrary callback with
     * an action name. The name of this action will ultimately be presented to
     * the user when the user when this action's associated menu is open.
     *
     * @constructor
     * @param {String} name
     *     The name of this action.
     *
     * @param {MenuAction []} actions
     *     List of MenuAction that the button should display in its menu.
     * 
     * @param {String} [className='task-bar-button']
     *
     *     The CSS class to associate with this button, if any.
     */
    var V2cTaskBarButton = function V2cTaskBarButton(name, actions, className) {

        /**
         * Reference to this V2cTaskBarButton.
         *
         * @type V2cTaskBarButton
         */
        var button = this;

        /**
         * The CSS class associated with this button.
         * 
         * @type String
         */
        this.className = className || 'task-bar-button';

        /**
         * The name of this button.
         *
         * @type String
         */
        this.name = name;


        /**
         * The actions to display when this button is triggered.
         *
         * @type MenuAction []
         */
        this.actions = actions;

    };

    return V2cTaskBarButton;

}]);

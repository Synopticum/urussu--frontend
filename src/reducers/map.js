/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  SHOW_OBJECT_TOOLTIP,
  HIDE_OBJECT_TOOLTIP,
  SHOW_OBJECT_INFO,
  HIDE_OBJECT_INFO,
  SHOW_OBJECT_EDITOR,
  HIDE_OBJECT_EDITOR,
  SAVE_OBJECT_SUCCEED,
  SAVE_OBJECT_FAILED } from '../actions/map.js';

const map = (state = {
  object: {},
  position: {},
  isTooltipVisible: false,
  isInfoVisible: false,
  isEditorVisible: false,
  saveState: 'untouched'
}, action) => {
  switch (action.type) {
    case SHOW_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: true,
        object: action.payload.object,
        position: action.payload.position
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    case SHOW_OBJECT_INFO:
      return {
        ...state,
        isInfoVisible: true,
        object: action.payload.object
      };

    case HIDE_OBJECT_INFO:
      return {
        ...state,
        isInfoVisible: false
      };

    case SHOW_OBJECT_EDITOR:
      return {
        ...state,
        isEditorVisible: true,
        object: action.payload.object
      };

    case HIDE_OBJECT_EDITOR:
      return {
        ...state,
        isEditorVisible: false
      };

    case SAVE_OBJECT_SUCCEED:
      return {
        ...state,
        saveState: 'succeed'
      };

    case SAVE_OBJECT_FAILED:
      return {
        ...state,
        saveState: 'failed'
      };

    default:
      return state;
  }
};

export default map;

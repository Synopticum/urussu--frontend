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
  HIDE_OBJECT_EDITOR } from '../actions/map.js';

const map = (state = { objectTooltip: null, position: {} }, action) => {
  switch (action.type) {
    case SHOW_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: Boolean(action.object),
        object: action.object,
        position: action.position
      };

    case HIDE_OBJECT_TOOLTIP:
      return {
        ...state,
        isTooltipVisible: false
      };

    case SHOW_OBJECT_INFO:
      return {
        ...state,
        isInfoVisible: Boolean(action.object),
        object: action.object
      };

    case HIDE_OBJECT_INFO:
      return {
        ...state,
        isInfoVisible: false
      };

    case SHOW_OBJECT_EDITOR:
      return {
        ...state,
        isEditorVisible: Boolean(action.object),
        object: action.object
      };

    case HIDE_OBJECT_EDITOR:
      return {
        ...state,
        isEditorVisible: false
      };

    default:
      return state;
  }
};

export default map;

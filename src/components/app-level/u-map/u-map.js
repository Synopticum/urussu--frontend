/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { ENV } from '../../../constants';
import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import {
  showObjectTooltip,
  hideObjectTooltip,
  showObjectInfo,
  hideObjectInfo,
  showObjectEditor,
  hideObjectEditor } from '../../../actions/map.js';

import map from '../../../reducers/map.js';
store.addReducers({
  map
});

class UMap extends connect(store)(LitElement) {

  static get properties() {
    return {
      map: Object,
      minZoom: Number,
      maxZoom: Number,
      maxBounds: Array,
      mapWidth: Number,
      mapHeight: Number,
      objectFillColor: String,
      objectStrokeWidth: Number,

      _object: Object,
      _isTooltipVisible: Boolean,
      _isEditorVisible: Boolean,
      _isInfoVisible: Boolean,
      _objectHoverTimeOut: Number,

      __currentObject: Array,
    };
  }

  _render({
            _isTooltipVisible, _isInfoVisible, _isEditorVisible,
            _objectTooltipPositionX, _objectTooltipPositionY,
            _object
  }) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            width: 100vw;
            height: 100vh;
            z-index: 200;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .editor {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background-color: #ff0000;
        }
      </style>
      
      <u-object-tooltip x="${_objectTooltipPositionX}" y="${_objectTooltipPositionY}" hidden?="${!_isTooltipVisible}">
        ${_object ? _object._id : ''}
      </u-object-tooltip>
      
      <u-object-info hidden?="${!_isInfoVisible}">
        ${_object ? _object._id : ''}
      </u-object-info>
      
      <div class="editor" hidden?="${!_isEditorVisible}">${_object ? _object._id : ''}</div>
    `;
  }

  constructor() {
    super();

    this.map = null;
    this.minZoom = 4;
    this.maxZoom = 5;
    this.maxBounds = [[5, -180], [122, 100]];
    this.mapWidth = 6400;
    this.mapHeight = 4000;
    this.objectFillColor = '#ffc600';
    this.objectStrokeWidth = 2;
    this._objectHoverTimeOut = null;
    this.__currentObject = [];
  }

  _firstRendered() {
    super._firstRendered();
    this.init().catch(e => { throw new Error(e) });
  }

  _stateChanged(state) {
    this._object = state.map.object;
    this._isTooltipVisible = state.map.isTooltipVisible;
    this._isInfoVisible = state.map.isInfoVisible;
    this._isEditorVisible = state.map.isEditorVisible;
  }

  async init() {
    if (!localStorage.access_token) {
      alert('Auth error');
      window.location.href = '/login?unauthorized';

    } else {
      this._createMap();
      this._setDefaultSettings();
      this._setMaxBounds();
      this._initializeTiles();
      this._setListeners();
      await this._drawObjects();
    }
  }

  _createMap() {
    this.map = L.map('map', {});
  }

  _setDefaultSettings() {
    this.map.setView([70, 30], 5);
  }

  _setMaxBounds() {
    this.map.setMaxBounds(this.maxBounds);
  }

  _getBounds() {
    return new L.LatLngBounds(
      this.map.unproject([0, this.mapHeight], this.maxZoom),
      this.map.unproject([this.mapWidth, 0], this.maxZoom)
    );
  }

  _initializeTiles() {
    L.tileLayer(`${ENV.static}/static/images/tiles/{z}/{x}/{y}.jpg`, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds: this._getBounds(),
      noWrap: true
    }).addTo(this.map);
  }

  _setListeners() {
    this.map.on('load', UMap._triggerResize());
    this.map.on('click', this.__getCoordinates.bind(this));
    this.map.on('keypress', this.__drawHelper.bind(this));
  }

  async _drawObjects() {
    return Promise.all[this._drawPaths(), this._drawCircles()];
  }

  async _drawPaths() {
    let response = await fetch(`${ENV.api}/api/objects/coordinates/paths`, {
      headers: {
        'vk-access-token': localStorage.access_token
      }
    });

    if (response.ok) {
      const paths = await response.json();

      paths.forEach(item => {
        L.polygon(item.coordinates, {
          color: this.objectFillColor,
          weight: this.objectStrokeWidth
        })
          .on('mouseover', this._showObjectTooltip)
          .on('mouseout', this._hideObjectTooltip)
          .on('click', this._showObjectInfo)
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  async _drawCircles() {
    let response = await fetch(`${ENV.api}/api/objects/coordinates/circles`, {
      headers: {
        'vk-access-token': localStorage.access_token
      }
    });
    if (response.ok) {
      const circles = await response.json();

      circles.forEach(item => {
        L.circle(item.coordinates[0], {
          color: this.objectFillColor,
          weight: this.objectStrokeWidth,
          radius: item.coordinates[1]
        })
          .on('mouseover', this._showObjectTooltip)
          .on('mouseout', this._hideObjectTooltip)
          .addTo(this.map);
      });
    } else {
      window.location.href = '/login';
    }
  }

  _showObjectTooltip(e) {
    this._objectHoverTimeOut = setTimeout(() => {
      let coordinates = UMap._getObjectCoordinates(e.target);
      let position = UMap._calculateTooltipPosition(e.containerPoint.x, e.containerPoint.y);

      store.dispatch(showObjectTooltip(coordinates, position));
    }, 1000);
  }

  _hideObjectTooltip() {
    clearTimeout(this._objectHoverTimeOut);
    store.dispatch(hideObjectTooltip());
  }

  static _calculateTooltipPosition(mouseX, mouseY) {
    let html = document.querySelector('html');
    let x;
    let y;

    html.clientWidth/2 < mouseX ? x = mouseX - 310 : x = mouseX;
    html.clientHeight/2 < mouseY ? y = mouseY - 160 : y = mouseY;
    return { x, y }
  }

  _showObjectInfo(e) {
    let coordinates = UMap._getObjectCoordinates(e.target);
    e.originalEvent.altKey ? store.dispatch(showObjectEditor(coordinates)) : store.dispatch(showObjectInfo(coordinates));
  }

  _hideObjectInfo() {
    store.dispatch(hideObjectInfo());
  }

  static _getObjectCoordinates(target) {
    let type = target.getRadius ? 'circle' : 'path';

    switch (type) {
      case 'circle':
        return [[target.getLatLng().lat, target.getLatLng().lng], target.getRadius()];

      case 'path':
        return target.getLatLngs()[0].map(item => [item.lat, item.lng]);
    }
  }

  __getCoordinates(e) {
    this.__currentObject.push([e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2)]);
  }

  __drawHelper(e) {
    if (e.originalEvent.code === 'Enter') {
      let path = '[[';
      this.__currentObject.forEach(dot => {
        path += `${dot.toString()}],[`;
      });
      path += ']';
      path = path.substring(0, path.length - 3);
      path += '],';

      console.log(path);
      this.__currentObject = [];
    }
  }

  static _triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }
}

window.customElements.define('u-map', UMap);

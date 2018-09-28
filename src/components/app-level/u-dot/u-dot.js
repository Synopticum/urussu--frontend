import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../store';
import { hideDotInfo, putDot } from '../../../actions/dot';

import dot from '../../../reducers/dot';
store.addReducers({
  dot
});

class UDot extends connect(store)(LitElement) {

  constructor() {
    super();
    this._activeDot = {};
  }

  static get properties() {
    return {
      _user: {
        type: Object,
        attribute: false
      },
      _activeDot: {
        type: Object,
        attribute: false
      },
      _isUpdating: {
        type: Boolean,
        attribute: false
      }
    };
  }

  render() {
    return html`
      
      ${SharedStyles}
      <style>
        :host {
            width: 900px;
            height: 600px;
            background-color: #fee;
            border: 1px solid green;
            z-index: 200;
            pointer-events: all;
            transform: scale(1);
            transition: transform .3s;
            padding: 30px;
        }
        
        :host([hidden]) {
            display: block !important;
            transform: scale(0);
            width: 0;
            height: 0;
        }
        
        .close {
            cursor: pointer;
            position: absolute;
            right: -15px;
            top: -15px;
            width: 30px;
            height: 30px;
            background-color: #ff0000;
        }
        
        .submit {
            cursor: pointer;
            position: absolute;
            right: -15px;
            bottom: -15px;
            width: 30px;
            height: 30px;
            background-color: #00bb00;
        }
        
        #dot-title {
            font-size: 24px;
        }
        
        #dot-short-description {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        #dot-full-description {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 16px;
        }
        
        #dot-title[data-fetching],
        #dot-short-description[data-fetching],
        #dot-full-description[data-fetching] {
            color: #ccc;
        }
      </style>
      
      <div class="dot">
        <div class="close" @click="${UDot.close}"></div>
        
        <form>
            <div id="dot-title" 
                 ?data-fetching="${this._isUpdating}" 
                 ?contentEditable="${this._user.isAdmin}">${this._activeDot.title ? this._activeDot.title : 'Название точки'}</div>
                 
            <div id="dot-short-description" 
                 ?data-fetching="${this._isUpdating}" 
                 ?contentEditable="${this._user.isAdmin}">${this._activeDot.shortDescription ? this._activeDot.shortDescription : 'Краткое описание'}</div>
                 
            <div id="dot-full-description" 
                 ?data-fetching="${this._isUpdating}" 
                 ?contentEditable="${this._user.isAdmin}">${this._activeDot.fullDescription ? this._activeDot.fullDescription : 'Полное описание'}</div>
            <hr>
            
            <button class="submit" type="submit" @click="${this.submit.bind(this)}"></button>
        </form>
      </div> 
    `
  }

  _stateChanged(state) {
    this._user = state.user;
    this._activeDot = state.dot.activeDot;
    this._isUpdating = state.dot.isUpdating;
  }

  firstUpdated() {
    // create references to the inputs
    this.$form = this.shadowRoot.querySelector('form');
    this.$dotTitle = this.shadowRoot.querySelector('#dot-title');
    this.$dotShortDescription = this.shadowRoot.querySelector('#dot-short-description');
    this.$dotFullDescription = this.shadowRoot.querySelector('#dot-full-description');
  }

  static close() {
    store.dispatch(hideDotInfo());
  }

  submit(e) {
    e.preventDefault();

    if (this._activeDot.id && this.$form.checkValidity()) {
      let dotId = this._activeDot.id;
      let updatedDot = Object.assign(this._activeDot, {
        title: this.$dotTitle.textContent.trim(),
        shortDescription: this.$dotShortDescription.textContent.trim(),
        fullDescription: this.$dotFullDescription.textContent.trim()
      });

      store.dispatch(putDot(updatedDot, dotId));
    } else {
      alert('error!');
    }
  }
}

window.customElements.define('u-dot', UDot);
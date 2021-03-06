import {html, LitElement} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {installRouter} from 'pwa-helpers/router.js';
import {store} from '../../store.js';
import {enableAnonymousMode, fetchUserInfo, navigate} from './UApp.actions';
import props from './UApp.props';

import '../u-nav/UNav.js';
import '../u-page/UPage.js';
import '../u-map/UMap.js';
import '../u-404/U404.js';
import {authenticate} from "./authenticate";
import visitedBefore from '../../helpers/visitedBefore';

class UApp extends connect(store)(LitElement) {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  render() {
    return html`
      <div class="u-app">
        <u-nav></u-nav>
        <u-page ?default="${visitedBefore()}"></u-page>
        
        <u-map width="10000"
               height="6250"
               min-zoom="4" 
               max-zoom="6"
               max-bounds="[[39.5,-180],[100,39.5]]"
               object-fill-color="#ffc600"
               object-stroke-width="2"></u-map>
          
        <u-404 ?active="${this._page === '404'}"></u-404>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._setDefaults();
  }

  stateChanged(state) {
    this._page = state.app.page;
    this.pageTitle = state.app.pageTitle;

    if (window.opener && this._page === 'success') {
      window.opener.location.reload();
      window.close();
    }
  }

  firstUpdated() {
    this._init().catch(e => { throw new Error(e) });
  }

  async _init() {
    this._setStore();
    this._setReferences();
    this._setListeners();
  }

  async _setStore() {
    await this._authenticate();
    this._initRouter();
  }

  _setReferences() {

  }

  _setListeners() {

  }

  _setDefaults() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
  async _authenticate() {
    try {
      await authenticate();
      store.dispatch(fetchUserInfo());
    } catch(e) {
      store.dispatch(enableAnonymousMode());
    }
  }

  _initRouter() {
    installRouter(location => {
      let path = window.decodeURIComponent(location.pathname);
      store.dispatch(navigate({ path }));
    });
  }
}

window.customElements.define('u-app', UApp);

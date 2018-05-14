/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from '@polymer/lit-element';
import { PageViewElement } from '../page-view-element.js';
import { SharedStyles } from '../shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

class ULogin extends PageViewElement {
    _render(props) {
        return html`
            <a href="https://oauth.vk.com/authorize?client_id=4447151&display=page&redirect_uri=http://localhost:8081/letsrock&scope=friends&response_type=token&v=5.74">Login</a>
        `;
    }
}

window.customElements.define('u-login', ULogin);
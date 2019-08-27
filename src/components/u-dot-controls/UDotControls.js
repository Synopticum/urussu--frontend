import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../store';
import {connect} from 'pwa-helpers';
import {dotControls} from "./UDotControls.reducer";
import {isAdmin, isAnonymous} from "../u-app/UApp.helpers";
import {clearDotState, deleteDot, putDot} from "../u-dot/UDot.actions";
import {deletePhoto} from "../u-photo-upload/UPhotoUpload.actions";
import '../u-photo-upload/UPhotoUpload';
import '../u-text-button/UTextButton';
import {setCloudsVisibility} from "../u-map/UMap.actions";
import props from './UDotControls.props';
import styles from './UDotControls.styles';

store.addReducers({dotControls});

export class UDotControls extends connect(store)(LitElement) {
    /*
        List of required methods
        Needed for initialization, rendering, fetching and setting default values
    */
    static get properties() {
        return props;
    }

    static get styles() {
        return styles;
    }

    render() {
        return html`
          <div class="u-dot-controls">
            <div class="controls">
                <div class="controls__photo">
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) && this.hasImage() ?
                        html`<u-text-button class="delete-image"
                                            ?disabled="${this._isFetching || this._isUpdating}"
                                            @click="${this.deleteImage}">Удалить фото</u-text-button>` : ''}
                              
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-photo-upload type="dot"
                                             ?disabled="${this._isFetching || this._isUpdating}"
                                             id="${this.dotId}"></u-photo-upload>` : ''}
                </div>
                          
                <div class="controls__type">
                    <select class="select-label ${this._dot.label ? 'select-label--active' : ''}" @change="${this.changeDotLabel}"> 
                        <option value="0" ?selected="${!this._dot.label}" disabled hidden>Выберите метку</option>
                        ${Object.entries(this.decadeLabels).map(entry => html`<option value="${entry[0]}" ?selected="${this._dot.label === entry[0]}">${entry[1]}</option>`)}
                    </select>
                            
                    <select class="select-label ${this._dot.type ? 'select-type--active' : ''}" @change="${this.changeDotType}"> 
                        <option value="0" ?selected="${!this._dot.type}" disabled hidden>Выберите тип</option>
                        <option value="old-and-new" ?selected="${this._dot.type === 'old-and-new'}">Старое и новое</option>
                        <option value="old" ?selected="${this._dot.type === 'old'}">Только старое</option>
                        <option value="new" ?selected="${this._dot.type === 'new'}">Только новое</option>
                    </select>
                            
                   <select class="select-layer ${this._dot.layer ? 'select-layer--active' : ''}" @change="${this.changeDotLayer}"> 
                       <option value="0" ?selected="${!this._dot.layer}" disabled hidden>Выберите слой</option>
                       ${this.decadeLayers.map(decade => html`<option value="${decade}" ?selected="${this._dot.layer === decade}">${decade}</option>`)}
                   </select>
                </div>
                             
                <div class="controls__dot">
                    ${!isAnonymous(this._user) && (isAdmin(this._user) || this.isDotAuthor(this._user)) ?
                        html`<u-text-button class="remove"
                                            ?disabled="${this._isFetching || this._isUpdating}"
                                            @click="${this.remove}">Удалить точку</u-text-button>` : ''}
                </div>
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {
        this._user = state.app.user;
        this._dot = state.dotPage.dot;

        this._dotControls = state.dotControls;

        this._activeImage = state.dotPage.activeImage;
        this._activeDecade = state.dotPage.activeDecade;

        this._isFetching = state.dotPage.isFetching;
        this._isUpdating = state.dotPage.isUpdating;
    }

    firstUpdated() {
        this._init();
    }

    _init() {
        this._setStore();
        this._setReferences();
        this._setListeners();
    }

    _setStore() {
        // store.dispatch(fetch());
    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-smart-template');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
    }

    _setDefaults() {
        this.decadeLabels = {
            '40th': 'Сороковые',
            '50th': 'Пятидесятые',
            '60th': 'Шестидесятые',
            '70th': 'Семидесятые',
            '80th': 'Восьмидесятые',
            '90th': 'Девяностые',
            '00th': 'Нулевые',
            '10th': 'Десятые',
            'unknown': 'Неизвестно'
        };

        this.decadeLayers = [
            'Сороковые',
            'Пятидесятые',
            'Шестидесятые',
            'Семидесятые',
            'Восьмидесятые',
            'Девяностые',
            'Нулевые',
            'Десятые',
            'Неизвестно',
            'Sergey Novikov'
        ];
    }

    /*
        List of custom component's methods
        Any other methods
    */
    remove() {
        store.dispatch(deleteDot(this.dotId));
        this.close();
    }

    close() {
        store.dispatch(setCloudsVisibility('none'));
        store.dispatch(clearDotState());
        this.dispatchEvent(new CustomEvent('hide-dot', {composed: true}));
    }

    deleteImage() {
        store.dispatch(deletePhoto('dot', this.dotId, this._activeDecade));
    }

    changeDotLabel(e) {
        let label = e.target.value;

        let updatedDot = {
            ...this._dot,
            label
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    changeDotType(e) {
        let type = e.target.value;

        let updatedDot = {
            ...this._dot,
            type
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    changeDotLayer(e) {
        let layer = e.target.value;

        let updatedDot = {
            ...this._dot,
            layer
        };

        store.dispatch(putDot(updatedDot, this.dotId));
    }

    hasImage() {
        return Boolean(this._activeImage);
    }
}

window.customElements.define('u-dot-controls', UDotControls);
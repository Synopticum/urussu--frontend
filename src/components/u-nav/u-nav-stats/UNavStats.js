import {html, LitElement} from 'lit-element/lit-element';
import {store} from '../../../store';
import {connect} from 'pwa-helpers';
import {stats} from "./UNavStats.reducer";
import props from './UNavStats.props';
import styles from './UNavStats.styles';
import { CHART_TITLES } from './constants';
import './u-nav-chart/UNavChart';
import './u-nav-chart/u-nav-chart-streets/UChartStreets';
import './u-nav-chart/u-nav-chart-population/UNavChartPopulation';
import './u-nav-chart/u-nav-chart-summer/UNavChartSummer';
import './u-nav-chart/u-nav-chart-temperature/UNavChartTemperature';

store.addReducers({stats});

export class UNavStats extends connect(store)(LitElement) {
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
          <div class="u-nav-stats">
            <div class="wrapper">
                ${this.isNavVisible ? this.renderNav() : ''}
                
                <u-nav-chart ?hidden="${this.isNavVisible}"></u-nav-chart>
            </div>
          </div>
      `
    }

    constructor() {
        super();
        this._setDefaults();
    }

    stateChanged(state) {

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

    }

    _setReferences() {
        this.$container = this.shadowRoot.querySelector('.u-nav-stats');
        this.$chart = this.shadowRoot.querySelector('u-nav-chart');
    }

    _setListeners() {
        this.addEventListener('click', e => e.stopPropagation());
        this.addEventListener('u-nav-stats::clear', this.clear);
    }

    _setDefaults() {
        this.isNavVisible = true;
    }

    /*
        List of custom component's methods
        Any other methods
    */
    renderNav() {
        return html`
            <ul class="nav">
                <li class="nav__group">
                    <span class="nav__group-title">Люди</span>
                    <ul class="values">
                        <li class="values__button" @click="${() => this.showChart('population', { heading: CHART_TITLES.population })}">
                            <span class="values__button-title">${CHART_TITLES.population}</span>
                        </li>
                    </ul>
                </li>
                <li class="nav__group">
                    <span class="nav__group-title">Архитектура и дома</span>
                    <ul class="values">
                        <li class="values__button" @click="${() => this.showChart('streets', { heading: CHART_TITLES.streets })}">
                            <span class="values__button-title">${CHART_TITLES.streets}</span>
                        </li>
                    </ul>
                </li>
                <li class="nav__group">
                    <span class="nav__group-title">Погода</span>
                    <ul class="values">
                        <!-- <li class="nav__button" @click="${() => this.showChart('summer', { heading: CHART_TITLES.summer })}">
                            <span class="nav__button-title">${CHART_TITLES.summer}</span>
                        </li> -->
                        <li class="values__button" @click="${() => this.showChart('temperature', { type: 'hottest', heading: CHART_TITLES.temperature.hottest })}">
                            <span class="values__button-title">${CHART_TITLES.temperature.hottest}</span>
                        </li>
                        <li class="values__button" @click="${() => this.showChart('temperature', { type: 'lowest', heading: CHART_TITLES.temperature.lowest })}">
                            <span class="values__button-title">${CHART_TITLES.temperature.lowest}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        `;
    }

    showChart(name, options) {
        this.isNavVisible = false;
        this.$chart.innerHTML = '';

        this.renderChart(name, options);
    }

    renderChart(name, options) {
        const el = document.createElement(`u-nav-chart-${name}`);

        if (options) {
            for (const key of Object.keys(options)) {
                el.setAttribute(key, options[key]);
            }
        }

        this.$chart.appendChild(el);
        this.$chart.setAttribute('heading', options.heading);
    }

    clear() {
        this.isNavVisible = true;
        this.$chart.innerHTML = '';
    }
}

window.customElements.define('u-nav-stats', UNavStats);
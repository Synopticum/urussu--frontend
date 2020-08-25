import {css} from 'lit-element/lit-element';

export default css`
:host {
    cursor: default;
    position: relative;
    top: -80px;
    left: -5px;
    box-sizing: border-box;
}

:host([hidden]) {
    display: none;
}

:host * { 
    box-sizing: border-box; 
}

.u-nav-stats {
    width: 450px;
    padding: 16px 15px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 30px);
    background: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,0));
}

.wrapper {
    position: relative;
    background: #fff;
    border-radius: 10px;
    padding: 15px 25px;
    min-height: 200px;
}

.wrapper::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 70px;
    width: 0; 
    height: 0; 
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent; 
    border-right: 10px solid #fff; 
}

.nav {
    list-style: disc inside;
    padding: 0;
    margin: 0;
}

.nav__button {
    cursor: pointer;
    padding: 1px 5px;
}

.nav__button-title {
    border-bottom: 1px solid #ccc;
    font-size: 18px;
}

.nav__button-title:hover {

}
`;
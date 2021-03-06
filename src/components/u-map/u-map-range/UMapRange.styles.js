import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: block;
    position: fixed; 
    bottom: 15px; 
    left: calc(50% - 175px); 
    z-index: 25;
    width: 400px; 
    background: #111;
    padding: 15px 10px 0 10px;
}

.u-map-range {
  width: 400px;
  position: relative;
  height: 7px;
}

.wrapper {
  position: absolute;
  left: 13px;
  right: 15px;
  height: 7px;
  background-image:
      linear-gradient(90deg,
                       rgb(100, 100, 100),
                       rgb(142, 142, 69)  12.5%, 
                       rgb(255, 174, 30)  25%,
                       rgb(0, 105, 230)   37.5%,
                       rgb(150, 88, 255)  50%,
                       rgb(255, 108, 0)   62.5%,
                       rgb(185, 32, 93)   75%,
                       rgb(129, 196, 69)  87.5%,
                       rgb(129, 196, 69)  100%);
}

.inverse {
  position: absolute;
  height: 5px;
  border-radius: 10px;
  margin: 0 7px;
  width: 70%;
}

.inverse--left {
  left: 0;
}

.inverse--right {
  right: 0;
}

.range {
  position: absolute;
  height: 5px;
  border-radius: 14px;
}

.thumb {
  position: absolute;
  top: -7px;
  z-index: 2;
  height: 20px;
  width: 20px;
  text-align: left;
  margin-left: -11px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  background-color: #FFF;
  outline: none;
  opacity: 0;
}

input[type=range] {
  position: absolute;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 3;
  height: 60px;
  top: -50px;
  width: 100%;
  opacity: 0;
  cursor: grab;
}

input[type=range]:active {
  cursor: grabbing;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: transparent;
  border: transparent;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  pointer-events: all;
  width: 28px;
  height: 28px;
  border-radius: 0px;
  border: 0 none;
  background: red;
  -webkit-appearance: none;
}

.sign {
  cursor: default;
  user-select: none;
  position: absolute;
  margin-left: -23px;
  top: -46px;
  z-index: 3;
  background-color: #111;
  color: #fff;
  padding: 5px 8px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px 5px 0 0;
}

.sign::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 10px;
    left: 50%;
    margin-left: -1px;
    bottom: -5px;
    background: #fff;
}

.sign::after {
    --arrow-size: 7px;
    content:'';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: calc(50% - var(--arrow-size));
    top: calc(100% + 5px);
    border-right: var(--arrow-size) solid transparent;
    border-left: var(--arrow-size) solid transparent;
    border-top: var(--arrow-size) solid #fff;
}
`;
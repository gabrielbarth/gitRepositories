import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  /**
  * box-sizing allows to include the padding added to a element inside the element
  * example: initial element= width:280px -> added 10px of padding => this elements
  * now contains width: 260px (with 10px padding-left and 10px padding-right).
  * Avoid layout breaks.
  */
  html, body, #root {
    min-height: 100%;
  }

  body {
    background: #7159c1;
    -webkit-font-smoothing: antialiased !important; /* for beautiful fonts */
  }

  body, input, button {
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }
`;

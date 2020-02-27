import styled from 'styled-components';

// .login a p {display:none;}
// .login a:hover p {display:block;}

const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  svg {
    margin-right: 10px;
  }

  a {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #333;
    font-size: 14px;
    text-decoration: none;
  }

  a p {
    display: none;
    padding-right: 10px;
    font-weight: 600;
  }

  a:hover p {
    display: block;
  }
`;

export default Container;

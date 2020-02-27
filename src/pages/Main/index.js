import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    placeholder: 'Add a repository',
    inputError: false,
  };

  // Loading localStorage data
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Saving data at localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  /** excludes all listed repositories */
  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;

    try {
      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      /** verifying if newRepo already exists in repositories */
      const repoCheck = repositories.find(repo => repo.name === newRepo);

      if (repoCheck) {
        throw new Error('You already have this repository listed bellow.');
      }

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        placeholder: 'Add a repository',
        inputError: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({
          inputError: true,
          loading: false,
          newRepo: '',
          placeholder: 'Repository not found',
        });

        console.log(error.message);
      }

      if (error.message === 'You already have this repository listed bellow.') {
        this.setState({
          inputError: true,
          loading: false,
          newRepo: '',
          placeholder: 'You already have this repository listed bellow.',
        });
        console.log(error.message);
      }
    }
  };

  handleExclude = () => {
    localStorage.setItem('repositories', '');

    this.setState({ repositories: [] });
  };

  render() {
    const {
      newRepo,
      loading,
      repositories,
      inputError,
      placeholder,
    } = this.state;
    return (
      <Container>
        <div>
          <h1>
            <FaGithubAlt size={24} />
            Repositories
          </h1>

          <a onClick={this.handleExclude}>
            <p>Excludes all repositories bellow</p>
            <FaTrashAlt size={24} />
          </a>
        </div>

        <Form inputError={inputError} onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder={placeholder}
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

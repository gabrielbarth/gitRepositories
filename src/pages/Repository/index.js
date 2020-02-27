import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, StatusSelect, Pagination } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    status: 'open',
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // executing two api requests together
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  async componentDidUpdate(_, prevState) {
    const { status, page } = this.state;
    if (prevState.status !== status || prevState.page !== page) {
      const { match } = this.props;
      const repoName = decodeURIComponent(match.params.repository);

      const [repository, issues] = await Promise.all([
        api.get(`repos/${repoName}`),
        api.get(`repos/${repoName}/issues`, {
          params: {
            state: status,
            per_page: 5,
            page,
          },
        }),
      ]);

      this.setState({
        repository: repository.data,
        issues: issues.data,
        loading: false,
      });
    }
  }

  handleStatusSelect = e => {
    this.setState({ status: e.target.value });
  };

  handleChangePage = method => {
    const { page } = this.state;
    if (method === 'next') {
      this.setState({ page: page + 1 });
      /** how can I solve this? */
      // if (page > ) {
      //   this.setState({ page: 1 });
      // }
    }
    if (method === 'back') {
      this.setState({ page: page - 1 });
      if (page <= 1) {
        this.setState({ page: 1 });
      }
    }
  };

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return (
        <Loading loading={loading}>
          <FaSpinner size={36} color="#fff" />
          Loading
        </Loading>
      );
    }

    return (
      <Container>
        <Owner>
          <Link to="/"> Back to repositories </Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1> {repository.name} </h1>
          <p> {repository.description} </p>
        </Owner>

        <StatusSelect onChange={this.handleStatusSelect}>
          <option value="open">Open</option>
          <option value="all">All</option>
          <option value="closed">Closed</option>
        </StatusSelect>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination page={page}>
          {page === 1 ? (
            <>
              <button
                style={{ color: 'black' }}
                type="button"
                onClick={() => this.handleChangePage('back')}
              >
                Back
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => this.handleChangePage('back')}
              >
                Back
              </button>
            </>
          )}
          <span>Page {page}</span>
          <button type="button" onClick={() => this.handleChangePage('next')}>
            Next
          </button>
        </Pagination>
      </Container>
    );
  }
}

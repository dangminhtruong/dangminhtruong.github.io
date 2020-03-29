import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectRepositories, fetchData, loadMore } from '../../state/modules/Home'
import './home.scss'

import { Input, Divider, Button, Badge } from 'antd';
import { EyeOutlined, DownOutlined } from '@ant-design/icons';

const { Search } = Input;

class Home extends Component {

    search(username){
        const {fetchData} = this.props
        fetchData({username, page: 1})
    }

    loadMore = () => {
        const {loadMore} = this.props
        const {currentPage, username} = this.props.data
        loadMore({username, page: currentPage + 1})
    }

    render() {
        const {repositories, total, lastPage, currentPage} = this.props.data
        return(
            <div className="home">
                <Search
                    placeholder="Input username.."
                    enterButton="Search"
                    size="large"
                    onSearch={value => this.search(value)}
                />
                <div className="repositories">
                    <div className="information">
                    <Badge count={total}>
                        <Button type="dashed">Public repo</Button>
                    </Badge>
                    <Badge count={repositories.length}>
                        <Button type="dashed">Loaded</Button>
                    </Badge>
                    </div>
                    {
                        repositories.map(repository => (
                            <div className="repo" key={`repo ${repository.id}`}>
                                <Divider>
                                    <div className="repo-info">
                                        <p className="repo-name">{repository.name}</p>
                                        <Button type="dashed" shape="round" icon={<EyeOutlined />}>
                                            <span className="repo-stargazer">{repository.stargazers_count}</span>
                                        </Button>
                                    </div>
                                </Divider>
                                <p>
                                    {(repository.description) ? repository.description : 'This repository have no description'}
                                </p>
                            </div>
                        ))
                    }
                    {
                        (currentPage < lastPage) ?
                            <Button type="primary" onClick={this.loadMore}>
                                Load more <DownOutlined />
                            </Button>
                        : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    data: selectRepositories(state).toJS()
});

const mapDispatchToProps = {
    fetchData,
    loadMore
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
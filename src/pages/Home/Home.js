import React, { Component } from 'react'
import { connect } from 'react-redux'
import Repository from '../../components/repository'
import { selectData, fetchData, loadMore, loadStargazers } from '../../state/modules/Home'
import { Input, Button, Badge, Spin } from 'antd';
import './home.scss'

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

    loadStargazers = (repoId, url) => {
        const {loadStargazers} = this.props
        loadStargazers({repoId, url})
    }

    render() {
        const {repositories, total, lastPage, currentPage, loading} = this.props.data
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
                            <Repository key={`repo ${repository.id}`} 
                                repository={repository}
                                loadStargazers={this.loadStargazers}
                            />
                        ))
                    }
                    {
                        (currentPage < lastPage) ?
                            <Button type="primary" onClick={this.loadMore} loading={loading}>
                                Load more
                            </Button>
                        : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    data: selectData(state).toJS()
});

const mapDispatchToProps = {
    fetchData,
    loadMore,
    loadStargazers
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
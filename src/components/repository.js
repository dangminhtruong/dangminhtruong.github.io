import React, { useState } from 'react'
import { Divider, Button, Card, List, Avatar } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const Repository = ({ repository, loadStargazers }) => { 
    const [openStg, setOpenStg] = useState(false)

    return (
        <div className="repo">
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
            <div>
                {
                    (openStg) ?
                    <Button onClick={() => setOpenStg(false)} type='link' >
                        Close
                    </Button>:
                    <Button onClick={() => { loadStargazers(repository.id, repository.stargazers_url); setOpenStg(true)}} type='link' >
                        Show stargazers
                    </Button>
                }
            </div>
            {
                (openStg && repository.stargazers) ?
                    <div className="list-stargazers">
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={repository.stargazers}
                            renderItem={stargazer => (
                                <List.Item>
                                    <Card title={stargazer.login}>
                                        <Avatar src={stargazer.avatar_url} />
                                        <Button type="link" href={stargazer.html_url}>Go to profile</Button>
                                    </Card>
                                </List.Item>
                            )}
                        />

                    </div> : null
            }

        </div>
    )
};

export default Repository;
import React from 'react';

export default class AppLoader extends React.Component {
    render() {
        return (
            <QueryRenderer
                environment={RelayService.environment}
                query={graphql`
                  query AppLoaderQuery {
                    viewer {
                        id
                    }
                  }
                `}
                render={({ error, props }) => {
                    if (error) {
                        return <div>{error}</div>;
                    } else if (props) {
                        return (
                            <div> Loaded</div>
                        );
                    }
                    return <div>Loading....</div>;
                }}
            />
        );
    }
};

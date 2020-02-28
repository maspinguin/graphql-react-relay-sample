import React from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import RelayService from '../service/RelayService';
import App from "./App";

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
                            <App viewer={props.viewer}/>
                        );
                    }
                    return <div>Loading....</div>;
                }}
            />
        );
    }
};

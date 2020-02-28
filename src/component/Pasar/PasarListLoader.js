import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import RelayService from '../../service/RelayService';
import PasarList from "./PasarList";

const query = graphql`
    query PasarListLoaderQuery {
        viewer {
            ...PasarList_viewer
        }
    }
`;

class PasarListLoader extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        const filters = [
            // {
            //     field: "status",
            //     operator: "like",
            //     value: "completed"
            // }
        ];

        return (
            <QueryRenderer
                environment={RelayService.environment}
                query={query}
                variable={filters}
                cacheConfig={{force:true}}
                render={({ error, props }) => {
                    if (error) {
                        return <div>error</div>
                    } else if (props) {
                        return (
                            <PasarList viewer={props.viewer} />
                        );
                    }
                    return (
                        <div>Loading...</div>
                    );
                }}
            />
        )
    }
}

export default PasarListLoader;

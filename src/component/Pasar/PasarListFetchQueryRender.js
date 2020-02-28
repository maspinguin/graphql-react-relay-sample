import React from 'react';
import {graphql, QueryRenderer} from "react-relay";
import RelayService from "../../service/RelayService";
import PasarList from "./PasarList";
import _ from "lodash";

const query = graphql`
    query PasarListFetchQueryRenderQuery {
        viewer {
            pasars(first: 3){
                edges {
                    node {
                        id
                        plainId
                        namaPasar
                    }
                }
            }
        }
    }
`;


export default class PasarListFetchQueryRender extends React.Component{
    render() {
        return (
            <QueryRenderer
                environment={RelayService.environment}
                query={query}
                cacheConfig={{force:true}}
                render={({ error, props }) => {
                    if (error) {
                        return <div>error</div>
                    } else if (props) {
                        let rows;
                        let endCount = 0;

                        if(props.viewer.pasars){
                            endCount = _.size(props.viewer.pasars.edges);
                            if(endCount > 0 ) {
                                rows = props.viewer.pasars.edges.map((edge,index) => {
                                    let pasar = edge.node;
                                    return (
                                        <tr key={pasar.id} id={pasar.id}>
                                            <td>
                                                {pasar.plainId}
                                            </td>
                                            <td>
                                                {pasar.namaPasar}
                                            </td>
                                        </tr>
                                    );
                                });
                            } else {
                                rows = <tr><td colSpan={2}> No data found.</td></tr>;
                            }
                        }

                        return (
                            <table>
                                <tbody>
                                {rows}
                                </tbody>
                            </table>
                        );
                    }
                    return (
                        <div>Loading...</div>
                    );
                }}
            />
        );
    }
}

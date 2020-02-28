import React from 'react';
import { withRouter } from 'react-router';
import { createPaginationContainer, graphql } from 'react-relay';
import _ from 'lodash';

class PasarList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            tableLoading: false, // for table laoding
            rowTableLoading: false, // for loadMore row loading
            first: 10, // pageSize or perPage forward
            selectedFilter: 'all'
        }
    }

    onTableAction(tableConfig) {
        this.setState({ searchText: tableConfig.keyword, first: tableConfig.perPage});
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.searchText !== prevState.searchText)||
            (this.state.first !== prevState.first)
        ) {
            this.setState({ tableLoading: true });
            const filters = [
                // {
                //     field: "status",
                //     operator: "like",
                //     value: value
                // }
            ];

            if (!this.props.relay.isLoading()) {
                this.props.relay.refetchConnection(
                    parseInt(this.state.first),
                    () => {
                        this.setState({tableLoading : false});
                    },
                    {
                        first: parseInt(this.state.first),
                        search: this.state.searchText,
                        tableLoading: false,
                        filters: filters
                    }
                );
            }
        }
    }

    componentWillReceiveProps(props) {
        if(props.selectedStatus && props.selectedStatus.length !== 0) {
            this.updateSelectedStatus(props.selectedStatus);
        }
        else {
            this.updateSelectedStatus('');
        }
    }


    updateSelectedStatus(value) {
        this.setState({
            selectedFilter: value
        });
    }


    loadMoreClick() {
        if (!this.props.relay.hasMore()) {
            console.log('Nothing more to load');
            return;
        } else if (this.props.relay.isLoading()) {
            console.log('Request is already pending');
            return;
        }

        this.setState({rowTableLoading: true});

        this.props.relay.loadMore(
            parseInt(this.state.first, 0) + 1,  // Fetch the next n feed items
            () => {
                this.setState({ rowTableLoading :false, tableLoading: false});
            }
        );
    }

    gotoDetail(plainId) {
        this.props.history.push('/settlement/view/'+plainId);
    }

    componentDidMount() {
        // window.addEventListener("scroll", this.handleOnScroll);
    }

    componentWillUnmount() {
        // window.removeEventListener("scroll", this.handleOnScroll);
    }

    // handleOnScroll = () => {
    //     // http://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
    //     const scrollTop =
    //         (document.documentElement && document.documentElement.scrollTop) ||
    //         document.body.scrollTop;
    //     const scrollHeight =
    //         (document.documentElement && document.documentElement.scrollHeight) ||
    //         document.body.scrollHeight;
    //     const clientHeight =
    //         document.documentElement.clientHeight || window.innerHeight;
    //     const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    //     if (scrolledToBottom) {
    //         this.loadMoreClick();
    //     }
    // };

    render() {
        let rows;
        let endCount = 0;

        if(this.props.viewer.pasars){
            endCount = _.size(this.props.viewer.pasars.edges);
            if(endCount > 0 ) {
                rows = this.props.viewer.pasars.edges.map((edge,index) => {
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
                rows = <tr><td colSpan={10}> No data found.</td></tr>;
            }
        }

        return(
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>
                            Id
                        </th>
                        <th>
                            Nama Pasar
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}

                    {this.props.relay.hasMore() &&
                    <tr>
                        <td colSpan={2}>
                            <button
                                onClick={() => this.loadMoreClick()}
                            >Load More</button>
                        </td>
                    </tr>
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default createPaginationContainer(
    withRouter(PasarList),
    {
        viewer: graphql`
            fragment PasarList_viewer on Viewer
            @argumentDefinitions(
                count: { type: "Int" , defaultValue: 10}
                cursor: { type: "String" }
                search: { type: "String" }
                filters: { type: "[JSONObject]", defaultValue: []}
            ) {
                pasars(first: $count, after: $cursor, search: $search, filters: $filters)  @connection(key: "PasarList_pasars", filters: []) {
                    pageInfo{
                        hasNextPage,
                        hasPreviousPage,
                        startCursor,
                        endCursor
                    }
                    edges{
                        node{
                            id,
                            plainId,
                            namaPasar
                        }
                    }
                }
            }
        `
    },
    {
        direction: 'forward',
        getConnectionFromProps(props) {
            return props.viewer && props.viewer.pasars;
        },
        // This is also the default implementation of `getFragmentVariables` if it isn't provided.
        getFragmentVariables(prevVars, totalCount) {
            return {
                ...prevVars,
                count: totalCount,
            };
        },
        getVariables(props, {count, cursor, filters}, fragmentVariables) {
            return {
                count,
                cursor,
                filters
                //orderBy: fragmentVariables.orderBy,
                // userID isn't specified as an @argument for the fragment, but it should be a variable available for the fragment under the query root.
                //userID: fragmentVariables.userID,
            };
        },
        query: graphql`
            query PasarListPaginationQuery(
            $count: Int!
            $cursor: String
            $search: String
            $filters: [JSONObject]

            ) {
                viewer {
                    ...PasarList_viewer @arguments(count: $count, cursor: $cursor, search: $search, filters: $filters)
                }
            }
        `
    }
);

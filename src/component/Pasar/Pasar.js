import React from 'react';
import PasarListLoader from "./PasarListLoader";
import PasarListFetchQueryRender from "./PasarListFetchQueryRender";

export default class Pasar extends React.Component{
    render() {
        return (
            <div>
                <h1>Pasar List</h1>
                <h3> without fragment (use query render only) </h3>
                <PasarListFetchQueryRender/>


                <h3>with load more (use Fragment createPaginationContainer) :</h3>
                <PasarListLoader/>
            </div>
        );
    }
}

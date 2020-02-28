import React from 'react';
import PasarListLoader from "./PasarListLoader";

export default class Pasar extends React.Component{
    render() {
        return (
            <div>
                Pasar List
                <PasarListLoader/>
            </div>
        );
    }
}

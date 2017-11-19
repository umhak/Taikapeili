import React, { Component, PropTypes } from 'react';
import { each } from 'lodash';
import styles from './styles/layout.css';
import Widget from './widget.jsx';

class Layout extends Component {
    render() {
        const containers = {};

        each(this.props.containers, (widgets, type) => {
            const containerWidgets = [];

            each(widgets, (widget, index) => {
                containerWidgets.push(<Widget key={index} data={widget} />);
            });


            containers[type] = containerWidgets;
        });

        return (
            <div className={styles.layout}>
                <div className={styles.top}>
                    <div className={styles.left}>{containers.left}</div>
                    <div className={styles.right}>{containers.right}</div>
                </div>
                <div className={styles.bottom}>{containers.bottom}</div>
            </div>);
    }
}

Layout.propTypes = {
    containers: PropTypes.object.isRequired
};

export default Layout;

// import React from 'react';
import React, { useEffect } from 'react';
import { Page } from 'react-onsenui';


const CustomerMasterError = ({ errors = [] }) => {

    useEffect(() => {
        console.log("Errors prop:", errors);
    }, [errors]);

    return (
        <Page>
            <h1>Error!</h1>
            <p>The following rows in the uploaded file have blank values in critical columns:</p>
            <div>Errors: {JSON.stringify(errors)}</div>
            <ul>
                {Array.isArray(errors) && errors.map((rowNumber, index) => (
                    <li key={index}>
                        Row {rowNumber}
                    </li>
                ))}
            </ul>
        </Page>
    );
};

export default CustomerMasterError;

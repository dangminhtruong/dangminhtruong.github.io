import React, { lazy, Suspense } from 'react';

import './loadable-component.scss';

export const Loading = (
    <div className='animation-container'>
        <svg viewBox='0 205 600 600'>
            <symbol id='text'>
                <text textAnchor='middle' x='50%' y='50%'>Kuzen.io</text>
            </symbol>
            <use xlinkHref='#text' className='text' />
            <use xlinkHref='#text' className='text' />
            <use xlinkHref='#text' className='text' />
            <use xlinkHref='#text' className='text' />
        </svg>
    </div>
);

const LoadableComponent = (func) => {
    const Component = lazy(func);

    return props => (
        <Suspense fallback={Loading}>
            <Component {...props} />
        </Suspense>
    );
};

export default LoadableComponent;
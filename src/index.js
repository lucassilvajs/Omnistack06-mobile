import React from 'react';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(["Unrecognized WebSocket", "Warning"])

import Routes from './routes';



// import { Container } from './styles';

const App = () => <Routes />;

export default App;

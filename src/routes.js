import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Box from './pages/Box/Index';
import Main from './pages/Main/Index';

const Routes = createAppContainer(
    createSwitchNavigator({
        Main,
        Box
    })
);

export default Routes;
import { Provider } from "react-redux"
import App from "./App"

import store from './store'

function StoreProvider (props) {

    return (
        <Provider store={store} >
            <App />
        </Provider>
    )

}

export default StoreProvider

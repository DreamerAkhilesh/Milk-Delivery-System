import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* Provider wraps the entire app and gives all components access to the Redux store. */}
      {/* It ensures state management works across the app. */}
      <App />
    </Provider>
  </StrictMode>,
)

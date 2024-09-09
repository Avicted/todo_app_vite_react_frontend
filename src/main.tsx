import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'

// @Note(Victor): This enable?
//createRoot(document.getElementById('root')!).render(
//  <StrictMode>
//    <Provider store={store}>
//      {/* PersistGate delays rendering until the state is rehydrated */}
//      <PersistGate loading={null} persistor={persistor}>
//        <App />
//      </PersistGate>
//    </Provider>
//  </StrictMode>,
//)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* PersistGate delays rendering until the state is rehydrated */}
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

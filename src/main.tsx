import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import NonMobileWarning from "./NonMobileWarning.tsx";
import React from 'react';
import { allowDesktop } from './constants.tsx';
import WebApp from '@twa-dev/sdk'

// Function to check if the user is on a mobile device
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|ipad|iphone|ipod/.test(userAgent.toLowerCase());
}
WebApp.disableVerticalSwipes;
WebApp.enableClosingConfirmation;
// Conditional rendering based on device type
const RootComponent = (isMobileDevice() || allowDesktop )? <App /> : <NonMobileWarning />;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {RootComponent}
  </React.StrictMode>
);

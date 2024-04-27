navigator.serviceWorker.register('/serviceworker.js')
    .then((registration ) => {
        console.log('Service worker registered: ', registration.scope);
    }, (registrationError) => {
        console.log('Service worker registration failed: ', registrationError);
});
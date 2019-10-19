
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const saveSubscription = subscription => {
    const SERVER_URL = 'http://localhost:8000/save-subscription'
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("POST", SERVER_URL);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(subscription);


}


function displayNotification(reg) {
    if (Notification.permission == 'granted') {

        var options = {
            body: 'Here is a notification body!',
            icon: 'images/avatar.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore', title: 'Explore this new world',
                    icon: 'images/check.svg'
                },
                {
                    action: 'close', title: 'Close notification',
                    icon: 'images/pwaLabs.svg'
                },
            ]
        }

        reg.showNotification('Hello world!', options);
    }
}

const options = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('BPj6sfmTangFmIyZoXksRb1dAzUvM5eQUhd8EwBRS2wnsbxhvOrzOG7 - sE1piCdQANFuZHmQiwf - qmaTyzmhZdk')

}


navigator.serviceWorker.register('sw.js').then((reg) => {

    console.log('sw is registered', reg);
    Notification.requestPermission((status) => {
        if (status === 'granted') {
            reg.pushManager.subscribe(options).then((subscription) => {
                console.log(JSON.stringify(subscription))
                saveSubscription(JSON.stringify(subscription));
            });
        }
    })

});




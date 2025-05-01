self.addEventListener('push', function(event) {
    const data = event.data.json();
  
    const options = {
      body: data.body,
      icon: '/logo192.png', // opcional
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
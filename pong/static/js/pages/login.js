function handleLogin(formId) {
  const form = document.getElementById(formId);

  if (!form) {
      console.error(`Form with ID "${formId}" not found.`);
      return;
  }

  const formData = new FormData(form);
//   console.log("çalışıyor");
  fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
          'X-Requested-With': 'XMLHttpRequest', // AJAX isteği olduğunu belirtmek için
          'X-CSRFToken': formData.get('csrfmiddlewaretoken') // CSRF koruması için
      }
  })
  .then(response => response.json())
  .then(data => {
    // console.log("data geldi");
      if (data.success) {
          pageHandler('/home');
      } else {

          pageHandler('/login');
          
      }
  })
  .catch(error => {
      console.error('Login error:', error);
  });
}

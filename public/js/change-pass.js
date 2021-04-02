document.addEventListener('DOMContentLoaded', async () => {
  const submitBtn = document.getElementById('submitChange');

  submitBtn.addEventListener('click', async (e) => {
    const prevPassInput = document.getElementById('prevPass');
    const newPassInput = document.getElementById('newPass');
    const userIdInput = document.getElementById('userId');

    if (!prevPassInput.value || !newPassInput.value || !userIdInput.value) {
      return alert('Por favor, rellena el formulario completo.');
    }

    const reqBody = {
      userId: userIdInput.value,
      prevPass: prevPassInput.value,
      newPass: newPassInput.value,
    };

    let res;

    try {
      res = await (
        await fetch('/api/admin/pass-update', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(reqBody),
        })
      ).json();
    } catch (err) {
      console.log(err);
      return alert(
        'Hubo un error al conectarse con el servidor.\nRevise su conexion a internet.'
      );
    }

    if (!res || res.status !== 'OK') {
      console.log(res.err);
      return alert(res.message);
    }

    alert(res.message);
    return location.reload();
  });
});

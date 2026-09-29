(() => {
  const dialog = document.querySelector('#intake');
  const shell = dialog?.querySelector('.intake-shell');
  const form = document.querySelector('#intake-form');
  const error = document.querySelector('[data-form-error]');
  const needs = document.querySelector('[data-choice-group]');
  const styles = document.querySelector('[data-style-group]');
  const needsError = document.querySelector('[data-needs-error]');
  const styleError = document.querySelector('[data-style-error]');
  const success = document.querySelector('[data-success]');

  if (!dialog || !form) return;

  const clearFieldError = (field) => {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
  };

  const clearGroupError = (group, message) => {
    group.classList.remove('is-invalid');
    group.removeAttribute('aria-invalid');
    message.hidden = true;
  };

  const open = (event) => {
    event.preventDefault();
    success.hidden = true;
    form.hidden = false;
    error.hidden = true;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('intake-open');
    shell.scrollTop = 0;
    window.setTimeout(() => form.elements.contactName?.focus({ preventScroll: true }), 50);
  };

  const close = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('intake-open');
  };

  document.querySelectorAll('[data-intake-open]').forEach((trigger) => trigger.addEventListener('click', open));
  document.querySelectorAll('[data-intake-close]').forEach((trigger) => trigger.addEventListener('click', close));
  dialog.addEventListener('cancel', () => document.body.classList.remove('intake-open'));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
  });
  needs.addEventListener('change', () => clearGroupError(needs, needsError));
  styles.addEventListener('change', () => clearGroupError(styles, styleError));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    error.hidden = true;

    const invalidFields = [...form.querySelectorAll('[required]')].filter((field) => !field.checkValidity());
    invalidFields.forEach((field) => {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
    });

    const needsValid = Boolean(needs.querySelector('input:checked'));
    const styleValid = Boolean(styles.querySelector('input:checked'));
    if (!needsValid) {
      needs.classList.add('is-invalid');
      needs.setAttribute('aria-invalid', 'true');
      needsError.hidden = false;
    }
    if (!styleValid) {
      styles.classList.add('is-invalid');
      styles.setAttribute('aria-invalid', 'true');
      styleError.hidden = false;
    }

    if (invalidFields.length || !needsValid || !styleValid) {
      error.textContent = 'Please complete the highlighted fields.';
      error.hidden = false;
      const firstInvalid = invalidFields[0] || (!needsValid ? needs : styles);
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.querySelector?.('input')?.focus({ preventScroll: true });
      if (firstInvalid.matches?.('input, textarea')) firstInvalid.focus({ preventScroll: true });
      return;
    }

    form.hidden = true;
    success.hidden = false;
    shell.scrollTop = 0;
    success.querySelector('button').focus({ preventScroll: true });
  });
})();

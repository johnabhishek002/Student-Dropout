/**
 * EduGuard AI - Application Bootstrapper
 * 
 * Sets up event listeners, modals, form validations, and starts the UI engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Store
  if (window.Store) {
    Store.init();
  }

  // 2. Initialize UI
  if (window.UI) {
    UI.init();
  }

  // 3. Attach Global Form Submit Handlers
  const stuForm = document.getElementById('studentForm');
  if (stuForm) {
    stuForm.addEventListener('submit', (e) => UI.handleStudentFormSubmit(e));
  }

  const intvForm = document.getElementById('interventionForm');
  if (intvForm) {
    intvForm.addEventListener('submit', (e) => UI.handleInterventionSubmit(e));
  }

  // 4. Modal Risk Preview live listener on input changes
  const metricInputs = ['stuFormAtt', 'stuFormMarks', 'stuFormAssign', 'stuFormLms'];
  metricInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        UI.updateModalRiskPreview();
      });
    }
  });
});

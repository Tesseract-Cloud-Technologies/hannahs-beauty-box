/* main.js */
(function() {
  'use strict';

  // --- Demo bar dismiss ---
  const demoBar = document.getElementById('demoBar');
  const dismissBtn = document.getElementById('dismissDemoBar');
  if (dismissBtn && demoBar) {
    if (localStorage.getItem('hbbDemoDismissed') === 'true') demoBar.style.display = 'none';
    dismissBtn.addEventListener('click', () => {
      demoBar.style.display = 'none';
      localStorage.setItem('hbbDemoDismissed', 'true');
    });
  }

  // --- Neon switch (dark mode toggle, in-memory only) ---
  const neonSwitch = document.getElementById('neonSwitch');
  const neonSign = document.getElementById('neonSign');
  let isDark = false;

  if (neonSwitch) {
    neonSwitch.addEventListener('click', () => {
      isDark = !isDark;
      document.body.classList.toggle('dark-mode', isDark);
      if (neonSign) neonSign.classList.toggle('off', isDark);
      neonSwitch.setAttribute('aria-pressed', String(!isDark));
    });
  }

  // --- Pre-select service from URL (services page "Book this" links) ---
  const params = new URLSearchParams(window.location.search);
  const presetService = params.get('service');
  if (presetService) {
    const serviceMap = {
      'Haircut & style': 'svcHaircut',
      'Colour': 'svcColour',
      'Facial': 'svcFacial',
      'Blow-dry': 'svcBlowDry',
      'Barber cut': 'svcBarber',
      'Beard trim': 'svcBeard',
      'Hot towel shave': 'svcShave',
      'Buzz cut': 'svcBuzz'
    };
    const id = serviceMap[presetService];
    if (id) {
      const el = document.getElementById(id);
      if (el) { el.checked = true; }
    }
  }

  // --- Booking form ---
  const bookingForm = document.getElementById('bookingForm');
  const summaryServices = document.getElementById('summaryServices');
  const summaryStylist = document.getElementById('summaryStylist');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTime = document.getElementById('summaryTime');
  const summaryTotal = document.getElementById('summaryTotal');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const bookingWhatsapp = document.getElementById('bookingWhatsapp');
  const stylistSelect = document.getElementById('stylistSelect');
  const bookingDate = document.getElementById('bookingDate');
  const timeChips = document.querySelectorAll('.time-chip');
  const serviceChecks = document.querySelectorAll('.service-check input[type="checkbox"]');
  let selectedTime = null;

  function updateSummary() {
    // Services
    const selected = Array.from(serviceChecks).filter(c => c.checked);
    if (summaryServices) {
      summaryServices.textContent = selected.length === 0
        ? 'None selected'
        : selected.map(c => c.value).join(', ');
    }
    // Total
    let total = 0;
    selected.forEach(c => { total += parseInt(c.dataset.price, 10) || 0; });
    if (summaryTotal) summaryTotal.textContent = 'K' + total;
    // Stylist
    if (summaryStylist) {
      summaryStylist.textContent = stylistSelect && stylistSelect.value ? stylistSelect.value : 'No preference';
    }
    // Date
    if (summaryDate) {
      summaryDate.textContent = bookingDate && bookingDate.value ? bookingDate.value : '—';
    }
    // Time
    if (summaryTime) summaryTime.textContent = selectedTime || '—';
  }

  serviceChecks.forEach(c => c.addEventListener('change', updateSummary));
  if (stylistSelect) stylistSelect.addEventListener('change', updateSummary);
  if (bookingDate) bookingDate.addEventListener('change', updateSummary);

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedTime = chip.dataset.time;
      updateSummary();
    });
  });

  if (bookingForm) updateSummary();

  // --- Form submission ---
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('bookName')?.value || 'Friend';
      const email = document.getElementById('bookEmail')?.value || '';
      const services = Array.from(serviceChecks).filter(c => c.checked).map(c => c.value).join(', ') || 'Not specified';
      const date = bookingDate?.value || 'TBC';
      const time = selectedTime || 'TBC';
      const stylist = stylistSelect?.value || 'No preference';
      const total = summaryTotal?.textContent || 'K0';
      const text = `Hello Hannah's Beauty Box! I'd like to book. Name: ${name}. Email: ${email}. Services: ${services}. Stylist: ${stylist}. Date: ${date}. Time: ${time}. Total: ${total}. (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (bookingWhatsapp) bookingWhatsapp.href = url;
      bookingForm.classList.add('d-none');
      if (bookingSuccess) bookingSuccess.classList.remove('d-none');
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactWhatsapp = document.getElementById('contactWhatsapp');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('contactName')?.value || 'Friend';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const text = `Hello Hannah's Beauty Box! My name is ${name}. Email: ${email}. Message: ${message} (Demo)`;
      const url = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      if (contactWhatsapp) contactWhatsapp.href = url;
      contactForm.classList.add('d-none');
      if (contactSuccess) contactSuccess.classList.remove('d-none');
    });
  }

})();
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const certificateTrack = document.querySelector('.certificate-track');
if (certificateTrack) {
  const originalCards = Array.from(certificateTrack.children);
  originalCards.forEach((card) => certificateTrack.appendChild(card.cloneNode(true)));
}

const certificateCards = document.querySelectorAll('.certificate-card');
const certificateModal = document.getElementById('certificateModal');
const certificateModalImg = document.getElementById('certificateModalImg');
const certificateModalClose = document.getElementById('certificateModalClose');

function openCertificateModal(imageSrc) {
  if (!certificateModal || !certificateModalImg) return;
  certificateModalImg.src = imageSrc;
  certificateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
  if (!certificateModal) return;
  certificateModal.classList.remove('open');
  document.body.style.overflow = '';
  if (certificateModalImg) {
    certificateModalImg.src = '';
  }
}

certificateCards.forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (img && img.src) {
      openCertificateModal(img.src);
    }
  });
});

if (certificateModalClose) {
  certificateModalClose.addEventListener('click', closeCertificateModal);
}

if (certificateModal) {
  certificateModal.addEventListener('click', (event) => {
    if (event.target === certificateModal) {
      closeCertificateModal();
    }
  });
}

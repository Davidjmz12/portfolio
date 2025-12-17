// ==================== MODAL FUNCTIONALITY ====================

// Get all navigation buttons
const navButtons = document.querySelectorAll('.nav-btn');

// Get all modals
const modals = document.querySelectorAll('.modal-overlay');

// Get all close buttons
const closeButtons = document.querySelectorAll('.modal-close');

/**
 * Opens a modal by its ID
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Hide main page content
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('hidden');
        }

        // Open modal after a short delay for smooth transition
        setTimeout(() => {
            modal.classList.add('active');
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }, 100);
    }
}

/**
 * Closes a modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';

        // Show main page content after modal closes
        setTimeout(() => {
            const container = document.querySelector('.container');
            if (container) {
                container.classList.remove('hidden');
            }
        }, 300);
    }
}

/**
 * Closes all open modals
 */
function closeAllModals() {
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';

    // Show main page content
    const container = document.querySelector('.container');
    if (container) {
        container.classList.remove('hidden');
    }
}

// Add click event listeners to navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalName = button.getAttribute('data-modal');
        const modalId = `modal-${modalName}`;
        openModal(modalId);
    });
});

// Add click event listeners to close buttons
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay');
        closeModal(modal);
    });
});

// Close modal when clicking outside the modal content
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ==================== PROJECT DETAILS FUNCTIONALITY ====================

/**
 * Opens a project details modal with project insights
 * Reads the project details from the HTML instead of JavaScript
 * @param {string} projectId - The ID of the project to display
 */
function openProjectDetails(projectId) {
    // Close the projects modal first
    const projectsModal = document.getElementById('modal-projects');
    closeModal(projectsModal);

    // Get project details from HTML
    const detailsElement = document.getElementById(`${projectId}-details`);
    if (!detailsElement) {
        console.error(`Project details not found for: ${projectId}`);
        return;
    }

    // Get project title from the project card
    const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
    const projectTitle = projectCard ? projectCard.querySelector('.project-title').textContent : 'Project Details';

    // Create a temporary modal for project details
    const detailsModalId = 'modal-project-details';
    let detailsModal = document.getElementById(detailsModalId);

    // Remove existing details modal if it exists
    if (detailsModal) {
        detailsModal.remove();
    }

    // Create new details modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = detailsModalId;

    modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${projectTitle}</h2>
        <button class="modal-close btn-glass" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        ${detailsElement.innerHTML}
      </div>
    </div>
  `;

    document.body.appendChild(modalOverlay);

    // Add event listeners
    const closeButton = modalOverlay.querySelector('.modal-close');
    closeButton.addEventListener('click', () => {
        closeModal(modalOverlay);
        // Reopen projects modal after closing details
        setTimeout(() => openModal('modal-projects'), 300);
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modalOverlay);
            // Reopen projects modal after closing details
            setTimeout(() => openModal('modal-projects'), 300);
        }
    });

    // Open the details modal
    setTimeout(() => {
        openModal(detailsModalId);
    }, 100);
}

// ==================== PROJECT CARD CLICK HANDLERS ====================

// Add click event listeners to all project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        const projectTitle = card.querySelector('.project-title');
        const projectPageBtn = card.querySelector('.project-btn');

        // Make the title clickable
        if (projectTitle && projectId) {
            projectTitle.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectDetails(projectId);
            });
            projectTitle.style.cursor = 'pointer';
        }

        // Make the "Project page" button clickable
        if (projectPageBtn && projectId) {
            projectPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectDetails(projectId);
            });
        }
    });
});

// ==================== SMOOTH ANIMATIONS ====================

/**
 * Adds entrance animations to elements when the page loads
 */
function initAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const socialLinks = document.querySelector('.social-links');
    const navButtonsContainer = document.querySelector('.nav-buttons');

    // Trigger animations on load
    setTimeout(() => {
        if (heroContent) heroContent.style.opacity = '1';
        if (socialLinks) socialLinks.style.opacity = '1';
        if (navButtonsContainer) navButtonsContainer.style.opacity = '1';
    }, 100);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});

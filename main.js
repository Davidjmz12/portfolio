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
 * @param {boolean} updateHash - Whether to update the URL hash
 */
function openModal(modalId, updateHash = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Hide main page content
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('hidden');
        }

        // Set active class
        // Use a small timeout only if we are not switching from another modal
        // But for simplicity and smoothness, we can just add it. 
        // However, keeping the requested logic:
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10); // Reduced delay for snappier feel

        // Update URL hash
        if (updateHash) {
            // Extract plain name if possible, e.g., 'about' from 'modal-about'
            const hashName = modalId.replace('modal-', '').replace('project-', 'project/');
            // If it's a project detail, it might have a slash
            window.history.pushState(null, '', `#${hashName}`);
        }
    }
}

/**
 * Closes a modal
 * @param {HTMLElement} modal - The modal element to close
 * @param {boolean} showMainContent - Whether to show the main content after closing
 */
function closeModal(modal, showMainContent = true) {
    if (modal) {
        modal.classList.remove('active');

        if (showMainContent) {
            // Restore body scroll
            document.body.style.overflow = '';

            // Show main page content after modal closes
            setTimeout(() => {
                const container = document.querySelector('.container');
                if (container) {
                    container.classList.remove('hidden');
                    container.style.opacity = '';
                    container.style.pointerEvents = '';
                }
            }, 300);

            // Clear hash
            window.history.pushState(null, '', ' ');
        }
    }
}

/**
 * Closes all open modals
 */
function closeAllModals() {
    modals.forEach(modal => {
        modal.classList.remove('active');
    });

    // Also close dynamic details modal if exists
    const detailsModal = document.getElementById('modal-project-details');
    if (detailsModal) {
        detailsModal.classList.remove('active');
        setTimeout(() => detailsModal.remove(), 300);
    }

    document.body.style.overflow = '';

    // Show main page content
    const container = document.querySelector('.container');
    if (container) {
        container.classList.remove('hidden');
        container.style.opacity = '';
        container.style.pointerEvents = '';
    }

    window.history.pushState(null, '', ' ');
}

// Add click event listeners to navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalName = button.getAttribute('data-modal');
        const modalId = `modal-${modalName}`;
        openModal(modalId);
    });
});

// Add click event listeners to close buttons (static ones)
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
        // If project details are open, go back to projects list
        const detailsModal = document.getElementById('modal-project-details');
        if (detailsModal && detailsModal.classList.contains('active')) {
            closeModal(detailsModal, false); // Don't show main content yet
            openModal('modal-projects');
        } else {
            closeAllModals();
        }
    }
});

// ==================== PROJECT DETAILS FUNCTIONALITY ====================

/**
 * Opens a project details modal with project insights
 * Reads the project details from the HTML instead of JavaScript
 * @param {string} projectId - The ID of the project to display
 */
function openProjectDetails(projectId) {
    // 1. Swap modals directly without showing main page content
    const projectsModal = document.getElementById('modal-projects');
    if (projectsModal) {
        projectsModal.classList.remove('active');
        // We do NOT call closeModal here because we don't want to trigger the main content fade-in
    }

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

    // Remove existing details modal if it exists to ensure freshness
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

    // Update URL hash for persistence
    window.history.pushState(null, '', `#project/${projectId}`);

    // STRICTLY ENDURE MAIN CONTENT IS HIDDEN
    // We clear any potential timeouts that might be scheduled to show the content
    // Use a global variable or attribute to track if we are in "modal mode"
    const container = document.querySelector('.container');
    if (container) {
        // Force styling immediately
        container.classList.add('hidden');
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';

        // Double check after a short delay to override any transition endings
        setTimeout(() => {
            container.classList.add('hidden');
            container.style.opacity = '0';
        }, 350);
    }

    // EVENT LISTENERS FOR NEW MODAL

    // 1. Close button (Behaves as Back button: Goes back to project list)
    const closeButton = modalOverlay.querySelector('.modal-close');
    closeButton.addEventListener('click', () => {
        // Close details, don't show main content
        closeModal(modalOverlay, false);
        // Reopen projects modal immediately
        setTimeout(() => openModal('modal-projects', false), 50);
    });

    // 2. Click outside (Closes everything, goes to home - standard behavior)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modalOverlay, true);
        }
    });

    // Open the details modal immediately
    setTimeout(() => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 50);
}

// ==================== PROJECT CARD CLICK HANDLERS ====================

// Add click event listeners to all project cards
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        const projectTitle = card.querySelector('.project-title');
        const projectPageBtn = card.querySelector('.project-buttons .project-btn:first-child');

        // Clickable Title
        if (projectTitle && projectId) {
            // Remove old listeners to avoid duplicates if re-init
            const newTitle = projectTitle.cloneNode(true);
            projectTitle.parentNode.replaceChild(newTitle, projectTitle);

            newTitle.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectDetails(projectId);
            });
            newTitle.style.cursor = 'pointer';
        }

        // Clickable Project Page Button (assuming first button is "Project page")
        if (projectPageBtn && projectId) {
            // Clone to remove old listeners
            const newBtn = projectPageBtn.cloneNode(true);
            projectPageBtn.parentNode.replaceChild(newBtn, projectPageBtn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectDetails(projectId);
            });
        }
    });
}

// ==================== ROUTING / STATE PERSISTENCE ====================

function checkHash() {
    const hash = window.location.hash.substring(1); // Remove #

    if (!hash) return;

    if (hash === 'projects') {
        openModal('modal-projects', false);
    } else if (hash === 'about') {
        openModal('modal-about', false);
    } else if (hash === 'contact') {
        openModal('modal-contact', false);
    } else if (hash.startsWith('project/')) {
        const projectId = hash.split('/')[1];
        if (projectId) {
            // First open projects modal in background (optional, but good for back nav context)
            // But to avoid flashing, we might just open details directly.
            // Let's open details directly.
            openProjectDetails(projectId);
        }
    }
}


// ==================== CONTACT FORM FUNCTIONALITY ====================

/**
 * Handles contact form submission by opening mailto link
 * @param {Event} e - Submit event
 */
function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value || 'Portfolio Contact';
    const message = document.getElementById('message').value;

    const destination = 'davidjmzom1@gmail.com';

    // Construct body with proper encoding
    const body = `Name: ${name}
Email: ${email}
    
Message:
${message}`;

    const mailtoUrl = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
}

// ==================== INITIALIZATION ====================

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initProjectCards();

    // Init Contact Form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Check URL hash for direct access (reload persistence)
    setTimeout(checkHash, 200); // Slight delay to ensure DOM is ready and animations started
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    // specific logic could go here, but for now simple hash check might conflict with modal states
    // A full router is overkill, but basic handling:
    closeAllModals();
    checkHash();
});

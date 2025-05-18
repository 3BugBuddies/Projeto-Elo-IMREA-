document.addEventListener('DOMContentLoaded', function() {
    const testSetupButton = document.getElementById('test-setup-btn');

    if (testSetupButton) {
        testSetupButton.addEventListener('click', function() {
            alert('This would ideally open a camera/microphone test interface.');
            // In a real implementation, this would trigger a function
            // to access the user's media devices and display a preview.
        });
    }
});

// In a real application, you would use the getUserMedia API
// to access the camera and microphone. This is a simplified example.
async function testCameraAndMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Handle the stream (e.g., display a preview)
        console.log('Camera and microphone access granted:', stream);
        // You would then display the video stream in a video element
        // and potentially provide feedback on the audio level.
    } catch (error) {
        console.error('Error accessing camera and microphone:', error);
        alert('Please ensure you have granted camera and microphone permissions in your browser settings.');
    }
}

// If you wanted to trigger the test on button click:
// testSetupButton.addEventListener('click', testCameraAndMicrophone);

function validateForm() {
    let isValid = true;
    const errors = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    // Name validation
    const name = document.getElementById('name').value.trim();
    if (!name) {
        errors.name = 'Por favor, insira o seu nome.';
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email').value.trim();
    if (!email) {
        errors.email = 'Por favor, insira um email válido.';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Phone validation
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        errors.phone = 'Por favor, insira o seu número de telefone.';
        isValid = false;
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(phone)) {
        errors.phone = 'Por favor, insira o seu número de telefone válido.';
        isValid = false;
    }

    // Subject validation
    const subject = document.getElementById('subject').value.trim();
    if (!subject) {
        errors.subject = 'Por favor, insira o tema do assunto.';
        isValid = false;
    }

    // Message validation
    const message = document.getElementById('message').value.trim();
    if (!message) {
        errors.message = 'Por favor, insira a sua mensagem.';
        isValid = false;
    } else if (message.length < 10) {
        errors.message = 'A mensagem deve ter pelo menos 10 caracteres.';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        const inputElement = document.getElementById(field);
        
        errorElement.textContent = errors[field];
        errorElement.style.display = errors[field] ? 'block' : 'none';
        
        if (errors[field]) {
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.style.borderColor = 'var(--error-color)';
        } else {
            inputElement.removeAttribute('aria-invalid');
            inputElement.style.borderColor = 'var(--border-color)';
        }
    });

    return isValid;
}

function handleSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const submitButton = event.target.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        
        // Disable button and show loading state
        submitButton.disabled = true;
        buttonText.textContent = 'Sending...';
        submitButton.setAttribute('aria-label', 'enviando sua mensagem...');
        
        // Simulate form submission
        setTimeout(() => {
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.remove('hidden');
            submitButton.disabled = false;
            buttonText.textContent = 'Send Message';
            submitButton.setAttribute('aria-label', 'submeter sua mensagem');
            event.target.reset();
            
            // Set focus to the success message for screen readers
            successMessage.querySelector('button').focus();
        }, 1500);
    }
}

function resetForm() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('hidden');
    document.getElementById('contactForm').reset();
    
    // Reset focus to the first form input
    document.getElementById('name').focus();
}

// Add input event listeners for real-time validation
const formInputs = ['name', 'email', 'phone', 'subject', 'message'];
formInputs.forEach(field => {
    const input = document.getElementById(field);
    input.addEventListener('input', () => {
        const errorElement = document.getElementById(`${field}Error`);
        errorElement.style.display = 'none';
        input.style.borderColor = 'var(--border-color)';
        input.removeAttribute('aria-invalid');
    });
});

// Add keyboard support for the success message dialog
document.addEventListener('keydown', (event) => {
    const successMessage = document.getElementById('successMessage');
    if (!successMessage.classList.contains('hidden') && event.key === 'Escape') {
        resetForm();
    }
});
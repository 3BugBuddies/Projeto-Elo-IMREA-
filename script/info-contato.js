//validar os dados inseridos em um formulário de contato
function validateForm() {
    let isValid = true; //variável boolean
    // Objeto para armazenar mensagens de erro
    const errors = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    // Nome validacao
    const name = document.getElementById('name').value.trim();//trim remove espaços em branco extras do início e do fim
    if (!name) {
        errors.name = 'Por favor, insira o seu nome.';
        isValid = false;
    }

    // Email validacao
    const email = document.getElementById('email').value.trim();
    if (!email) {
        errors.email = 'Por favor, insira um email válido.';
        isValid = false;
    //regex para validar o formato do email
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Fone validacao
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        errors.phone = 'Por favor, insira o seu número de telefone.';
        isValid = false;
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(phone)) {
        errors.phone = 'Por favor, insira o seu número de telefone válido.';
        isValid = false;
    }

    // Assunto validacao
    const subject = document.getElementById('subject').value.trim();
    if (!subject) {
        errors.subject = 'Por favor, insira o tema do assunto.';
        isValid = false;
    }

    // Messagem validacao
    const message = document.getElementById('message').value.trim();
    if (!message) {
        errors.message = 'Por favor, insira a sua mensagem.';
        isValid = false;
    } else if (message.length < 10) {
        errors.message = 'A mensagem deve ter pelo menos 10 caracteres.';
        isValid = false;
    }

    // Itera sobre cada campo no objeto de erros e atualiza a exibição
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

        // Acessa os valores dos inputs individualmente
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        console.log('Valores do formulário:');
        console.log('Nome:', name);
        console.log('Email:', email);
        console.log('Mensagem:', message);

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

            // Set focus to para a mensagem de sucesso para leitores de tela
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
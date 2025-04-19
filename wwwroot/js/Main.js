import ContactManager from './contact/ContactManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/5.0.11/signalr.min.js';
    script.onload = () => new ContactManager();
    document.head.appendChild(script);
});

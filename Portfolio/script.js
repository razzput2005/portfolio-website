// script.js - COMPLETE VERSION

// ===== 1. LOADING SCREEN =====
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Show loading for minimum 1 second
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Initialize animations after loading
            animateSkillBars();
            startStatsCounter();
        }, 500);
    }, 1000);
});

// ===== 2. MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close menu when clicking on links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===== 3. BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    // Show/hide back to top button
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Animate elements on scroll
    animateSkillBars();
    animateElements();
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== 4. ANIMATE ELEMENTS ON SCROLL =====
function animateElements() {
    const elements = document.querySelectorAll('.project-card, .skill-card, .timeline-item, .about-img-box, .info-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// ===== 5. SKILL BARS ANIMATION =====
const skillCards = document.querySelectorAll('.skill-card');

function animateSkillBars() {
    skillCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (cardPosition < screenPosition && !card.classList.contains('animated')) {
            card.classList.add('animated');
            
            const skillPercent = card.getAttribute('data-skill');
            const progressBar = card.querySelector('.skill-progress');
            const percentText = card.querySelector('.skill-percent');
            
            // Animate progress bar
            let current = 0;
            const increment = skillPercent / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= skillPercent) {
                    current = skillPercent;
                    clearInterval(timer);
                }
                progressBar.style.width = current + '%';
                percentText.textContent = Math.round(current) + '%';
            }, 20);
        }
    });
}

// ===== 6. PROJECT FILTERING =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== 7. STATISTICS COUNTER =====
function startStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.round(current);
        }, 20);
    });
}

// ===== 8. INTERACTIVE MODAL =====
const modal = document.getElementById("interactive-modal");
const openModalBtn = document.getElementById("open-modal");
const closeBtn = document.querySelector(".close");

// Open modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    document.body.style.overflow = 'hidden';
});

// Close modal with X button
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
});

// ===== 9. MODAL TABS =====
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// ===== 10. LIVE CODE EDITOR =====
document.getElementById("run-code").addEventListener("click", () => {
    const code = document.getElementById("code-editor").value;
    const output = document.getElementById("code-output");
    
    try {
        // Clear previous output
        output.innerHTML = '';
        
        // Create iframe for safe code execution
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 200px;
            border: none;
            background: white;
            border-radius: 10px;
            margin-top: 10px;
        `;
        output.appendChild(iframe);
        
        // Write code to iframe
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        margin: 0;
                    }
                    ${code.includes('<style>') ? '' : ''}
                </style>
            </head>
            <body>
                ${code}
                <script>
                    // Wrap script in try-catch for error handling
                    try {
                        ${code.includes('<script>') ? '' : ''}
                    } catch(e) {
                        console.error(e);
                    }
                <\/script>
            </body>
            </html>
        `);
        iframeDoc.close();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
        `;
        successMsg.textContent = '✅ Code executed successfully!';
        output.appendChild(successMsg);
        
    } catch (error) {
        output.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px;">
                ❌ Error executing code: ${error.message}
            </div>
        `;
    }
});

// Example code in editor
document.getElementById('code-editor').value = `<h1 style="color: #64b964;">Hello, World!</h1>
<p>Try editing this HTML code and click "Run Code"</p>
<button onclick="alert('Hello from the code editor!')">Click Me</button>`;

// ===== 11. CHATBOT =====
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const botReplies = {
    "hi": "Hello! 👋 How can I help you today?",
    "hello": "Hi there! Nice to see you here.",
    "how are you": "I'm doing great, thanks for asking! How about you?",
    "what is your name": "I'm your Portfolio Assistant Bot! 🤖",
    "bye": "Goodbye! Feel free to come back anytime.",
    "who is your dev": "I was created by Pavan Chauhan, a frontend developer!",
    "what can you do": "I can chat with you, tell you about Pavan's projects, or help you navigate the portfolio.",
    "projects": "Pavan has worked on several projects including Bakery Website, Foodie Website, Netflix Clone, and more! Check out the Projects section.",
    "skills": "Pavan is skilled in HTML5, CSS3, JavaScript, Bootstrap, and currently learning React.",
    "contact": "You can contact Pavan via email at kavitadiva741@gmail.com or through the contact form.",
    "thank you": "You're welcome! 😊",
    "help": "You can ask me about: projects, skills, contact info, or just say hi!",
    "portfolio": "This portfolio showcases Pavan's frontend development skills and projects. Feel free to explore!",
    "github": "Check out Pavan's GitHub: https://github.com/Pavansingh2005",
    "experience": "Pavan is a Computer Science student with hands-on experience in web development.",
    "education": "Pavan is currently pursuing Computer Science and building his skills in frontend development."
};

function addMessage(sender, message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const senderSpan = document.createElement("span");
    senderSpan.style.fontWeight = "bold";
    senderSpan.textContent = sender + ": ";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = message;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(textSpan);
    chatLog.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatLog.scrollTop = chatLog.scrollHeight;
}

function getBotReply(message) {
    message = message.toLowerCase().trim();
    
    // Check for exact matches first
    for (let key in botReplies) {
        if (message === key) {
            return botReplies[key];
        }
    }
    
    // Check for partial matches
    for (let key in botReplies) {
        if (message.includes(key) && key.length > 3) {
            return botReplies[key];
        }
    }
    
    // Default reply for unknown messages
    const defaultReplies = [
        "I'm not sure I understand. Can you rephrase that?",
        "That's interesting! Could you tell me more?",
        "I'm still learning! Try asking about projects, skills, or contact info.",
        "Hmm, I don't have an answer for that. Try asking something else!"
    ];
    
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage("You", message, true);
    chatInput.value = "";
    
    // Bot reply after delay
    setTimeout(() => {
        const reply = getBotReply(message);
        addMessage("Bot", reply, false);
    }, 500);
});

chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

// ===== 12. CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        subject: this.querySelector('input[placeholder="Subject"]').value,
        message: this.querySelector('textarea').value
    };
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Sending message...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        this.reset();
        
        // Log form data (in real app, this would go to a server)
        console.log('Form submitted:', formData);
    }, 1500);
});

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== 13. CV DOWNLOAD =====
document.getElementById('download-cv').addEventListener('click', function(e) {
    e.preventDefault();
    
    showNotification('Preparing your download...', 'info');
    
    // Simulate download process
    setTimeout(() => {
        const cvModal = document.createElement('div');
        cvModal.id = 'cv-modal';
        cvModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        cvModal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <button id="close-cv-modal" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                ">×</button>
                
                <h2 style="color: #64b964; margin-bottom: 20px;">CV Preview</h2>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 10px;">
                    <h3>Pavan Chauhan</h3>
                    <p><strong>Frontend Developer</strong></p>
                    <hr>
                    <h4>Contact Information</h4>
                    <p>Email: kavitadiva741@gmail.com</p>
                    <p>Phone: +91 92345 32112</p>
                    <p>Location: Muzaffarpur, Bihar</p>
                    <hr>
                    <h4>Skills</h4>
                    <ul>
                        <li>HTML5 (90%)</li>
                        <li>CSS3 (75%)</li>
                        <li>JavaScript (40%)</li>
                        <li>Bootstrap (30%)</li>
                        <li>React (Learning)</li>
                    </ul>
                    <hr>
                    <h4>Projects</h4>
                    <ul>
                        <li>Bakery Website</li>
                        <li>Foodie Website</li>
                        <li>Netflix Clone</li>
                        <li>E-commerce Store</li>
                    </ul>
                </div>
                <button id="real-download" style="
                    background: #64b964;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 5px;
                    margin-top: 20px;
                    width: 100%;
                    cursor: pointer;
                    font-size: 16px;
                ">Download PDF Version</button>
            </div>
        `;
        
        document.body.appendChild(cvModal);
        
        // Close modal button
        document.getElementById('close-cv-modal').addEventListener('click', () => {
            cvModal.remove();
        });
        
        // Real download button
        document.getElementById('real-download').addEventListener('click', () => {
            showNotification('Download started! Check your downloads folder.', 'success');
            cvModal.remove();
            
            // Create a temporary download
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('CV - Pavan Chauhan\n\nThis is a demo CV download.\nIn a real portfolio, this would be a PDF file.');
            link.download = 'Pavan_Chauhan_CV.txt';
            link.click();
        });
        
        // Close modal when clicking outside
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.remove();
            }
        });
    }, 1000);
});

// ===== 14. SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 15. INITIALIZE ON DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements with opacity 0 for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Start animation for elements already in view
    setTimeout(animateElements, 100);
    
    // Add hover effect to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initialize skill bars with 0 width
    skillCards.forEach(card => {
        const progressBar = card.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    });
});

// ===== 16. COPYRIGHT YEAR UPDATE =====
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Add current year to footer if not already present
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear && !footerYear.innerHTML.includes('2025')) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', new Date().getFullYear());
    }
});

// ===== 17. FORM VALIDATION ENHANCEMENT =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            // Validate on blur
            if (input.value.trim() === '' && input.hasAttribute('required')) {
                input.parentElement.classList.add('error');
            } else {
                input.parentElement.classList.remove('error');
            }
        });
    });
}

// ===== 18. PROJECT CARD CLICK EFFECTS =====
projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on links
        if (!e.target.closest('a')) {
            card.classList.toggle('active');
        }
    });
});

// ===== 19. ADD VISITED LINK TRACKING =====
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        // Store visited links in session storage
        const visitedLinks = JSON.parse(sessionStorage.getItem('visitedLinks') || '[]');
        if (!visitedLinks.includes(this.href)) {
            visitedLinks.push(this.href);
            sessionStorage.setItem('visitedLinks', JSON.stringify(visitedLinks));
        }
    });
});

// ===== 20. PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 100);
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize active nav link on load
updateActiveNavLink();
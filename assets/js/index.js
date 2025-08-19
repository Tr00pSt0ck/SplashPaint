
        // Simple animation for the hero section
        document.addEventListener('DOMContentLoaded', function() {
            // Add animation to hero text
            const heroHeading = document.querySelector('.hero h2');
            const heroParagraph = document.querySelector('.hero p');
            const heroButton = document.querySelector('.cta-btn');
            
            setTimeout(() => {
                heroHeading.style.opacity = '1';
                heroHeading.style.transform = 'translateY(0)';
            }, 300);
            
            setTimeout(() => {
                heroParagraph.style.opacity = '1';
                heroParagraph.style.transform = 'translateY(0)';
            }, 600);
            
            setTimeout(() => {
                heroButton.style.opacity = '1';
                heroButton.style.transform = 'translateY(0)';
            }, 900);
            
            // Initialize elements with hidden state
            heroHeading.style.opacity = '0';
            heroHeading.style.transform = 'translateY(20px)';
            heroHeading.style.transition = 'all 0.8s ease-out';
            
            heroParagraph.style.opacity = '0';
            heroParagraph.style.transform = 'translateY(20px)';
            heroParagraph.style.transition = 'all 0.8s ease-out 0.3s';
            
            heroButton.style.opacity = '0';
            heroButton.style.transform = 'translateY(20px)';
            heroButton.style.transition = 'all 0.8s ease-out 0.6s';
            
            // Add scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            // Observe feature cards
            document.querySelectorAll('.feature-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                observer.observe(card);
            });
            
            // Observe testimonial cards
            document.querySelectorAll('.testimonial-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                observer.observe(card);
            });
        });
    
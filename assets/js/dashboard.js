
        // Loading screen removal
        setTimeout(function() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }
        }, 2000);

        document.addEventListener('DOMContentLoaded', function() {
            // PWA Banner Elements
            const pwaBanner = document.getElementById('pwa-banner');
            const installButton = document.getElementById('install-button');
            const dismissButton = document.getElementById('dismiss-button');
            let deferredPrompt = null;
            
            // Check if the app is already installed
            function isAppInstalled() {
                return window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator.standalone) || 
                       document.referrer.includes('android-app://');
            }
            
            // Enhanced PWA detection for all browsers
            function checkPWAInstallable() {
                // Check if app is already installed
                if (isAppInstalled()) {
                    return false;
                }
                
                // Check if the beforeinstallprompt event is supported
                const isBeforeInstallPromptSupported = 'onbeforeinstallprompt' in window;
                
                // Check if it's iOS (which handles PWA differently)
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                
                // Check session storage for dismissal
                const isDismissed = sessionStorage.getItem('pwaDismissed') === 'true';
                
                return (isBeforeInstallPromptSupported || isIOS) && !isDismissed;
            }
            
            // PWA Banner Logic
            function showPwaBanner() {
                if (!checkPWAInstallable()) return;
                
                // Calculate and set body padding
                pwaBanner.style.display = 'flex';
                const bannerHeight = pwaBanner.offsetHeight;
                document.body.style.paddingTop = `${bannerHeight}px`;
                
                // Show banner with animation
                setTimeout(() => {
                    pwaBanner.classList.add('show');
                }, 50);
            }
            
            // Before Install Prompt
            window.addEventListener('beforeinstallprompt', (e) => {
                // Prevent the mini-infobar from appearing on mobile
                e.preventDefault();
                // Store the event for later use
                deferredPrompt = e;
                // Show our banner
                showPwaBanner();
            });
            
            // Check if we should show the banner on iOS
            function checkIOSPWA() {
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                if (isIOS) {
                    // Show iOS-specific instructions after a delay
                    setTimeout(() => {
                        if (checkPWAInstallable()) {
                            const pwaText = document.querySelector('.pwa-text');
                            if (pwaText) {
                                pwaText.textContent = "Add this app to your home screen for quick access";
                            }
                            showPwaBanner();
                        }
                    }, 3000);
                }
            }
            
            // Run iOS check
            checkIOSPWA();
            
            // Install Button
            installButton.addEventListener('click', async () => {
                // Hide the banner
                pwaBanner.classList.remove('show');
                setTimeout(() => {
                    pwaBanner.style.display = 'none';
                    document.body.style.paddingTop = '20px';
                }, 500);
                
                // Check if we're on iOS
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                
                if (isIOS) {
                    // Show iOS-specific instructions
                    showNotification('To install: Tap the share icon and select "Add to Home Screen"', 'info');
                } else if (deferredPrompt) {
                    // Show the install prompt for non-iOS devices
                    deferredPrompt.prompt();
                    
                    // Wait for the user to respond to the prompt
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        showNotification('App installed successfully!', 'success');
                    } else {
                        showNotification('App installation cancelled', 'info');
                    }
                    deferredPrompt = null;
                }
            });
            
            // Dismiss Button
            dismissButton.addEventListener('click', () => {
                // Hide banner with animation
                pwaBanner.classList.remove('show');
                setTimeout(() => {
                    pwaBanner.style.display = 'none';
                    document.body.style.paddingTop = '20px';
                }, 500);
                
                // Remember dismissal for this session
                sessionStorage.setItem('pwaDismissed', 'true');
                showNotification('Banner dismissed for this session', 'info');
            });
            
            // App Installed Event
            window.addEventListener('appinstalled', () => {
                // Hide the banner if it's visible
                pwaBanner.classList.remove('show');
                pwaBanner.style.display = 'none';
                document.body.style.paddingTop = '20px';
                
                // Clear session storage flag
                sessionStorage.removeItem('pwaDismissed');
                deferredPrompt = null;
            });

            // Elements
            const uploadArea = document.getElementById('upload-area');
            const imageInput = document.getElementById('image-input');
            const imagePreviewContainer = document.getElementById('image-preview-container');
            const imagePreview = document.getElementById('image-preview');
            const previewInfo = document.getElementById('preview-info');
            const generateBtn = document.getElementById('generate-btn');
            const resetBtn = document.getElementById('reset-btn');
            const faviconPreview = document.getElementById('favicon-preview');
            const previewPlaceholder = document.getElementById('preview-placeholder');
            const downloadBtn = document.getElementById('download-btn');
            const progressContainer = document.getElementById('progress-container');
            const progressBar = document.getElementById('progress-bar');
            const notification = document.getElementById('notification');
            const customWidthInput = document.getElementById('custom-width');
            const customHeightInput = document.getElementById('custom-height');
            const addSizeBtn = document.getElementById('add-size-btn');
            const customSizesContainer = document.getElementById('custom-sizes-container');
            
            let originalImage = null;
            let generatedFavicon = null;
            let customSizes = [];
            
            // Event listeners
            imageInput.addEventListener('change', handleImageUpload);
            generateBtn.addEventListener('click', generateFavicon);
            resetBtn.addEventListener('click', resetApp);
            downloadBtn.addEventListener('click', downloadFavicons);
            addSizeBtn.addEventListener('click', addCustomSize);
            
            // Handle image upload
            function handleImageUpload(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                if (!file.type.match('image.*')) {
                    showNotification('Please upload an image file (PNG, JPG, SVG)', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    originalImage = new Image();
                    originalImage.onload = function() {
                        // Show preview container
                        imagePreview.src = event.target.result;
                        imagePreviewContainer.style.display = 'block';
                        uploadArea.classList.add('active');
                        
                        // Update preview info
                        previewInfo.textContent = `${originalImage.width}×${originalImage.height} px`;
                        
                        // Reset favicon preview
                        faviconPreview.style.display = 'none';
                        previewPlaceholder.style.display = 'block';
                        downloadBtn.disabled = true;
                    };
                    originalImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
            
            // Add custom size
            function addCustomSize() {
                const width = parseInt(customWidthInput.value);
                const height = parseInt(customHeightInput.value);
                
                // Validation
                if (!width || !height) {
                    showNotification('Please enter both width and height values', 'error');
                    return;
                }
                
                if (isNaN(width) || isNaN(height)) {
                    showNotification('Please enter valid numbers for width and height', 'error');
                    return;
                }
                
                if (width < 16 || height < 16) {
                    showNotification('Minimum size is 16x16 pixels', 'error');
                    return;
                }
                
                if (width > 1000 || height > 1000) {
                    showNotification('Maximum size is 1000x1000 pixels', 'error');
                    return;
                }
                
                // Check if size already exists
                const sizeExists = customSizes.some(size => size.width === width && size.height === height);
                if (sizeExists) {
                    showNotification('This size has already been added', 'error');
                    return;
                }
                
                // Add to custom sizes array
                customSizes.push({ width, height });
                
                // Create and display custom size tag
                const sizeTag = document.createElement('div');
                sizeTag.className = 'custom-size-tag';
                sizeTag.innerHTML = `
                    <span>${width}×${height}</span>
                    <button class="remove-size" title="Remove this size" data-width="${width}" data-height="${height}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                customSizesContainer.appendChild(sizeTag);
                
                // Add remove event listener
                const removeBtn = sizeTag.querySelector('.remove-size');
                removeBtn.addEventListener('click', function() {
                    const w = parseInt(this.dataset.width);
                    const h = parseInt(this.dataset.height);
                    customSizes = customSizes.filter(size => size.width !== w || size.height !== h);
                    sizeTag.remove();
                    showNotification(`Size ${w}x${h} removed`, 'info');
                });
                
                // Clear inputs
                customWidthInput.value = '';
                customHeightInput.value = '';
                
                showNotification(`Custom size ${width}x${height} added`, 'success');
            }
            
            // Generate favicon with transparent padding
            function generateFavicon() {
                if (!originalImage) {
                    showNotification('Please upload an image first', 'error');
                    return;
                }
                
                // Create a square canvas with transparent background
                const size = 400;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // Fill with transparent background
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, size, size);
                
                // Calculate scale to fit the entire image
                const scale = Math.min(size / originalImage.width, size / originalImage.height);
                const newWidth = originalImage.width * scale;
                const newHeight = originalImage.height * scale;
                
                // Calculate position to center the image
                const x = (size - newWidth) / 2;
                const y = (size - newHeight) / 2;
                
                // Draw the image centered with transparent padding
                ctx.drawImage(originalImage, x, y, newWidth, newHeight);
                
                // Convert to data URL
                generatedFavicon = canvas.toDataURL('image/png');
                
                // Update preview
                faviconPreview.src = generatedFavicon;
                faviconPreview.style.display = 'block';
                previewPlaceholder.style.display = 'none';
                
                // Enable download button
                downloadBtn.disabled = false;
                
                // Show success message
                showNotification('Favicon generated successfully!', 'success');
            }
            
            // Download favicons in multiple sizes with transparent padding
            function downloadFavicons() {
                if (!generatedFavicon) {
                    showNotification('Please generate a favicon first', 'error');
                    return;
                }
                
                // Standard sizes array
                const standardSizes = [
                    { width: 16, height: 16 },
                    { width: 32, height: 32 },
                    { width: 48, height: 48 },
                    { width: 64, height: 64 },
                    { width: 128, height: 128 },
                    { width: 256, height: 256 },
                    { width: 180, height: 180 },
                    { width: 187, height: 187 },
                    { width: 250, height: 250 },
                    { width: 400, height: 400 }
                ];
                
                // Combine standard and custom sizes
                const allSizes = [...standardSizes, ...customSizes];
                
                if (allSizes.length === 0) {
                    showNotification('No sizes selected for download', 'error');
                    return;
                }
                
                const zip = new JSZip();
                const folder = zip.folder("favicons");
                
                // Show progress
                progressContainer.style.display = 'block';
                progressBar.style.width = '0%';
                
                // Create a temporary image for resizing
                const tempImage = new Image();
                tempImage.src = generatedFavicon;
                
                tempImage.onload = function() {
                    // Process each size
                    let processed = 0;
                    
                    allSizes.forEach(size => {
                        const { width, height } = size;
                        
                        // Create canvas for this size
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        
                        // Fill with transparent background
                        ctx.fillStyle = 'transparent';
                        ctx.fillRect(0, 0, width, height);
                        
                        // Calculate scale to fit the entire image
                        const scale = Math.min(width / tempImage.width, height / tempImage.height);
                        const newWidth = tempImage.width * scale;
                        const newHeight = tempImage.height * scale;
                        
                        // Calculate position to center the image
                        const x = (width - newWidth) / 2;
                        const y = (height - newHeight) / 2;
                        
                        // Draw the image centered with transparent padding
                        ctx.drawImage(tempImage, x, y, newWidth, newHeight);
                        
                        // Convert to blob and add to zip
                        canvas.toBlob(blob => {
                            folder.file(`favicon-${width}x${height}.png`, blob);
                            
                            // Update progress
                            processed++;
                            const progress = (processed / allSizes.length) * 100;
                            progressBar.style.width = `${progress}%`;
                            
                            // If all processed, generate zip
                            if (processed === allSizes.length) {
                                zip.generateAsync({type:"blob"}, meta => {
                                    progressBar.style.width = `${meta.percent}%`;
                                }).then(content => {
                                    // Download the zip file
                                    saveAs(content, "splashpaint-favicons.zip");
                                    
                                    // Hide progress
                                    setTimeout(() => {
                                        progressContainer.style.display = 'none';
                                    }, 1000);
                                    
                                    showNotification('Favicons downloaded successfully!', 'success');
                                });
                            }
                        }, 'image/png');
                    });
                };
            }
            
            // Reset the app
            function resetApp() {
                // Reset elements
                uploadArea.classList.remove('active');
                imagePreviewContainer.style.display = 'none';
                faviconPreview.style.display = 'none';
                previewPlaceholder.style.display = 'block';
                downloadBtn.disabled = true;
                progressContainer.style.display = 'none';
                
                // Reset inputs
                imageInput.value = '';
                customWidthInput.value = '';
                customHeightInput.value = '';
                
                // Reset custom sizes
                customSizes = [];
                customSizesContainer.innerHTML = '';
                
                // Reset images
                originalImage = null;
                generatedFavicon = null;
                
                showNotification('App has been reset', 'info');
            }
            
            // Show notification
            function showNotification(message, type) {
                notification.textContent = message;
                notification.className = `notification ${type} show`;
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
        });
    
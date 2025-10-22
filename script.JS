function Image(url, alt, description) {
    this.URL = url;
    this.attributeValue = alt;
    this.description = description;

    this.getURL = function() {
        return this.URL;
    }

    this.getAttributeValue = function() {
        return this.attributeValue;
    }

    this.getDescription = function() {
        return this.description;
    }
}

let morning = new Image("images/morning.jpg", "Morning", "A breathtaking morning in Rio de Janeiro, with sunlight glistening over Sugarloaf Mountain and the calm waters of Guanabara Bay.");
let morning1 = new Image("images/morning1.jpg", "Morning1", "A beautiful morning view with the sun rising over the horizon.");
let noon = new Image("images/noon.jpg", "Noon", "A bright noon scene with the sun high in the sky and clear blue skies.");
let evening = new Image("images/evening.jpg", "Evening", "A serene evening with the sun setting and casting a golden glow over the landscape.");
let evening1 = new Image("images/evening1.jpg", "Evening1", "A breathtaking evening sky glowing with shades of pink, casting a warm and serene light over the landscape.");
let night = new Image("images/night.jpeg", "Night", "A tranquil night scene with the moon shining brightly.");

let images = [morning1 ,morning, noon, evening1, evening, night];
let slides = [morning, morning1, noon, evening1, evening, night];

function setBackground(images) {
    let currentHour = new Date().getHours();
    let index;

    if (currentHour >= 5 && currentHour < 9) {
        index = 0; // Morning1
    } else if (currentHour >= 9 && currentHour < 12) {
        index = 1; // Morning
    } else if (currentHour >= 12 && currentHour < 14) {
        index = 2; // Noon
    } else if (currentHour >= 14 && currentHour < 17) {
        index = 3; // Noon1
    } else if (currentHour >= 17 && currentHour < 19) {
        index = 4; // Evening
    } else {
        index = 5; // Night
    }

    document.getElementById("beach").src = images[index].getURL();
    document.getElementById("beach").setAttribute("alt", images[index].getAttributeValue());
    document.getElementById("description").textContent = images[index].getDescription();
    document.getElementById("time").textContent = new Date().toLocaleTimeString();
    document.getElementById("date").textContent = new Date().toLocaleDateString();
}

function nextImage() {
    let currentSrc = document.getElementById("slide").src;
    let currentIndex = slides.findIndex(image => currentSrc.includes(image.getURL()));
    let nextIndex = (currentIndex + 1) % slides.length;
    document.getElementById("slide").src = slides[nextIndex].getURL();
    document.getElementById("slide").setAttribute("alt", slides[nextIndex].getAttributeValue());
    document.getElementById("slide-description").textContent = slides[nextIndex].getDescription();
}

let previousIndex = -1;
function randomImage() {
    let randomIndex = Math.floor(Math.random() * (slides.length));
    
    while (randomIndex === previousIndex || randomIndex === 0) {
        randomIndex = Math.floor(Math.random() * (slides.length));
    }

    document.getElementById("slide").src = slides[randomIndex].getURL();
    document.getElementById("slide").setAttribute("alt", slides[randomIndex].getAttributeValue());
    document.getElementById("slide-description").textContent = slides[randomIndex].getDescription();
    
    previousIndex = randomIndex;
}

function setSlideShow(slides) {
    document.getElementById("slide").src = slides[0].getURL();
    document.getElementById("slide").setAttribute("alt", slides[0].getAttributeValue());
    document.getElementById("slide-description").textContent = slides[0].getDescription();
}

// jQuery-enhanced behaviors and improvements
$(function() {
    // Cache selectors
    const $beach = $('#beach');
    const $time = $('#time');
    const $date = $('#date');
    const $description = $('#description');
    const $slide = $('#slide');
    const $slideDescription = $('#slide-description');
    const $nextBtn = $('#next-image');
    const $randomBtn = $('#random-image');

    // Accessibility: announce dynamic changes
    $description.attr('aria-live', 'polite');
    $slideDescription.attr('aria-live', 'polite');

    // Preload slideshow images
    slides.forEach(s => {
        const img = new Image();
        img.src = s.getURL();
    });

    // Internal state to avoid unnecessary background reloads
    let lastBackgroundHour = new Date().getHours();

    function setBackgroundWithFade(images) {
        const now = new Date();
        const currentHour = now.getHours();
        let index;

        if (currentHour >= 5 && currentHour < 9) {
            index = 0; // Morning1
        } else if (currentHour >= 9 && currentHour < 12) {
            index = 1; // Morning
        } else if (currentHour >= 12 && currentHour < 14) {
            index = 2; // Noon
        } else if (currentHour >= 14 && currentHour < 17) {
            index = 3; // Noon1
        } else if (currentHour >= 17 && currentHour < 19) {
            index = 4; // Evening
        } else {
            index = 5; // Night
        }

        // Only change the background image when the hour bucket changes
        if (currentHour !== lastBackgroundHour) {
            $beach.stop(true, true).fadeOut(300, function() {
                $beach.attr('src', images[index].getURL())
                      .attr('alt', images[index].getAttributeValue())
                      .fadeIn(300);
            });
            $description.text(images[index].getDescription());
            lastBackgroundHour = currentHour;
        }

        // Always update time & date every call
        $time.text(now.toLocaleTimeString());
        $date.text(now.toLocaleDateString());
    }

    // Slide helper to change with fade
    function setSlide(index) {
        const s = slides[index];
        $slide.stop(true, true).fadeOut(200, function() {
            $slide.attr('src', s.getURL()).attr('alt', s.getAttributeValue()).fadeIn(200);
        });
        $slideDescription.text(s.getDescription());
    }

    function nextImage() {
        const currentSrc = $slide.attr('src') || '';
        let currentIndex = slides.findIndex(img => currentSrc.includes(img.getURL()));
        if (currentIndex === -1) currentIndex = 0;
        const nextIndex = (currentIndex + 1) % slides.length;
        setSlide(nextIndex);
        previousIndex = nextIndex;
    }

    function randomImage() {
        let randomIndex = Math.floor(Math.random() * slides.length);
        // only avoid repeating the same index immediately
        while (randomIndex === previousIndex) {
            randomIndex = Math.floor(Math.random() * slides.length);
        }
        setSlide(randomIndex);
        previousIndex = randomIndex;
    }

    function setSlideShow(slides) {
        // Show first slide
        setSlide(0);
    }

    // Bind events with jQuery
    $nextBtn.on('click', nextImage);
    $randomBtn.on('click', randomImage);

    // Keyboard support: left = previous, right = next, r = random
    $(document).on('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'r' || e.key === 'R') {
            randomImage();
        }
    });

    // Initialize
    setSlideShow(slides);

    // Update time every second; update background only when hour changes
    setInterval(() => setBackgroundWithFade(images), 1000);
});


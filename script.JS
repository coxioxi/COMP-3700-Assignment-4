/*
  1) Do you think your jQuery code is easier to read than the corresponding (pure) JavaScript code, or harder? Why?

      For this program, the jQuery version is generally harder for me to read since I’m not very familiar with the jQuery API. 
      Moreover, I believe modern vanilla JavaScript has become much more readable over time. 
      However, for someone with more experience using jQuery, the jQuery version might actually be easier to understand. 
      In short, the readability advantage really depends on the context and the programmer’s familiarity with each approach.

  2) Is your jQuery program shorter than the corresponding (pure) JavaScript program?

      Yes, in this example the jQuery version is shorter for common tasks like selecting elements, updating attributes/text,
      binding events, and animations because jQuery combines multiple steps into single calls. The total file size difference is modest,
      but lines of code are reduced where DOM work is frequent.

  3) Are your answers to the above questions typical for comparisons of jQuery versus JavaScript in general? Why or why not?

      Yes and no, jQuery was created to make DOM manipulation, event handling, and animations simpler and more consistent across browsers, 	
      so it's often both easier to read and shorter compared to older vanilla JS. However, since modern browsers standardized many APIs, 
      native JS has closed the gap. For quick DOM-heavy scripts jQuery still offers concise, expressive code; 
      for modern apps, native JS or small utility libraries are often preferred.
*/

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

// jQuery
$(function() {

    const $beach = $('#beach');
    const $time = $('#time');
    const $date = $('#date');
    const $description = $('#description');
    const $slide = $('#slide');
    const $slideDescription = $('#slide-description');
    const $nextBtn = $('#next-image');
    const $randomBtn = $('#random-image');

    $description.attr('aria-live', 'polite');
    $slideDescription.attr('aria-live', 'polite');

    slides.forEach(s => {
        const img = new Image();
        img.src = s.getURL();
    });

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

        if (currentHour !== lastBackgroundHour || !$beach.attr('src')) {
            $beach.stop(true, true).fadeOut(300, function() {
                $beach.attr('src', images[index].getURL())
                      .attr('alt', images[index].getAttributeValue())
                      .fadeIn(300);
            });
            $description.text(images[index].getDescription());
            lastBackgroundHour = currentHour;
        }

        $time.text(now.toLocaleTimeString());
        $date.text(now.toLocaleDateString());
    }

    function setSlide(index) {
        const s = slides[index];
        $slide.stop(true, true).fadeOut(200, function() {
            $slide.attr('src', s.getURL()).attr('alt', s.getAttributeValue()).fadeIn(200);
        });
        $slideDescription.text(s.getDescription());
    }

    previousIndex = -1;
    function nextImage() {
        const currentSrc = $slide.attr('src') || '';
        let currentIndex = slides.findIndex(img => currentSrc.includes(img.getURL()));
        if (currentIndex === -1) currentIndex = 0;
        const nextIndex = (currentIndex + 1) % slides.length;
        setSlide(nextIndex);
        previousIndex = nextIndex;
    }

    function randomImage() {
        previousIndex = (previousIndex === -1) ? 0 : previousIndex;
        let randomIndex = Math.floor(Math.random() * slides.length);
        while (randomIndex === previousIndex) {
            randomIndex = Math.floor(Math.random() * slides.length);
        }
        setSlide(randomIndex);
        previousIndex = randomIndex;
    }

    function setSlideShow() {
        setSlide(0);
    }

    $nextBtn.on('click', nextImage);
    $randomBtn.on('click', randomImage);

    setSlideShow();

    setInterval(() => setBackgroundWithFade(images), 1000);
});


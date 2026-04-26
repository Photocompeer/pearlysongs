(function($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header');

        // Disable animations until page is loaded
        $body.addClass('is-loading');
        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });

        const firebaseConfig = {
            apiKey: "AIzaSyCHeqn6XDpPZUc46T1dl74maVruQhfYj9E",
            authDomain: "section-a-3bc20.firebaseapp.com",
            databaseURL: "https://section-a-3bc20-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "section-a-3bc20",
            storageBucket: "section-a-3bc20.firebasestorage.app",
            messagingSenderId: "944136450248",
            appId: "1:944136450248:web:72552f8accb738ebdd35fd",
            measurementId: "G-QS2J4SWS18"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const storage = firebase.storage();

        // 2. LOAD GALLERY IMAGES FROM FIREBASE
        function loadGallery() {
            const galleryRef = storage.ref('gallery/');
            const $galleryContainer = $('#dynamic-gallery');

            galleryRef.listAll().then((res) => {
                // If the gallery is empty, provide a fallback or message
                if (res.items.length === 0) {
                    console.log("No images found in Firebase 'gallery/' folder.");
                    return;
                }

                // Use an array of promises to wait for all URLs to fetch
                const promises = res.items.map((itemRef) => {
                    return itemRef.getDownloadURL().then((url) => {
                        return `<div><div class="image fit flush"><a href="${url}"><img src="${url}" alt="Gallery Image" /></a></div></div>`;
                    });
                });

                // Wait for all URLs, then append all at once and init Poptrox
                Promise.all(promises).then((htmlArray) => {
                    $galleryContainer.append(htmlArray.join(''));
                    
                    // Initialize poptrox once all items are added
                    $galleryContainer.poptrox({
                        usePopupCaption: true,
                        usePopupNav: true,
                        fadeSpeed: 300
                    });
                });

            }).catch((error) => {
                console.error("Error loading gallery:", error);
            });
        }

        loadGallery();

        // Prioritize "important" elements on medium
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

    });

})(jQuery);
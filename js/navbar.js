class Navbar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <nav class='navigation-container'>
                <a href="index.html"><img src="images/xas.png"></a>
                <input type="checkbox" id="mobile-menu-toggle" class="menu-toggle">
                <label for="mobile-menu-toggle" class="hamburger" aria-label="Open menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>
                <ul class="navigation">
                    <a href="about.html"><li>About Us</li></a>
                    <a href='events.html'><li>Events</li></a>
                    <li class="submenu">Activities
                        <ul class="drop-menu">
                            <a href='research.html'><li>Research</li></a>
                            <a href='intern.html'><li>Internship Resources</li></a>
                        </ul>
                    </li>
                    <li>FELO</li>
                </ul>
                <div class="mobile-menu">
                    <a href="events.html">Events</a>
                    <a href="research.html">Research</a>
                    <a href="intern.html">Internship Resources</a>
                    <a href="#">FELO</a>
                </div>
            </nav>`;
    }
}

customElements.define('xas-navbar', Navbar);

// -----------------------------------

function hideLoader() {
    function temp() {
        document.querySelector('#universe').addEventListener('transitionend', () => {
            document.querySelector('#universe').remove();
        })
        document.querySelector('#universe').style.opacity = "0";
    }

    // FIXME: change 1000 to 0 if not needed the seconds loadtime
    setTimeout(temp, 1000);
}

class Loader extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
		<!-- Loader -->
		<div class='loader'>
			<!--stylesheet-->
			<link rel="stylesheet" href="stylesheets/loader.css">

			<!-- Loader -->
			<div id='universe' class='is-preload'>
				<div id='galaxy'>
					<div class='circle'></div>
					<div class='circle2'></div>
					<div class='circle3'></div>
					<div id='orbit0'>
						<div id='pos0'>
							<div id='dot0'></div>
						</div>
					</div>
					<div id='orbit1'>
						<div id='pos1'>
							<div id='dot1'></div>
						</div>
					</div>
					<div id='orbit2'>
						<div id='pos2'>
							<div id='dot2'></div>
						</div>
					</div>
					<div id='orbit3'>
						<div id='pos3'>
							<div id='dot3'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
        `;
    }
}

customElements.define('xas-loader', Loader);

window.addEventListener('load', hideLoader);

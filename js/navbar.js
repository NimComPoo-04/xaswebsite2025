
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
                    <a href="about.html">About Us</a>
                    <a href="events.html">Events</a>
                    <a href="research.html">Research</a>
                    <a href="intern.html">Internship Resources</a>
                    <a href="#">FELO</a>
                </div>
            </nav>`;

        //this.classList.add('')
    }
}

customElements.define('xas-navbar', Navbar);

window.onload = () =>
console.log(document.querySelector('xas-navbar'))

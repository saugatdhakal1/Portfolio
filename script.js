const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 1;
        this.density = (Math.random() * 30) + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        if (this.baseX > canvas.width || this.baseX < 0) this.speedX *= -1;
        if (this.baseY > canvas.height || this.baseY < 0) this.speedY *= -1;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * this.density;
            this.y -= (dy / distance) * force * this.density;
        } else {
            this.x += (this.baseX - this.x) * 0.05;
            this.y += (this.baseY - this.y) * 0.05;
        }
    }
}

function init() {
    particlesArray = [];

    let numberOfParticles =
        window.innerWidth < 768
            ? (canvas.height * canvas.width) / 20000
            : (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            )
        );
    }
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                let opacity = 1 - (distance / 150);
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.draw();
        p.update();
    });
    connect();
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

new Typed('#typed', {
    strings: ['_ENGINEER.', '_DEVELOPER.', '_WEB_DESIGNER.', '_GAMER.'],
    typeSpeed: 70,
    backSpeed: 30,
    loop: true,
    cursorChar: '▉'
});

function toggleSidebar() {
    document.body.classList.toggle('mobile-nav-active');
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('mobile-nav-active');
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.progress-in');
            if (bar) bar.style.width = bar.getAttribute('data-percent');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-box').forEach(el => observer.observe(el));

const whatsappForm = document.getElementById("whatsappForm");

if (whatsappForm) {
    whatsappForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const message = document.getElementById("userMsg").value.trim();

        const phoneNumber = "9779766473802";
        const text = `Hello, I'm ${name}\n\n${message}`;

        const whatsappURL =
            "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(text);

        window.open(whatsappURL, "_blank");
    });
}

const githubUser = "Saugatdhakal1";

const loadingEl = document.getElementById("github-loading");
const errorEl = document.getElementById("github-error");
const contentEl = document.getElementById("github-content");

fetch(`https://api.github.com/users/${githubUser}`)
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(data => {
        loadingEl.style.display = "none";
        contentEl.style.display = "block";

        document.getElementById("github-avatar").src = data.avatar_url;
        document.getElementById("github-name").textContent = data.name || data.login;
        document.getElementById("github-bio").textContent = data.bio || "No bio available";
        document.getElementById("github-repos").textContent = data.public_repos;
        document.getElementById("github-followers").textContent = data.followers;
        document.getElementById("github-profile-link").href = data.html_url;
    })
    .catch(() => {
        loadingEl.style.display = "none";
        errorEl.style.display = "block";
        errorEl.textContent = "Failed to load GitHub profile.";
    });

fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated`)
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(repos => {
        const container = document.getElementById("repos-container");
        container.innerHTML = "";

        repos.slice(0, 6).forEach(repo => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <p>${repo.description || "No description"}</p>
                </div>
            `;
            container.appendChild(li);
        });
    })
    .catch(() => {
        document.getElementById("repos-container").innerHTML =
            "<li>Failed to load repositories</li>";
    });

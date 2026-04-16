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
        let distance = Math.sqrt(dx*dx + dy*dy);

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

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);

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

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target.querySelector('.progress-in');
            if (bar) bar.style.width = bar.getAttribute('data-percent');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-box').forEach(el => observer.observe(el));

// ────────────────────────────────────────────────
// GitHub Integration – Saugatdhakal1
// ────────────────────────────────────────────────

const GITHUB_USERNAME = 'Saugatdhakal1';

async function loadGitHubProfile() {
    const loading = document.getElementById('github-loading');
    const errorDiv = document.getElementById('github-error');
    const content = document.getElementById('github-content');
    const reposContainer = document.getElementById('repos-container');

    if (!loading || !content) return;

    try {
        // Profile
        const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!profileRes.ok) throw new Error('Profile fetch failed');
        const profile = await profileRes.json();

        document.getElementById('github-avatar').src = profile.avatar_url;
        document.getElementById('github-name').textContent = 'Saugat Dhakal';
        document.getElementById('github-bio').textContent = profile.bio || 'No bio available';
        document.getElementById('github-repos').textContent = profile.public_repos;
        document.getElementById('github-followers').textContent = profile.followers;
        document.getElementById('github-profile-link').href = profile.html_url;

        // Recent repos (5 most recently updated)
        const reposRes = await fetch(`${profile.repos_url}?sort=updated&per_page=5&direction=desc`);
        if (reposRes.ok) {
            const repos = await reposRes.json();
            reposContainer.innerHTML = '';
            repos.forEach(repo => {
                const li = document.createElement('li');
                li.style.padding = '18px';
                li.style.background = 'rgba(255,255,255,0.04)';
                li.style.borderRadius = '10px';
                li.style.border = '1px solid rgba(0,242,254,0.15)';
                li.innerHTML = `
                    <a href="${repo.html_url}" target="_blank" style="color:var(--accent); font-weight:700; text-decoration:none; font-size:1.1rem; display:block;">
                        ${repo.name}
                    </a>
                    <p style="margin:8px 0 0; color:#aaa; font-size:0.95rem;">
                        ${repo.description || 'No description'}
                    </p>
                `;
                reposContainer.appendChild(li);
            });
        }

        loading.style.display = 'none';
        content.style.display = 'block';

    } catch (err) {
        console.error(err);
        loading.style.display = 'none';
        errorDiv.textContent = 'Could not load GitHub profile right now.';
        errorDiv.style.display = 'block';
    }
}

window.addEventListener('load', loadGitHubProfile);
// ────────────────────────────────────────────────
// WhatsApp Form Handler
// ────────────────────────────────────────────────

const whatsappForm = document.getElementById("whatsappForm");

if (whatsappForm) {
    whatsappForm.addEventListener("submit", function (e) {
        e.preventDefault(); // stop page reload

        const name = document.getElementById("userName").value.trim();
        const message = document.getElementById("userMsg").value.trim();

        if (!name || !message) {
            alert("Please fill all fields.");
            return;
        }

        const phoneNumber = "9779766473802"; // NO +
        const text = `Hello, I'm ${name}\n\n${message}`;

        const whatsappURL =
            "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(text);

        window.open(whatsappURL, "_blank");
    });
}
